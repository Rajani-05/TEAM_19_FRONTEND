import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, Building, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Control Center</h1>
        <p className="text-slate-500 mt-1">Hello, {user?.name || 'Administrator'}. Monitor marketplace platforms, verify vendor submissions, and audit review flags.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Registered Users</span>
            <span className="text-2xl font-bold text-slate-800">--</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pending Approvals</span>
            <span className="text-2xl font-bold text-slate-800">--</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">System Status</span>
            <span className="text-sm font-bold text-emerald-700">Healthy</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-500" />
            Administrative Panels
          </h2>
          <div className="space-y-3">
            <Link to="/admin/users" className="block p-4 border border-slate-100 hover:border-violet-200 hover:bg-violet-50/10 rounded-xl transition-all">
              <h3 className="font-semibold text-slate-850">Manage Users</h3>
              <p className="text-xs text-slate-500 mt-1">Audit accounts, update settings, or view system roles.</p>
            </Link>
            <Link to="/admin/vendors" className="block p-4 border border-slate-100 hover:border-violet-200 hover:bg-violet-50/10 rounded-xl transition-all">
              <h3 className="font-semibold text-slate-850">Moderate Vendor Submissions</h3>
              <p className="text-xs text-slate-500 mt-1">Verify business details, pricing plans, and approve vendor listing requests.</p>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Moderation Activity Logs</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            No moderation logs recorded today. Approve or reject incoming vendor profiles to see system logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
