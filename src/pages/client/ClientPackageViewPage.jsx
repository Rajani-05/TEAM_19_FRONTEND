import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientEventView, approveClientEventView } from '../../api/eventApi';
import { getVendors } from '../../api/vendorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { Sparkles, Calendar, DollarSign, ShieldCheck, CheckCircle2, ArrowRight, Tag } from 'lucide-react';

const ClientPackageViewPage = () => {
  const { clientLinkToken } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eventRes, vendorsRes] = await Promise.all([
          getClientEventView(clientLinkToken),
          getVendors()
        ]);

        if (eventRes.success && eventRes.data) {
          setEvent(eventRes.data);
        } else {
          setError(eventRes.message || 'Failed to retrieve event proposal details.');
        }

        if (vendorsRes.success && vendorsRes.data) {
          setAllVendors(vendorsRes.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error occurred while loading proposal workspace.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [clientLinkToken]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await approveClientEventView(clientLinkToken);
      if (res.success) {
        setToastType('success');
        setToastMsg('Proposal package approved successfully!');
        // Navigate to check-out portal
        setTimeout(() => navigate(`/client-view/${clientLinkToken}/pay`), 1500);
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Approval failed.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error approving event package.');
    } finally {
      setApproving(false);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const categoryLabels = {
    VENUE: 'Venue Provider',
    CATERING: 'Catering Service',
    DECOR: 'Decorations',
    AV: 'Audio-Visual (AV)',
    OTHER: 'Other Service'
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} />;
  if (!event) return <ErrorBanner message="Proposal not found." />;

  // Resolve assigned vendors details
  const assignedVendors = (event.vendors || []).map((evVendor) => {
    const base = allVendors.find((v) => v.id === evVendor.vendorId);
    if (!base) return null;
    return {
      ...base,
      agreedPrice: evVendor.agreedPrice
    };
  }).filter(Boolean);

  const isApproved = event.status === 'APPROVED' || event.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Event Proposal For Review</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{event.title}</h1>
            <p className="text-slate-500 text-xs">Planner reference: <span className="font-semibold text-slate-700">{event.plannerId}</span></p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {isApproved ? (
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
                  <CheckCircle2 className="w-4 h-4" />
                  Approved Package
                </span>
                <button
                  onClick={() => navigate(`/client-view/${clientLinkToken}/pay`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all"
                >
                  Go to Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleApprove}
                disabled={approving}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-violet-600 hover:bg-violet-755 hover:bg-violet-700 rounded-xl shadow-md transition-all disabled:bg-violet-400"
              >
                {approving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Approve Package
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Pricing Summary card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Hired Package Cost</span>
            <span className="text-3xl font-black text-white mt-1 block">{formatPrice(event.totalCost)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Target Budget Limit</span>
            <span className="text-sm font-bold text-slate-300 mt-1 block">{formatPrice(event.targetBudget)}</span>
          </div>
        </div>

        {/* Assigned Vendors Details list */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Included Vendor Services</h2>
          {assignedVendors.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-400 text-xs shadow-sm">
              No vendors have been added to this proposal yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedVendors.map((v) => (
                <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between overflow-hidden">
                  <div className="space-y-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                      {categoryLabels[v.category] || v.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{v.businessName}</h3>
                    <p className="text-xs text-slate-500 leading-normal line-clamp-3">{v.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-450 font-bold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Agreed cost:
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {formatPrice(v.agreedPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPackageViewPage;
