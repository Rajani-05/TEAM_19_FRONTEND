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
  HelpCircle, AlertCircle
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
        setToastMsg(`Vendor package updated successfully!`);
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
      // Swap action
      handleSlotAction('SWAP', selectedVendorId, swapTargetId);
    } else {
      // Add action
      handleSlotAction('ADD', selectedVendorId);
    }
  };

  const handleRemoveSlot = (vendorId) => {
    if (window.confirm('Are you sure you want to remove this vendor from the event package?')) {
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
        // Generate shareable link
        const generatedUrl = `${window.location.origin}/client-view/${clientLinkToken}`;
        setClientLink(generatedUrl);
        setToastType('success');
        setToastMsg('Proposal submitted for approval!');
        
        // Refresh event status
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
    // Find if event has vendor in this category
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
    <div className="space-y-6">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Navigation Header */}
      <div className="flex justify-between items-center">
        <Link 
          to="/planner/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Planner Workspace
        </Link>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-100">
              Event Proposal
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border
              ${event.status === 'DRAFT' ? 'bg-slate-100 text-slate-650 border-slate-200' : ''}
              ${event.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' : ''}
              ${event.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : ''}
              ${event.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-150' : ''}
            `}>
              {event.status}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{event.title}</h1>
          <p className="text-slate-500 text-sm">Client Email: <span className="font-semibold text-slate-700">{event.clientEmail}</span></p>
        </div>

        {/* Submit Actions */}
        <div className="shrink-0 flex items-center gap-3">
          {event.status === 'DRAFT' && (
            <button
              onClick={handleSubmitProposal}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md shadow-violet-100 hover:shadow-violet-250 transition-all"
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </button>
          )}
        </div>
      </div>

      {/* Shareable Link Box */}
      {(clientLink || event.clientLinkToken) && (
        <div className="bg-violet-50 border border-violet-150 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-violet-850 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Proposal Shareable Client Link Generated</span>
          </div>
          <p className="text-xs text-violet-750">
            Share this link with your client. They can view the package details and approve or pay directly.
          </p>
          <div className="flex gap-2 items-center bg-white p-2 rounded-xl border border-violet-150">
            <input
              type="text"
              readOnly
              value={clientLink || `${window.location.origin}/client-view/${event.clientLinkToken}`}
              className="flex-1 bg-transparent text-xs text-slate-600 font-mono px-2 select-all outline-none border-none"
            />
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-700 hover:bg-violet-600 hover:text-white rounded-lg border border-slate-200 transition-all text-xs font-bold shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
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
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Allocated Vendor Slots</h2>
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
        title={swapTargetId ? `Swap Vendor — ${activeCategory}` : `Assign Vendor — ${activeCategory}`}
      >
        <div className="space-y-4">
          {/* Modal search bar */}
          <div className="relative">
            <input
              type="text"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              className="appearance-none block w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm text-slate-900 transition-all"
              placeholder="Search candidate vendors by name..."
            />
          </div>

          {/* Candidate list */}
          <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
            {modalCandidates.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No verified vendors found matching your search.
              </div>
            ) : (
              modalCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="p-4 rounded-xl border border-slate-150 hover:border-violet-300 bg-slate-50/50 flex justify-between items-center gap-4 hover:bg-violet-50/5 transition-all"
                >
                  <div className="truncate flex-1 space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{candidate.businessName}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{candidate.description}</p>
                    <div className="flex gap-2 items-center text-[10px] text-slate-400 font-semibold pt-1">
                      <span className="text-slate-800 font-bold">
                        {formatPrice(candidate.priceRange?.min)} - {formatPrice(candidate.priceRange?.max)}
                      </span>
                      <span>•</span>
                      <div className="flex items-center text-amber-500 gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{(candidate.averageRating || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectVendor(candidate.id)}
                    className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-750 text-white rounded-lg text-xs font-bold transition-all shadow-sm shrink-0"
                  >
                    Select
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
