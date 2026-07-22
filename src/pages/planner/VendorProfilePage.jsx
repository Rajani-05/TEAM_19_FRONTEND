import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendorById } from '../../api/vendorApi';
import { getReviewsByVendor } from '../../api/reviewApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { 
  Star, ArrowLeft, Image as ImageIcon, Calendar, ShieldCheck, Phone, 
  MapPin, Award, UserCheck, CheckCircle2, XCircle, CalendarDays, ExternalLink, X, ZoomIn 
} from 'lucide-react';

const VendorProfilePage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [activeModalImage, setActiveModalImage] = useState(null);

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
    DECOR: 'Decorations & Styling',
    AV: 'Audio-Visual & Sound',
    OTHER: 'Other Event Services'
  };

  const fallbackImage = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} />;
  if (!vendor) return <ErrorBanner message="Vendor profile not found." />;

  return (
    <div className="space-y-6">
      <div>
        <Link 
          to="/planner/vendors" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendor Directory
        </Link>
      </div>

      {/* Profile Header */}
      <div className="glass-card p-8 border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {categoryLabels[vendor.category] || vendor.category}
            </span>
            {vendor.status === 'APPROVED' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Vendor
              </span>
            )}
            {vendor.available !== false ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available for Booking
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5" />
                Fully Booked
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tight">{vendor.businessName}</h1>
          <p className="text-[var(--text-muted)] max-w-2xl leading-relaxed text-sm md:text-base">{vendor.description}</p>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[var(--border-color)]">
            {vendor.phoneNo && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-main)] font-medium">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{vendor.phoneNo}</span>
              </div>
            )}
            {vendor.location && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-main)] font-medium">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{vendor.location}</span>
              </div>
            )}
            {vendor.experienceYears > 0 && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-main)] font-medium">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{vendor.experienceYears}+ Years Experience</span>
              </div>
            )}
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="flex flex-row md:flex-col gap-4 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-4 md:pt-0 md:pl-8 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">Rating Score</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-black text-[var(--text-main)]">{(vendor.averageRating || 0).toFixed(1)}</span>
              <div className="flex items-center text-amber-400">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">({reviews.length} reviews)</span>
            </div>
          </div>
          <div className="md:mt-3">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">Price Bounds</span>
            <span className="text-base font-extrabold text-emerald-400 mt-1 block">
              {vendor.priceRange ? `${formatPrice(vendor.priceRange.min)} - ${formatPrice(vendor.priceRange.max)}` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Gallery */}
      <div className="glass-card p-8 border border-[var(--border-color)]">
        <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-400" />
          Portfolio Gallery & Reference Photography
        </h2>
        {!vendor.portfolioImages || vendor.portfolioImages.length === 0 ? (
          <div className="border border-dashed border-[var(--border-color)] rounded-xl p-8 text-center text-[var(--text-muted)] text-xs">
            No portfolio images uploaded for this vendor yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendor.portfolioImages.map((image, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveModalImage(image)}
                className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-color)] group cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img 
                  src={image} 
                  alt={`Portfolio reference ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-[2px]">
                  <ZoomIn className="w-5 h-5 text-emerald-400" />
                  <span>Click to Expand</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal for Portfolio Links */}
      {activeModalImage && (
        <div 
          className="fixed inset-y-0 inset-x-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Portfolio Reference View
              </h3>
              <div className="flex items-center gap-2">
                <a 
                  href={activeModalImage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] rounded-lg text-emerald-400 text-xs font-semibold inline-flex items-center gap-1 border border-[var(--border-color)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </a>
                <button 
                  onClick={() => setActiveModalImage(null)}
                  className="p-1.5 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="max-h-[75vh] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center">
              <img 
                src={activeModalImage} 
                alt="Full size view" 
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Availability Calendar (Read-only for planners) */}
      <div className="glass-card p-8 border border-[var(--border-color)]">
        <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-emerald-400" />
          Availability Calendar
        </h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">Green = Available, Red = Blocked/Booked by vendor.</p>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCalendarMonth(prev => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; })} className="px-3 py-1.5 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--text-main)] transition-all">← Prev</button>
            <span className="text-sm font-bold text-[var(--text-main)]">{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setCalendarMonth(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; })} className="px-3 py-1.5 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--text-main)] transition-all">Next →</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              const year = calendarMonth.getFullYear();
              const month = calendarMonth.getMonth();
              const firstDay = new Date(year, month, 1).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const blocked = vendor.blockedDates || [];
              const cells = [];
              for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const isBlocked = blocked.includes(dateStr);
                const today = new Date();
                const isPast = new Date(dateStr) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                cells.push(
                  <div
                    key={dateStr}
                    className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center ${
                      isPast ? 'text-[var(--text-muted)] opacity-30' :
                      isBlocked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {day}
                  </div>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="glass-card p-8 border border-[var(--border-color)]">
        <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          Client Reviews & Ratings ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <div className="border border-dashed border-[var(--border-color)] rounded-xl p-8 text-center text-[var(--text-muted)] text-xs">
            No client reviews posted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                    <span className="w-8 h-8 bg-emerald-600/30 text-emerald-300 rounded-full flex items-center justify-center font-bold uppercase border border-emerald-500/30">
                      {rev.reviewerId ? rev.reviewerId[0] : 'U'}
                    </span>
                    <span>Reviewer</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{rev.comment}</p>
                <div className="text-[10px] text-[var(--text-muted)] pt-1 font-semibold flex items-center gap-1">
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
