import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClientEventView } from '../../api/eventApi';
import { initiatePayment, verifyPayment, getPaymentHistory } from '../../api/paymentApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { resolveEventTheme } from '../../utils/theme';
import { 
  CreditCard, ShieldCheck, AlertCircle, HelpCircle, 
  CheckCircle2, Sparkles, ArrowLeft, Heart, Lock
} from 'lucide-react';

const ClientApprovePayPage = () => {
  const { clientLinkToken } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Payment transaction states: 'idle' | 'initiating' | 'checkout' | 'verifying' | 'success' | 'webhook_pending' | 'failed'
  const [paymentState, setPaymentState] = useState('idle');
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getClientEventView(clientLinkToken);
        if (res.success && res.data) {
          setEvent(res.data);
        } else {
          setError(res.message || 'Failed to retrieve event checkout rates.');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error occurred while loading checkout page.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [clientLinkToken]);

  // Load Razorpay script dynamically
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Poll event payments to check if a successful payment was logged by webhook
  const pollPaymentStatus = async (eventId, attempts = 5) => {
    for (let i = 0; i < attempts; i++) {
      try {
        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        const res = await getPaymentHistory(eventId);
        if (res.success && res.data) {
          const successPayment = res.data.find(tx => tx.status === 'SUCCESS');
          if (successPayment) {
            return true; // Success!
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }
    return false; // Webhook confirmation pending
  };

  const handlePayment = async () => {
    if (!event) return;
    setPaymentState('initiating');
    setVerifyError('');

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        setPaymentState('idle');
        setVerifyError('Razorpay payment gateway script failed to load. Check your internet.');
        return;
      }

      // 2. Initiate order server-side with the correct body parameters required by our new backend
      const initiateRes = await initiatePayment(event.id, event.totalCost, 'CLIENT_TO_PLATFORM');
      // wrapper: { success: true, data: { orderId, amount, currency, razorpayKeyId } }
      if (!initiateRes.success || !initiateRes.data) {
        setPaymentState('idle');
        setVerifyError(initiateRes.message || 'Failed to initiate checkout order.');
        return;
      }

      const orderData = initiateRes.data;
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.razorpayKeyId;

      // 3. Configure Checkout popup options
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'EventPro Security Deposit',
        description: `Booking Package: ${event.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Triggered on checkout finish
          setPaymentState('verifying');
          try {
            // Send signature to verify in the request body as aligned
            const verifyRes = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyRes.success) {
              // Webhook handles status, let's poll to check
              const webhookConfirmed = await pollPaymentStatus(event.id);
              if (webhookConfirmed) {
                setPaymentState('success');
              } else {
                setPaymentState('webhook_pending');
              }
            } else {
              setPaymentState('failed');
              setVerifyError(verifyRes.message || 'Signature verification rejected by backend.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setPaymentState('failed');
            setVerifyError(err.response?.data?.message || 'Error occurred while verifying payment.');
          }
        },
        prefill: {
          email: event.clientEmail,
        },
        theme: {
          color: '#b45309', // Warm gold theme
        },
        modal: {
          ondismiss: function () {
            setPaymentState('idle');
          }
        }
      };

      // 4. Open Razorpay Checkout widget
      setPaymentState('checkout');
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setPaymentState('idle');
      setVerifyError('Error opening checkout. Please contact planner.');
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} />;
  if (!event) return <ErrorBanner message="Event proposal not found." />;

  const isApproved = event.status === 'APPROVED' || event.status === 'COMPLETED';
  
  // Resolve dynamic theme
  const theme = resolveEventTheme(event.title);

  return (
    <div className={`min-h-screen ${theme.bgClass} py-16 px-4 sm:px-6 lg:px-8 font-sans transition-all`}>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Guard verification check if the client tries to check out directly */}
        {!isApproved && paymentState === 'idle' ? (
          <div className="bg-amber-50/50 border border-amber-200/60 p-8 rounded-3xl text-center space-y-4 shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-700 mx-auto" />
            <h2 className="text-xl font-serif font-bold text-amber-900">Proposal Awaiting Approval</h2>
            <p className="text-xs text-amber-750 max-w-sm mx-auto leading-relaxed">
              Before checking out, you must first review and approve the vendor package proposal details.
            </p>
            <Link
              to={`/client-view/${clientLinkToken}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Review Proposal details
            </Link>
          </div>
        ) : (
          /* Payment Workspace States */
          <div className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-md">
            
            {/* 1. IDLE STATE */}
            {paymentState === 'idle' && (
              <div className="space-y-6 text-center py-8">
                <div className={`${theme.accentBg} ${theme.accentText} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border ${theme.accentBorder}`}>
                  <CreditCard className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-serif font-extrabold text-slate-950 tracking-tight">Complete Security Deposit</h1>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                    Confirm your booking rate for <span className="font-bold text-slate-800">{event.title}</span>. Payment is processed securely through Razorpay escrow.
                  </p>
                </div>

                {verifyError && (
                  <div className="p-4 bg-red-50 border border-red-150 rounded-xl text-red-700 text-xs max-w-md mx-auto text-left flex gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 max-w-md mx-auto space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Total Cost:</span>
                    <span className={`text-xl font-black ${theme.accentText}`}>{formatPrice(event.totalCost)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-left border-t border-slate-200 pt-2 leading-relaxed flex items-center gap-1.5 justify-center">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Secure end-to-end payment gateway.</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className={`w-full max-w-md inline-flex justify-center py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white transition-all ${theme.btnClass}`}
                >
                  Pay Hired Rates
                </button>
              </div>
            )}

            {/* 2. INITIATING/CHECKOUT STATE */}
            {(paymentState === 'initiating' || paymentState === 'checkout') && (
              <div className="text-center py-16 space-y-4">
                <LoadingSpinner size="large" />
                <h3 className="text-lg font-bold text-slate-900">Opening Razorpay Checkout</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto animate-pulse">
                  Please complete the payment in the checkout window. Do not close this browser.
                </p>
              </div>
            )}

            {/* 3. VERIFYING STATE */}
            {paymentState === 'verifying' && (
              <div className="text-center py-16 space-y-4">
                <LoadingSpinner size="large" />
                <h3 className="text-lg font-bold text-slate-900">Verifying Transaction Signature</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Confirming payment details with platform servers. Please wait...
                </p>
              </div>
            )}

            {/* 4. SUCCESS STATE */}
            {paymentState === 'success' && (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-extrabold text-slate-950 tracking-tight">Booking Confirmed!</h2>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                    Your package booking has been successfully secured. The planner and vendors have been notified.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 max-w-md mx-auto text-xs text-slate-400">
                  Transaction status: verified & settled
                </div>
              </div>
            )}

            {/* 5. WEBHOOK PENDING STATE */}
            {paymentState === 'webhook_pending' && (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-extrabold text-slate-950 tracking-tight">Payment Verification</h2>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                    Razorpay has processed your payment. We are awaiting final transaction settlement from the gateway webhook. We'll email you once confirmed.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 max-w-md mx-auto text-xs text-slate-400">
                  Transaction status: verification pending webhook confirmation
                </div>
              </div>
            )}

            {/* 6. FAILED STATE */}
            {paymentState === 'failed' && (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-extrabold text-slate-950 tracking-tight">Verification Failed</h2>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                    The transaction signature could not be verified. If funds were deducted, they will be automatically refunded, or contact your planner.
                  </p>
                </div>
                {verifyError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs max-w-md mx-auto text-left">
                    {verifyError}
                  </div>
                )}
                <button
                  onClick={() => setPaymentState('idle')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Retry Payment
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default ClientApprovePayPage;
