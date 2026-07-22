import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';

const VendorCard = ({ vendor, showLink = true }) => {
  const { id, businessName, category, priceRange, description, averageRating, phoneNo, location, available } = vendor;

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
    AV: 'Audio-Visual & Sound',
    OTHER: 'Other Service'
  };

  return (
    <div className="glass-card hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden group">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {categoryLabels[category] || category}
              </span>
              {available !== false && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Available
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)] truncate group-hover:text-indigo-400 transition-colors">
              {businessName || 'Unnamed Vendor'}
            </h3>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{(averageRating || 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
          {description || 'No detailed description provided.'}
        </p>

        {/* Location & Phone */}
        <div className="space-y-1.5 pt-2 text-xs text-[var(--text-muted)]">
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {phoneNo && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{phoneNo}</span>
            </div>
          )}
        </div>

        {/* Price Tag */}
        <div className="pt-3 border-t border-[var(--border-color)] flex justify-between items-center text-xs">
          <span className="text-[var(--text-muted)] font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            Pricing:
          </span>
          <span className="font-bold text-[var(--text-main)]">
            {priceRange ? `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {showLink && (
        <div className="px-6 pb-6 pt-0">
          <Link
            to={`/planner/vendors/${id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-pink-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm"
          >
            View Vendor Profile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default VendorCard;
