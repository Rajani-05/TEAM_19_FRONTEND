import React, { useState, useEffect } from 'react';
import { getUsers, getPendingVendors, updateVendorStatus } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { Shield, Users, Building, Settings, Check, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
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
        setUsersCount(usersRes.data.length);
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
        setToastMsg(`Application successfully ${status.toLowerCase()}ed!`);
        // Remove item from active UI list
        setPendingVendors(prev => prev.filter(v => v.id !== vendorId));
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

  return (
    <div className="space-y-6">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Header Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Control Center</h1>
        <p className="text-slate-500 mt-1">Monitor marketplace platforms, verify vendor submissions, and audit user roles.</p>
      </div>

      {/* Statistic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <Link to="/admin/users" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-violet-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Users</span>
            <span className="text-2xl font-bold text-slate-800">{usersCount} accounts</span>
          </div>
        </Link>

        {/* KPI 2 */}
        <Link to="/admin/vendors" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-violet-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Approvals</span>
            <span className="text-2xl font-bold text-slate-805">{pendingVendors.length} applications</span>
          </div>
        </Link>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Status</span>
            <span className="text-sm font-bold text-emerald-700">Healthy (200 OK)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Navigation Blocks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-500" />
            Administrative Panels
          </h2>
          <div className="space-y-3">
            <Link to="/admin/users" className="block p-4 border border-slate-100 hover:border-violet-250 hover:bg-violet-50/5 rounded-xl transition-all">
              <h3 className="font-semibold text-slate-800 text-sm">Manage Users</h3>
              <p className="text-xs text-slate-500 mt-1">Audit credentials, roles, and dates.</p>
            </Link>
            <Link to="/admin/vendors" className="block p-4 border border-slate-100 hover:border-violet-255 hover:bg-violet-50/5 rounded-xl transition-all">
              <h3 className="font-semibold text-slate-800 text-sm">Moderate Vendor Submissions</h3>
              <p className="text-xs text-slate-500 mt-1">Evaluate and verify listing requests.</p>
            </Link>
          </div>
        </div>

        {/* Quick Pending Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Pending Application Approvals</h2>
              {pendingVendors.length > 0 && (
                <Link to="/admin/vendors" className="text-xs font-bold text-violet-600 hover:text-violet-755 inline-flex items-center gap-1">
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {pendingVendors.length === 0 ? (
              <p className="text-xs text-slate-500 leading-normal py-6 text-center">
                All registered partners have been moderated. The approval queue is currently empty.
              </p>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
                {pendingVendors.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center gap-3">
                    <div className="truncate flex-1">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{item.businessName}</h4>
                      <span className="text-[9px] uppercase font-semibold text-slate-450 tracking-wider block mt-0.5">
                        Category: {item.category}
                      </span>
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
                        className="p-1.5 bg-red-655 bg-red-650 hover:bg-red-700 text-white rounded-lg transition-colors"
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
    </div>
  );
};

export default AdminDashboard;
