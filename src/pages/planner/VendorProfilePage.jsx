import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendorById } from '../../api/vendorApi';
import { getReviewsByVendor } from '../../api/reviewApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { Star, ArrowLeft, Image as ImageIcon, Calendar, Tag, ShieldCheck } from 'lucide-react';

const VendorProfilePage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [vendorRes, reviewsRes] = await Promise.all([
          getVendorById(id),
          getReviewsByVendor(id)
        ]);

        if (vendorRes.success && vendorRes.data) {
          setVendor(vendorRes.data);
        } else {
          setError(vendorRes.message || 'Failed to retrieve vendor profile.');
        }

        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error occurred while loading profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [id]);

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

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} />;
  if (!vendor) return <ErrorBanner message="Vendor profile not found." />;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link 
          to="/planner/vendors" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendor Directory
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-violet-50 text-violet-700 border border-violet-100">
              {categoryLabels[vendor.category] || vendor.category}
            </span>
            {vendor.status === 'APPROVED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{vendor.businessName}</h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">{vendor.description}</p>
        </div>

        {/* Highlight Stats */}
        <div className="flex flex-row md:flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-150 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Average Rating</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900">{(vendor.averageRating || 0).toFixed(1)}</span>
              <div className="flex items-center text-amber-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
            </div>
          </div>
          <div className="flex-1 md:mt-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price Range</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">
              {vendor.priceRange ? `${formatPrice(vendor.priceRange.min)} - ${formatPrice(vendor.priceRange.max)}` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-violet-500" />
          Portfolio Gallery
        </h2>
        {!vendor.portfolioImages || vendor.portfolioImages.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
            No portfolio images have been uploaded by this vendor.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vendor.portfolioImages.map((image, idx) => (
              <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src={image} 
                  alt={`Portfolio ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                  onError={(e) => {
                    e.target.style.display = 'none'; // hide broken images
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review List */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-violet-500" />
          Client & Planner Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
            No reviews have been written for this vendor yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-650 uppercase">
                      {rev.reviewerId ? rev.reviewerId[0] : 'U'}
                    </span>
                    <span>Reviewer</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                <div className="text-[10px] text-slate-400 pt-1 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfilePage;
