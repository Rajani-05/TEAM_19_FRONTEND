import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, User, Trash2, ArrowLeftRight, MessageSquare, Plus, CheckCircle, HelpCircle
} from 'lucide-react';

const VendorSlotCard = ({ category, slotVendor, onAssign, onRemove, onSwap, chatPath }) => {
  const categoryLabels = {
    VENUE: 'Venue Provider',
    CATERING: 'Catering Service',
    DECOR: 'Decorations',
    AV: 'Audio-Visual (AV)',
    OTHER: 'Other Service'
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all">
      {/* Category header */}
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {categoryLabels[category] || category}
        </span>
        {slotVendor ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3 h-3" />
            Allocated
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-500 border border-slate-200">
            <HelpCircle className="w-3 h-3" />
            Unassigned
          </span>
        )}
      </div>

      {/* Body content */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        {slotVendor ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900 truncate">
                {slotVendor.businessName || 'Vendor Profile'}
              </h4>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-slate-400 font-semibold">Agreed price:</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {formatPrice(slotVendor.agreedPrice || slotVendor.priceRange?.min)}
                </span>
              </div>
            </div>

            {/* Actions for allocated slot */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onSwap}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Swap
              </button>
              {chatPath && (
                <Link
                  to={chatPath}
                  className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-violet-600 bg-slate-50 border border-slate-250 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all shadow-sm"
                  title="Open Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={onRemove}
                className="inline-flex items-center justify-center p-2 text-red-500 hover:text-white hover:bg-red-650 border border-red-200 rounded-xl transition-all shadow-sm"
                title="Remove Vendor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <p className="text-xs text-slate-450 leading-relaxed max-w-[200px] mx-auto">
              Select and assign a vendor for this category to build your package.
            </p>
            <button
              onClick={onAssign}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm shadow-violet-100 hover:shadow-violet-250 transition-all"
            >
              <Plus className="w-4 h-4" />
              Assign Vendor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorSlotCard;
