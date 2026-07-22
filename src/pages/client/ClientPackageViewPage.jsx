import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientEventView, approveClientEventView } from '../../api/eventApi';
import { getVendors } from '../../api/vendorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { resolveEventTheme } from '../../utils/theme';
import { 
  Sparkles, Calendar, ShieldCheck, CheckCircle2, ArrowRight, Tag, Info, 
  User, Phone, MapPin, Star, Image as ImageIcon, ZoomIn, ExternalLink, X 
} from 'lucide-react';

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
  const [activeModalImage, setActiveModalImage] = useState(null);

  const fallbackImage = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

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
    DECOR: 'Decorations & Styling',
    AV: 'Audio-Visual & DJ',
    OTHER: 'Other Service'
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} />;
  if (!event) return <ErrorBanner message="Proposal not found." />;

  const assignedVendors = (event.vendors || []).map((evVendor) => {
    const base = allVendors.find((v) => v.id === evVendor.vendorId);
    if (!base) return null;
    return {
      ...base,
      agreedPrice: evVendor.agreedPrice
    };
  }).filter(Boolean);

  const isApproved = event.status === 'APPROVED' || event.status === 'COMPLETED';
  const theme = resolveEventTheme(event.title);

  return (
    <div className={`min-h-screen ${theme.bgClass} pb-20 font-sans transition-all`}>
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Hero Showcase Image Banner */}
      <div className="relative h-[300px] w-full overflow-hidden border-b border-slate-200/40">
        <img 
          src={theme.heroImage} 
          alt={`${theme.name} Decor`} 
          className="w-full h-full object-cover filter brightness-[0.78]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:left-12 max-w-4xl text-white space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Curated Proposal Package
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-8 space-y-6">
        {/* Proposal Header Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Event Details</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                Created on {new Date(event.createdAt).toLocaleDateString('en-IN')}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-slate-400" />
                Client Reference: {event.clientEmail}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {isApproved ? (
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Approved Package
                </span>
                <button
                  onClick={() => navigate(`/client-view/${clientLinkToken}/pay`)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleApprove}
                disabled={approving}
                className={`inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl shadow-md transition-all ${theme.btnClass}`}
              >
                {approving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5" />
                    Approve Package Proposal
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Pricing Summary card */}
        <div className={`${theme.summaryBg} ${theme.summaryText} p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md border border-black/10`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">Hired Package Total Cost</span>
            <span className="text-3xl font-black text-white block">{formatPrice(event.totalCost)}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">Target Budget Limit</span>
            <span className="text-sm font-bold text-white mt-1 block">{formatPrice(event.targetBudget)}</span>
          </div>
        </div>

        {/* Assigned Vendors Details & Services List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Included Vendor Services ({assignedVendors.length})</h2>
          </div>

          {assignedVendors.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/60 text-center text-slate-400 text-xs shadow-sm flex flex-col items-center gap-3">
              <Info className="w-10 h-10 text-slate-300" />
              <span>No vendor services have been added to this package proposal yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedVendors.map((v) => (
                <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${theme.badgeClass}`}>
                        {categoryLabels[v.category] || v.category}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        <span>{(v.averageRating || 0).toFixed(1)}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{v.businessName}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{v.description}</p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1 text-xs text-slate-500 pt-1">
                      {v.location && (
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" /> Location: {v.location}</p>
                      )}
                      {v.phoneNo && (
                        <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Contact: {v.phoneNo}</p>
                      )}
                    </div>

                    {/* Vendor Offered Services */}
                    {v.servicesOffered && v.servicesOffered.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vendor Services Included:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {v.servicesOffered.map((srv, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700">
                              ✓ {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Portfolio Images Gallery */}
                    {v.portfolioImages && v.portfolioImages.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-slate-400" />
                          Portfolio Gallery ({v.portfolioImages.length})
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {v.portfolioImages.map((img, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setActiveModalImage(img)}
                              className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group relative"
                            >
                              <img 
                                src={img} 
                                alt={`Portfolio ${idx + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <ZoomIn className="w-4 h-4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Agreed Service Cost
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

      {/* Lightbox Modal for Portfolio View */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Portfolio Reference View
              </h3>
              <button 
                onClick={() => setActiveModalImage(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center rounded-xl overflow-hidden">
              <img 
                src={activeModalImage} 
                alt="Portfolio view" 
                className="max-h-[65vh] w-auto object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPackageViewPage;
