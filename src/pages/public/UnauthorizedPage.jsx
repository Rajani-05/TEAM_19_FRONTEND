import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UnauthorizedPage = () => {
  const { user } = useAuth();
  
  // Choose dashboard destination based on user's role
  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'PLANNER': return '/planner/dashboard';
      case 'VENDOR': return '/vendor/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Access Denied</h1>
      <p className="text-slate-600 mb-8 text-center max-w-md">
        You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <Link to={getDashboardPath()} className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all">
        Return to My Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
