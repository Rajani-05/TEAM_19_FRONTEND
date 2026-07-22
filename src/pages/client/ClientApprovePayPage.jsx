import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClientEventView } from '../../api/eventApi';
import { initiatePayment, verifyPayment } from '../../api/paymentApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { resolveEventTheme } from '../../utils/theme';
import { 
  CreditCard, ShieldCheck, AlertCircle, Sparkles, ArrowLeft, Lock, CheckCircle2, Play
} from 'lucide-react';

const ClientApprovePayPage = () => {
  const { clientLinkToken } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Payment transaction states: 'idle' | 'initiating' | 'checkout' | 'verifying' | 'success' | 'failed'
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

  const handleSimulatePayment = async () => {
    if (!event) return;
    setPaymentState('initiating');
    setVerifyError('');

    try {
      const initiateRes = await initiatePayment(event.id, event.totalCost, 'CLIENT_TO_PLATFORM');
      if (!initiateRes.success || !initiateRes.data) {
        setPaymentState('idle');
        setVerifyError(initiateRes.message || 'Failed to initiate simulated order.');
        return;
      }

      const orderData = initiateRes.data;
      setPaymentState('verifying');

      // Add brief delay for loading effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const verifyRes = await verifyPayment(
        orderData.orderId,
        'pay_simulated_' + Math.random().toString(36).substring(7),
        'sig_simulated_bypass_check'
      );

      if (verifyRes.success) {
        setPaymentState('success');
      } else {
        setPaymentState('failed');
        setVerifyError(verifyRes.message || 'Signature simulation failed.');
      }
    } catch (err) {
      console.error(err);
      setPaymentState('failed');
      setVerifyError('Simulated verification failed: ' + (err.response?.data?.message || err.message));
    }
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
        setVerifyError('Razorpay payment gateway script failed to load. Check your internet connection.');
        return;
      }

      // 2. Initiate order server-side
      const initiateRes = await initiatePayment(event.id, event.totalCost, 'CLIENT_TO_PLATFORM');
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
          setPaymentState('verifying');
          try {
            const verifyRes = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyRes.success) {
              setPaymentState('success');
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
          color: '#10b981', // Green theme
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
  const theme = resolveEventTheme(event.title);

  return (
    <div className={`min-h-screen ${theme.bgClass} py-16 px-4 sm:px-6 lg:px-8 font-sans transition-all`}>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {!isApproved && paymentState === 'idle' ? (
          <div className="glass-card p-8 text-center space-y-4 shadow-xl border border-[var(--border-color)]">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-[var(--text-main)]">Proposal Awaiting Approval</h2>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
              Before checking out, you must first review and approve the vendor package proposal details.
            </p>
            <Link
              to={`/client-view/${clientLinkToken}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Review Proposal details
            </Link>
          </div>
        ) : (
          <div className="glass-card p-8 border border-[var(--border-color)] shadow-2xl">
            
            {/* 1. IDLE STATE */}
            {paymentState === 'idle' && (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 border border-emerald-400/20">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Complete Security Deposit</h1>
                  <p className="text-[var(--text-muted)] text-xs max-w-sm mx-auto leading-relaxed">
                    Confirm your booking rate for <span className="font-bold text-[var(--text-main)]">{event.title}</span>. Payment is processed securely through Razorpay.
                  </p>
                </div>

                {verifyError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs max-w-md mx-auto text-left flex gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] max-w-md mx-auto space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-muted)] font-semibold">Total Cost:</span>
                    <span className="text-xl font-black text-emerald-400">{formatPrice(event.totalCost)}</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] text-left border-t border-[var(--border-color)] pt-2 leading-relaxed flex items-center gap-1.5 justify-center">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Secure end-to-end payment gateway.</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <button
                    onClick={handlePayment}
                    className="w-full btn-primary py-3.5 px-4 rounded-xl text-sm font-bold shadow-lg transition-all"
                  >
                    Pay Hired Rates via Razorpay
                  </button>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full py-3 px-4 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span>Simulate Payment (Sandbox/Demo Mode)</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. INITIATING/CHECKOUT STATE */}
            {(paymentState === 'initiating' || paymentState === 'checkout') && (
              <div className="text-center py-16 space-y-4">
                <LoadingSpinner size="large" />
                <h3 className="text-lg font-bold text-[var(--text-main)]">Opening Payment Window</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto animate-pulse">
                  Please complete the payment in the checkout window. Do not close this browser page.
                </p>
              </div>
            )}

            {/* 3. VERIFYING STATE */}
            {paymentState === 'verifying' && (
              <div className="text-center py-16 space-y-4">
                <LoadingSpinner size="large" />
                <h3 className="text-lg font-bold text-[var(--text-main)]">Verifying Transaction Signature</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                  Confirming payment details with server. Please wait...
                </p>
              </div>
            )}

            {/* 4. SUCCESS STATE */}
            {paymentState === 'success' && (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Booking Confirmed!</h2>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                    Your package booking has been successfully secured. The event status is now set to COMPLETED/Settled.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--border-color)] max-w-md mx-auto text-xs text-[var(--text-muted)]">
                  Transaction status: verified & settled
                </div>
              </div>
            )}

            {/* 5. FAILED STATE */}
            {paymentState === 'failed' && (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Verification Failed</h2>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                    The transaction signature could not be verified by backend servers.
                  </p>
                </div>
                {verifyError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs max-w-md mx-auto text-left">
                    {verifyError}
                  </div>
                )}
                <button
                  onClick={() => setPaymentState('idle')}
                  className="px-5 py-2.5 btn-primary rounded-xl text-xs font-bold transition-all"
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
