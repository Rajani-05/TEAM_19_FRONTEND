import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVendors } from '../../api/vendorApi';
import { getMyEvents } from '../../api/eventApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { 
  Sparkles, Compass, Plus, History, Calendar, Building, ShieldCheck, 
  User, Star, MapPin, Phone, ExternalLink, CheckCircle2, DollarSign, Tag, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PlannerDashboard = () => {
  const { user } = useAuth();

  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlannerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vendorsRes, eventsRes] = await Promise.all([
        getVendors(),
        getMyEvents().catch(() => ({ success: false, data: [] }))
      ]);

      if (vendorsRes.success && vendorsRes.data) {
        setVendors(vendorsRes.data);
      }
      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load planner dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannerData();
  }, []);

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
    OTHER: 'Other Services'
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} onRetry={fetchPlannerData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-8 border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role || 'PLANNER'} WORKSPACE
            </span>
            {user?.gender && (
              <span className="text-xs text-[var(--text-muted)] capitalize">({user.gender})</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tight">
            Welcome back, {user?.name || 'Planner'}! 👋
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl text-sm md:text-base">
            Your centralized event planning workspace. Build event packages, negotiate with vendors, and manage client bookings.
          </p>
          {user?.phoneNo && (
            <p className="text-xs text-emerald-400 font-medium pt-1">
              Registered Contact: {user.phoneNo}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link to="/planner/create-event" className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg">
            <Plus className="w-5 h-5" />
            <span>Create New Event</span>
          </Link>
          <Link to="/planner/vendors" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl font-bold text-sm transition-all shadow-sm">
            <Compass className="w-5 h-5 text-pink-400" />
            <span>Vendor Directory</span>
          </Link>
        </div>
      </div>

      {/* SECTION 1: Active Event Packages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2 tracking-tight">
              <Calendar className="w-6 h-6 text-emerald-400" />
              Active Event Proposals & Packages ({events.length})
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Manage created proposals, total budget caps, and assigned vendor packages.</p>
          </div>
          <Link to="/planner/create-event" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
            + New Proposal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="glass-card p-8 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-color)] space-y-3">
            <Calendar className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <p>No active event proposals created yet.</p>
            <Link to="/planner/create-event" className="inline-block px-4 py-2 btn-primary rounded-xl text-xs font-bold">
              Build Your First Event Package
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="glass-card p-6 border border-[var(--border-color)] flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                      event.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      event.status === 'COMPLETED' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {event.status}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{event.vendors?.length || 0} Vendors</span>
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base truncate">{event.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">Client: <span className="font-semibold text-[var(--text-main)]">{event.clientEmail}</span></p>

                  <div className="bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-color)] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Target Budget:</span>
                      <span className="font-bold text-[var(--text-main)]">{formatPrice(event.targetBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Package Cost:</span>
                      <span className="font-black text-emerald-400">{formatPrice(event.totalCost)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex gap-2">
                  <Link
                    to={`/planner/event-builder/${event.id}`}
                    className="flex-1 text-center py-2 px-3 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl text-xs font-bold transition-all"
                  >
                    Open Builder
                  </Link>
                  {event.clientLinkToken && (
                    <a
                      href={`/client-view/${event.clientLinkToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all"
                      title="Preview Client Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Verified Marketplace Vendors & Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2 tracking-tight">
              <Building className="w-6 h-6 text-pink-400" />
              Verified Marketplace Vendors & Services ({vendors.length})
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Explore available venues, caterers, decor artists, and sound engineering teams.</p>
          </div>
          <Link to="/planner/vendors" className="text-xs font-bold text-pink-400 hover:text-pink-300 inline-flex items-center gap-1">
            Browse All Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {vendors.length === 0 ? (
          <div className="glass-card p-8 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-color)]">
            No approved vendor profiles registered in the system.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="glass-card p-6 border border-[var(--border-color)] flex flex-col justify-between space-y-4 hover:border-pink-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {categoryLabels[vendor.category] || vendor.category}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{(vendor.averageRating || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base truncate">{vendor.businessName}</h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">{vendor.description}</p>

                  {/* Metadata */}
                  <div className="space-y-1.5 text-xs text-[var(--text-muted)] pt-1">
                    {vendor.location && (
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" /> {vendor.location}</p>
                    )}
                    {vendor.phoneNo && (
                      <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {vendor.phoneNo}</p>
                    )}
                    {vendor.priceRange && (
                      <p className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {formatPrice(vendor.priceRange.min)} - {formatPrice(vendor.priceRange.max)}
                      </p>
                    )}
                  </div>

                  {/* Offered Services Badges */}
                  {vendor.servicesOffered && vendor.servicesOffered.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {vendor.servicesOffered.slice(0, 3).map((srv, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md text-[9px] font-semibold text-[var(--text-main)] truncate max-w-[140px]">
                          {srv}
                        </span>
                      ))}
                      {vendor.servicesOffered.length > 3 && (
                        <span className="text-[9px] text-[var(--text-muted)] font-bold self-center">
                          +{vendor.servicesOffered.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex gap-2">
                  <Link
                    to={`/planner/vendors/${vendor.id}`}
                    className="w-full text-center py-2.5 px-3 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-pink-400" />
                    <span>Inspect Profile & Portfolio</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannerDashboard;
