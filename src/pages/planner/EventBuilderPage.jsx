import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById, updateEventVendors, submitEventForApproval } from '../../api/eventApi';
import { getVendors } from '../../api/vendorApi';
import BudgetSummaryBar from '../../components/event/BudgetSummaryBar';
import VendorSlotCard from '../../components/event/VendorSlotCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { 
  Sparkles, ArrowLeft, Send, Copy, Check, Star, Filter, 
  HelpCircle, AlertCircle, Plus, RefreshCw, Trash2, Building 
} from 'lucide-react';

const EventBuilderPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selection Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [swapTargetId, setSwapTargetId] = useState(null); // id of vendor to replace if swapping
  const [modalSearch, setModalSearch] = useState('');

  // Toast & Share link state
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [clientLink, setClientLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Load event details and available vendors
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventRes, vendorsRes] = await Promise.all([
        getEventById(id),
        getVendors()
      ]);

      if (eventRes.success && eventRes.data) {
        setEvent(eventRes.data);
      } else {
        setError(eventRes.message || 'Failed to retrieve event.');
      }

      if (vendorsRes.success && vendorsRes.data) {
        setAllVendors(vendorsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while connecting to server.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Format currency
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Trigger add/remove/swap action on slots
  const handleSlotAction = async (actionType, vendorId, replaceId = null) => {
    try {
      const res = await updateEventVendors(id, actionType, vendorId, replaceId);
      if (res.success && res.data) {
        setEvent(res.data); // Update event with new total cost directly from backend
        setToastType('success');
        setToastMsg(`Event package updated: ${actionType.toLowerCase()}ed vendor successfully!`);
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Action failed.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error updating event packages.');
    }
  };

  const handleOpenAssignModal = (category) => {
    setActiveCategory(category);
    setSwapTargetId(null);
    setModalSearch('');
    setModalOpen(true);
  };

  const handleOpenSwapModal = (category, currentVendorId) => {
    setActiveCategory(category);
    setSwapTargetId(currentVendorId);
    setModalSearch('');
    setModalOpen(true);
  };

  const handleSelectVendor = (selectedVendorId) => {
    setModalOpen(false);
    if (swapTargetId) {
      handleSlotAction('SWAP', selectedVendorId, swapTargetId);
    } else {
      handleSlotAction('ADD', selectedVendorId);
    }
  };

  const handleRemoveSlot = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor from the event package?')) {
      handleSlotAction('REMOVE', vendorId);
    }
  };

  // Submit package for client approval
  const handleSubmitProposal = async () => {
    if (!event) return;
    try {
      const res = await submitEventForApproval(id);
      if (res.success && res.data) {
        const { clientLinkToken } = res.data;
        const generatedUrl = `${window.location.origin}/client-view/${clientLinkToken}`;
        setClientLink(generatedUrl);
        setToastType('success');
        setToastMsg('Proposal submitted for approval!');
        
        setEvent(prev => ({ ...prev, status: 'PENDING_APPROVAL', clientLinkToken }));
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error submitting event proposal.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;
  if (!event) return <ErrorBanner message="Event proposal not found." />;

  // Resolve allocated vendor details
  const categories = ['VENUE', 'CATERING', 'DECOR', 'AV', 'OTHER'];
  const allocatedSlots = categories.reduce((acc, cat) => {
    const eventAlloc = event.vendors?.find((evVendor) => {
      const resolved = allVendors.find((v) => v.id === evVendor.vendorId);
      return resolved && resolved.category === cat;
    });

    if (eventAlloc) {
      const baseVendor = allVendors.find((v) => v.id === eventAlloc.vendorId);
      acc[cat] = {
        ...baseVendor,
        agreedPrice: eventAlloc.agreedPrice,
        locked: eventAlloc.locked
      };
    } else {
      acc[cat] = null;
    }
    return acc;
  }, {});

  // Candidates for modal view
  const modalCandidates = allVendors.filter(
    (v) => 
      v.category === activeCategory &&
      v.status === 'APPROVED' &&
      v.businessName.toLowerCase().includes(modalSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Navigation Header */}
      <div className="flex justify-between items-center">
        <Link 
          to="/planner/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Planner Workspace
        </Link>
      </div>

      {/* Main Title Banner */}
      <div className="glass-card p-8 border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Event Proposal Package
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border
              ${event.status === 'DRAFT' ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : ''}
              ${event.status === 'PENDING_APPROVAL' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse' : ''}
              ${event.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
              ${event.status === 'COMPLETED' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : ''}
            `}>
              {event.status}
            </span>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">{event.title}</h1>
          <p className="text-[var(--text-muted)] text-sm">Assigned Client: <span className="font-bold text-[var(--text-main)]">{event.clientEmail}</span></p>
        </div>

        {/* Submit Actions */}
        <div className="shrink-0 flex items-center gap-3">
          {event.status === 'DRAFT' && (
            <button
              onClick={handleSubmitProposal}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all"
            >
              <Send className="w-4 h-4" />
              Submit Package to Client
            </button>
          )}
        </div>
      </div>

      {/* Shareable Link Box */}
      {(clientLink || event.clientLinkToken) && (
        <div className="glass-card p-6 border border-[var(--border-color)] bg-emerald-500/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Proposal Shareable Client Link Active</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Share this token link with your client Rishika. They can inspect the package, approve vendor items, or checkout securely.
          </p>
          <div className="flex gap-2 items-center bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-color)]">
            <input
              type="text"
              readOnly
              value={clientLink || `${window.location.origin}/client-view/${event.clientLinkToken}`}
              className="flex-1 bg-transparent text-xs text-[var(--text-main)] font-mono px-2 select-all outline-none border-none"
            />
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 btn-primary rounded-lg text-xs font-bold shrink-0 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Client Link
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Budget Progression Indicator */}
      <BudgetSummaryBar targetBudget={event.targetBudget} totalCost={event.totalCost} />

      {/* Vendor Slots Layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-pink-400" />
            Package Vendor Category Slots
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-semibold">
            Use + Add Vendor, Swap Vendor, or Delete buttons below
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <VendorSlotCard
              key={cat}
              category={cat}
              slotVendor={allocatedSlots[cat]}
              onAssign={() => handleOpenAssignModal(cat)}
              onRemove={() => handleRemoveSlot(allocatedSlots[cat].id)}
              onSwap={() => handleOpenSwapModal(cat, allocatedSlots[cat].id)}
              chatPath={allocatedSlots[cat] ? `/planner/chat/${event.id}?vendorId=${allocatedSlots[cat].userId}` : null}
            />
          ))}
        </div>
      </div>

      {/* Selection Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={swapTargetId ? `Swap Vendor — Category: ${activeCategory}` : `Add / Assign Vendor — Category: ${activeCategory}`}
      >
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-[var(--text-muted)]"
              placeholder="Search candidate vendors by business name..."
            />
          </div>

          {/* Candidate list */}
          <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
            {modalCandidates.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)] text-xs border border-dashed border-[var(--border-color)] rounded-xl">
                No verified vendors found for category "{activeCategory}".
              </div>
            ) : (
              modalCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-emerald-500/40 flex justify-between items-center gap-4 transition-all"
                >
                  <div className="truncate flex-1 space-y-1">
                    <h4 className="font-extrabold text-[var(--text-main)] text-sm truncate">{candidate.businessName}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{candidate.description}</p>
                    <div className="flex gap-2 items-center text-[10px] font-semibold pt-1">
                      <span className="text-emerald-400 font-bold">
                        {formatPrice(candidate.priceRange?.min)} - {formatPrice(candidate.priceRange?.max)}
                      </span>
                      <span className="text-[var(--text-muted)]">•</span>
                      <div className="flex items-center text-amber-400 gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{(candidate.averageRating || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectVendor(candidate.id)}
                    className="px-4 py-2 btn-primary rounded-xl text-xs font-bold shadow-md shrink-0 transition-all"
                  >
                    Select Vendor
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventBuilderPage;
