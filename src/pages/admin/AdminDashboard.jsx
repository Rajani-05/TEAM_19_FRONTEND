import React, { useState, useEffect } from 'react';
import { getUsers, getPendingVendors, updateVendorStatus } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { LogoIcon } from '../../components/common/Logo';
import { 
  Shield, Users, Building, Settings, Check, X, ArrowRight, 
  DollarSign, Activity, Calendar, ShieldCheck, Phone, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, vendorsRes] = await Promise.all([
        getUsers(),
        getPendingVendors()
      ]);

      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data);
      }
      if (vendorsRes.success && vendorsRes.data) {
        setPendingVendors(vendorsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while loading system statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleQuickModerate = async (vendorId, status) => {
    try {
      const res = await updateVendorStatus(vendorId, status);
      if (res.success) {
        setToastType('success');
        setToastMsg(`Vendor listing ${status.toLowerCase()}ed successfully!`);
        setPendingVendors(prev => prev.filter(v => v.id !== vendorId));
        // Refresh users state to update any roles if affected
        fetchDashboardStats();
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Action failed.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error occurred during moderation.');
    }
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} onRetry={fetchDashboardStats} />;

  // Calculate detailed analytics for admin self-analysis
  const plannersCount = users.filter(u => u.role === 'PLANNER').length;
  const vendorsCount = users.filter(u => u.role === 'VENDOR').length;
  const clientsCount = users.filter(u => u.role === 'CLIENT').length;
  const adminsCount = users.filter(u => u.role === 'ADMIN').length;

  return (
    <div className="space-y-6">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Header Banner */}
      <div className="glass-card p-8 border border-[var(--border-color)]">
        <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">System Control Center</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Monitor platform operations, evaluate vendor listing request queues, and check account analytics.</p>
      </div>

      {/* Analytic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Total Accounts</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-3xl font-black text-[var(--text-main)] mt-2 block">{users.length}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Live registrations</span>
        </div>

        <div className="glass-card p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Pending Approvals</span>
            <Building className="w-5 h-5 text-pink-400" />
          </div>
          <span className="text-3xl font-black text-[var(--text-main)] mt-2 block">{pendingVendors.length}</span>
          <span className="text-[10px] text-amber-400 mt-1 block">Requires review</span>
        </div>

        <div className="glass-card p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Escrow Volumes</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-[var(--text-main)] mt-2 block">₹4.82 Lakhs</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Simulated volume</span>
        </div>

        <div className="glass-card p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">System Health</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-lg font-black text-[var(--text-main)] mt-2.5 block">200 OK</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Backend responding</span>
        </div>
      </div>

      {/* User Roles Breakdown (Admin Self-Analysis Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-[var(--border-color)] lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Roles Distribution
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Role counts within the event marketplace database:
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                Event Planners
              </span>
              <span className="font-extrabold text-[var(--text-main)]">{plannersCount} ({((plannersCount/Math.max(users.length,1))*100).toFixed(0)}%)</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
                Service Vendors
              </span>
              <span className="font-extrabold text-[var(--text-main)]">{vendorsCount} ({((vendorsCount/Math.max(users.length,1))*100).toFixed(0)}%)</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                End Clients
              </span>
              <span className="font-extrabold text-[var(--text-main)]">{clientsCount} ({((clientsCount/Math.max(users.length,1))*100).toFixed(0)}%)</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                Administrators
              </span>
              <span className="font-extrabold text-[var(--text-main)]">{adminsCount} ({((adminsCount/Math.max(users.length,1))*100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Quick Moderation Queue */}
        <div className="glass-card p-6 border border-[var(--border-color)] lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[var(--text-main)]">Moderation Queue</h2>
              {pendingVendors.length > 0 && (
                <Link to="/admin/vendors" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {pendingVendors.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] leading-normal py-10 text-center border border-dashed border-[var(--border-color)] rounded-xl">
                The approval queue is empty. All vendor profiles have been moderated.
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingVendors.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-between items-center gap-3">
                    <div className="truncate flex-1">
                      <h4 className="font-bold text-[var(--text-main)] text-xs truncate">{item.businessName}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] mt-1">
                        <span className="text-emerald-450 uppercase">Category: {item.category}</span>
                        {item.phoneNo && <span>Tel: {item.phoneNo}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleQuickModerate(item.id, 'APPROVED')}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleQuickModerate(item.id, 'REJECTED')}
                        className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Action Links */}
      <div className="glass-card p-6 border border-[var(--border-color)] space-y-4">
        <h2 className="text-lg font-bold text-[var(--text-main)]">Administrative Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/users" className="block p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-indigo-500/50 rounded-xl transition-all">
            <h3 className="font-bold text-[var(--text-main)] text-sm">Account Operations Control</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Audit complete credentials, role levels, user names, phone numbers, and genders.</p>
          </Link>
          <Link to="/admin/vendors" className="block p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-indigo-500/50 rounded-xl transition-all">
            <h3 className="font-bold text-[var(--text-main)] text-sm">Full Vendor Directory Moderation</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Review approved and rejected listings, evaluate pricing bounds and description reviews.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
