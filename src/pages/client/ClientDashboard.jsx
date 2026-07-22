import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings } from '../../api/eventApi';
import { getVendors } from '../../api/vendorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { 
  Calendar, Package, Clock, CheckCircle2, CreditCard, 
  ExternalLink, AlertCircle, Sparkles, DollarSign, Building, 
  Star, MapPin, Phone, Tag, ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsRes, vendorsRes] = await Promise.all([
        getMyBookings(),
        getVendors()
      ]);
      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
      if (vendorsRes.success && vendorsRes.data) {
        setVendors(vendorsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error fetching client dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const categoryLabels = {
    VENUE: 'Venue Provider',
    CATERING: 'Catering Service',
    DECOR: 'Decorations & Styling',
    AV: 'Audio-Visual & Sound',
    OTHER: 'Other Special Service'
  };

  const statusConfig = {
    DRAFT: { label: 'Draft', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: Clock },
    PENDING_APPROVAL: { label: 'Pending Approval', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: AlertCircle },
    APPROVED: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
    COMPLETED: { label: 'Completed', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', icon: CheckCircle2 },
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;

  const totalSpent = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + (b.totalCost || 0), 0);
  const activeCount = bookings.filter(b => b.status === 'APPROVED' || b.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass-card p-8 border border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Welcome, {user?.name || 'Client'}! 👋</h1>
            <p className="text-sm text-[var(--text-muted)]">Your event bookings, payment checkout, and marketplace vendor services at a glance.</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Bookings</span>
            <Package className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-3xl font-black text-[var(--text-main)] mt-2 block">{bookings.length}</span>
        </div>

        <div className="glass-card p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Events</span>
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-[var(--text-main)] mt-2 block">{activeCount}</span>
        </div>

        <div className="glass-card p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Paid</span>
            <DollarSign className="w-5 h-5 text-pink-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 mt-2 block">{formatPrice(totalSpent)}</span>
        </div>
      </div>

      {/* Bookings List */}
      <div className="glass-card border border-[var(--border-color)] p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          My Event Bookings
        </h2>

        {bookings.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
            <p className="text-sm text-[var(--text-muted)]">No bookings yet.</p>
            <p className="text-xs text-[var(--text-muted)]">
              When an event planner creates an event for your email, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const config = statusConfig[booking.status] || statusConfig.DRAFT;
              const StatusIcon = config.icon;
              return (
                <div
                  key={booking.id}
                  className="p-5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[var(--text-main)] truncate">{booking.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                        <span>{booking.vendors?.length || 0} vendor(s)</span>
                        <span className="font-mono">{new Date(booking.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Total Cost</span>
                        <span className="text-lg font-black text-emerald-400">{formatPrice(booking.totalCost)}</span>
                      </div>

                      {booking.clientLinkToken && (
                        <a
                          href={`/client-view/${booking.clientLinkToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all"
                          title="View Proposal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {booking.status === 'APPROVED' && booking.clientLinkToken && (
                        <a
                          href={`/client-view/${booking.clientLinkToken}/pay`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 btn-primary rounded-lg text-xs font-bold"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: Marketplace Vendor Services for Clients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2 tracking-tight">
              <Building className="w-6 h-6 text-pink-400" />
              Verified Marketplace Vendor Services ({vendors.length})
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Explore available venues, catering menus, decor themes, and sound setup services.</p>
          </div>
        </div>

        {vendors.length === 0 ? (
          <div className="glass-card p-8 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-color)]">
            No marketplace vendor profiles available.
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

                  {/* Contact & Pricing Metadata */}
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
                    <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">Offered Services:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {vendor.servicesOffered.map((srv, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md text-[9px] font-semibold text-[var(--text-main)]">
                            ✓ {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
