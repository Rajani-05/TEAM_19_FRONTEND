import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVendors } from '../../api/vendorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { Sparkles, Building, FileEdit, Star, MessageSquare, DollarSign, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryEventId, setQueryEventId] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVendors();
      if (response.success && response.data) {
        const profile = response.data.find(v => v.userId === user?.id || v.userId === user?.email);
        setMyProfile(profile || null);
      } else {
        setError(response.message || 'Failed to check profile logs.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while loading dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleAuditChat = (e) => {
    e.preventDefault();
    if (queryEventId.trim()) {
      navigate(`/vendor/chat/${queryEventId.trim()}`);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} onRetry={fetchProfile} />;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-card p-8 border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              VENDOR PARTNER WORKSPACE
            </span>
            {user?.gender && (
              <span className="text-xs text-[var(--text-muted)] capitalize">({user.gender})</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tight">
            Vendor Control Center
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl text-sm md:text-base">
            Hello, {user?.name || 'Partner'}. Manage your business profile, service rates, portfolio, and planner conversations.
          </p>
          {user?.phoneNo && (
            <p className="text-xs text-indigo-400 font-medium pt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Contact: {user.phoneNo}</span>
            </p>
          )}
        </div>
        <div>
          <Link 
            to="/vendor/profile" 
            className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg"
          >
            <FileEdit className="w-5 h-5" />
            <span>{myProfile ? 'Edit Profile & Services' : 'Register Service Profile'}</span>
          </Link>
        </div>
      </div>

      {/* If profile doesn't exist */}
      {!myProfile ? (
        <div className="glass-card p-8 border border-amber-500/30 bg-amber-500/10 text-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-amber-200 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Service Listing Registration Required
            </h3>
            <p className="text-xs text-amber-300/80 leading-relaxed max-w-2xl">
              To appear in the Event Planner sourcing directory and receive booking inquiries, register your business details, service category, location, phone number, and price range.
            </p>
          </div>
          <Link
            to="/vendor/profile"
            className="px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl transition-all shadow-md shrink-0"
          >
            Register Profile Now
          </Link>
        </div>
      ) : (
        /* If profile exists */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Card */}
            <div className="glass-card p-6 border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-3">Directory Status</h2>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border uppercase
                  ${myProfile.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
                  ${myProfile.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse' : ''}
                  ${myProfile.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : ''}
                `}>
                  {myProfile.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-4 leading-relaxed font-semibold">
                {myProfile.status === 'APPROVED' && 'Your business listing is active in the Planner Directory.'}
                {myProfile.status === 'PENDING' && 'Pending moderator verification.'}
              </p>
            </div>

            {/* Price Range Card */}
            <div className="glass-card p-6 border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-3">Service Pricing Bracket</h2>
                <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-base mt-1">
                  <DollarSign className="w-5 h-5 shrink-0" />
                  <span>
                    {formatPrice(myProfile.priceRange?.min)} - {formatPrice(myProfile.priceRange?.max)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-4 font-bold block uppercase tracking-wider">
                Category: {myProfile.category}
              </span>
            </div>

            {/* Rating Card */}
            <div className="glass-card p-6 border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-3">Client Feedback Score</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-black text-[var(--text-main)]">{(myProfile.averageRating || 0).toFixed(1)}</span>
                  <Star className="w-6 h-6 text-amber-400 fill-current" />
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-4 font-bold block uppercase tracking-wider">
                Overall Service Rating
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Join Event Chat Room */}
            <div className="glass-card p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                Join Event Chat Room
              </h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Hired for an event? Input the Event ID provided by the planner to enter the direct messaging room and coordinate package terms.
              </p>
              <form onSubmit={handleAuditChat} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={queryEventId}
                  onChange={(e) => setQueryEventId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Enter Event ID..."
                />
                <button
                  type="submit"
                  disabled={!queryEventId.trim()}
                  className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold shrink-0"
                >
                  Join Chat
                </button>
              </form>
            </div>

            {/* Profile Overview */}
            <div className="glass-card p-6 border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                  <Building className="w-5 h-5 text-pink-400" />
                  Service Listing Details
                </h2>
                <h3 className="font-bold text-[var(--text-main)] text-base mt-2">{myProfile.businessName}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-3 leading-relaxed">
                  {myProfile.description}
                </p>
                {myProfile.location && (
                  <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    {myProfile.location}
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-[var(--border-color)] mt-4 flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-semibold">Portfolio: {myProfile.portfolioImages?.length || 0} images</span>
                <Link to="/vendor/profile" className="text-indigo-400 hover:text-indigo-300 font-bold">
                  Update Listing Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
