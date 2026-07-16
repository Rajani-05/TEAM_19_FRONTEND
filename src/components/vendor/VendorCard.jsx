import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag, ArrowRight } from 'lucide-react';

const VendorCard = ({ vendor, showLink = true }) => {
  const { id, businessName, category, priceRange, description, averageRating, status } = vendor;

  // Format currency
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
    AV: 'Audio-Visual',
    OTHER: 'Other Service'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-violet-300 transition-all hover:shadow-lg shadow-sm hover:shadow-slate-100 flex flex-col justify-between overflow-hidden group">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-violet-50 text-violet-700 border border-violet-100">
              {categoryLabels[category] || category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2 truncate group-hover:text-violet-650 transition-colors">
              {businessName || 'Unnamed Vendor'}
            </h3>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{(averageRating || 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
          {description || 'No description provided by this vendor.'}
        </p>

        {/* Price Tag */}
        <div className="pt-4 border-t border-slate-150 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Price range:
          </span>
          <span className="font-bold text-slate-800">
            {priceRange ? `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Button link */}
      {showLink && (
        <div className="px-6 pb-6 pt-0">
          <Link
            to={`/planner/vendors/${id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all shadow-sm"
          >
            View Full Profile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default VendorCard;
