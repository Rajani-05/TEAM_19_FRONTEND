import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Building, FileEdit, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
  const { user } = useAuth();
  
  // Custom mock profile state to showcase the dashboard
  const vendorStatus = 'PENDING'; // Default status to display on first load

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hello, {user?.name || 'Vendor'}</h1>
          <p className="text-slate-500 mt-1">Manage your event marketplace profile, pricing, and bookings.</p>
        </div>
        <div>
          <Link to="/vendor/profile" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all">
            <FileEdit className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Verification Status</h2>
            <Award className="w-5 h-5 text-violet-500" />
          </div>
          <div className="space-y-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
              ${vendorStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : ''}
              ${vendorStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-250 animate-pulse' : ''}
              ${vendorStatus === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-250' : ''}
            `}>
              {vendorStatus}
            </span>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {vendorStatus === 'PENDING' && 'Your vendor profile is currently under review by system moderators. You will receive updates shortly.'}
              {vendorStatus === 'APPROVED' && 'Your profile is approved and visible to event planners in the marketplace directory.'}
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-violet-500" />
            My Business Info
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please fill in your business name, price ranges, descriptions, and portfolios so planners can discover your services.
          </p>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Profile complete: 10%</span>
            <Link to="/vendor/profile" className="text-xs font-bold text-violet-600 hover:text-violet-700">
              Complete Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
