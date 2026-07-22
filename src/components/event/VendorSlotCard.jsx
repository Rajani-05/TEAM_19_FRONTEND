import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, User, Trash2, ArrowLeftRight, MessageSquare, Plus, CheckCircle2, HelpCircle, Phone, Tag 
} from 'lucide-react';

const VendorSlotCard = ({ category, slotVendor, onAssign, onRemove, onSwap, chatPath }) => {
  const categoryLabels = {
    VENUE: 'Venue Provider',
    CATERING: 'Catering Service',
    DECOR: 'Decorations & Styling',
    AV: 'Audio-Visual (AV & DJ)',
    OTHER: 'Other Special Service'
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="glass-card border border-[var(--border-color)] overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
      {/* Category Header */}
      <div className="bg-[var(--bg-surface-glass)] px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          {categoryLabels[category] || category}
        </span>
        {slotVendor ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Allocated
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <HelpCircle className="w-3 h-3" />
            Unassigned Slot
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
        {slotVendor ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-black text-[var(--text-main)] truncate">
                {slotVendor.businessName || 'Vendor Profile'}
              </h4>
              
              {slotVendor.phoneNo && (
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{slotVendor.phoneNo}</span>
                </p>
              )}

              <div className="flex justify-between items-center mt-3 p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] text-xs">
                <span className="text-[var(--text-muted)] font-semibold">Agreed Price:</span>
                <span className="font-black text-emerald-400 text-sm">
                  {formatPrice(slotVendor.agreedPrice || slotVendor.priceRange?.min)}
                </span>
              </div>
            </div>

            {/* Actions for Allocated Slot: Swap, Chat, Delete */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]">
              {/* SWAP VENDOR BUTTON */}
              <button
                onClick={onSwap}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl transition-all shadow-sm"
                title="Replace this vendor with another candidate"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-pink-400" />
                <span>Swap Vendor</span>
              </button>

              {/* CHAT WITH VENDOR BUTTON */}
              {chatPath && (
                <Link
                  to={chatPath}
                  className="p-2 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all shadow-sm flex items-center justify-center"
                  title="Open Chat with Vendor"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              )}

              {/* DELETE VENDOR BUTTON */}
              <button
                onClick={onRemove}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all shadow-sm"
                title="Remove / Delete Vendor from Package"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[200px] mx-auto">
              Select and assign a verified vendor for this category to build your package.
            </p>
            {/* ADD / ASSIGN VENDOR BUTTON */}
            <button
              onClick={onAssign}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white btn-primary rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Vendor</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorSlotCard;
