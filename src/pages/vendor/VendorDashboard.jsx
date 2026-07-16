import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVendors } from '../../api/vendorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { Sparkles, Building, FileEdit, Award, Star, MessageSquare, Plus, DollarSign } from 'lucide-react';
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
        // Find profile associated with this vendor user
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
      {/* Title */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vendor Control Center</h1>
          <p className="text-slate-500 mt-1">Hello, {user?.name || 'Partner'}. Monitor registrations, reviews, and bookings.</p>
        </div>
        <div>
          <Link 
            to="/vendor/profile" 
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-755 hover:bg-violet-700 rounded-xl shadow-sm transition-all"
          >
            <FileEdit className="w-4 h-4" />
            {myProfile ? 'Edit Profile' : 'Create Profile'}
          </Link>
        </div>
      </div>

      {/* If profile doesn't exist */}
      {!myProfile ? (
        <div className="bg-amber-50 border border-amber-100 p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-amber-800">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-amber-900 flex items-center gap-2">
              <Building className="w-5.5 h-5.5" />
              Business Profile Registration Required
            </h3>
            <p className="text-xs text-amber-750 leading-relaxed max-w-xl">
              To start receiving quote requests and negotiation bids from event planners, you must first register your business details, service category, base price range, and portfolio.
            </p>
          </div>
          <Link
            to="/vendor/profile"
            className="px-5 py-3 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm shrink-0"
          >
            Register Profile Now
          </Link>
        </div>
      ) : (
        /* If profile exists */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Verification Badge</h2>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border uppercase
                  ${myProfile.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : ''}
                  ${myProfile.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' : ''}
                  ${myProfile.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                `}>
                  {myProfile.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-semibold">
                {myProfile.status === 'PENDING' && 'Pending moderator verification. It usually takes 24 hours.'}
                {myProfile.status === 'APPROVED' && 'Your profile is approved and live in the directory.'}
                {myProfile.status === 'REJECTED' && 'Your application was rejected. Please edit profile and apply again.'}
              </p>
            </div>

            {/* Price range Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Pricing Bracket</h2>
                <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm mt-1">
                  <DollarSign className="w-4 h-4 text-violet-500 shrink-0" />
                  <span>
                    {formatPrice(myProfile.priceRange?.min)} - {formatPrice(myProfile.priceRange?.max)}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-4 font-bold block uppercase tracking-wider">
                Category: {myProfile.category}
              </span>
            </div>

            {/* Rating Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Rating Score</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-3xl font-black text-slate-900">{(myProfile.averageRating || 0).toFixed(1)}</span>
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                </div>
              </div>
              <span className="text-[10px] text-slate-450 mt-4 font-bold block uppercase tracking-wider">
                Feedback Score from Planners
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions / Join Chat room */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-805 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-500" />
                Open Event Chat Room
              </h2>
              <p className="text-xs text-slate-450 leading-relaxed">
                Hired for an event? Input the Event ID shared by the planner to join the negotiation room and exchange messages.
              </p>
              <form onSubmit={handleAuditChat} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={queryEventId}
                  onChange={(e) => setQueryEventId(e.target.value)}
                  className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs text-slate-900 transition-all"
                  placeholder="Enter Event ID..."
                />
                <button
                  type="submit"
                  disabled={!queryEventId.trim()}
                  className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  Join Chat
                </button>
              </form>
            </div>

            {/* Profile Overview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-850 mb-2">My Service Listing</h2>
                <h3 className="font-bold text-slate-900 text-base mt-2">{myProfile.businessName}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {myProfile.description}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Portfolio: {myProfile.portfolioImages?.length || 0} images</span>
                <Link to="/vendor/profile" className="text-violet-600 hover:text-violet-755 font-bold">
                  Update Listing →
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
