import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Compass, Plus, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlannerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hello, {user?.name || 'Planner'}</h1>
          <p className="text-slate-500 mt-1">Welcome to your event planning workspace. Build packages and manage clients.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/planner/create-event" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all">
            <Plus className="w-4 h-4" />
            New Event
          </Link>
          <Link to="/planner/vendors" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-205 rounded-xl shadow-sm transition-all">
            <Compass className="w-4 h-4" />
            Explore Directory
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/planner/vendors" className="block p-4 border border-slate-100 hover:border-violet-200 hover:bg-violet-50/10 rounded-xl transition-all">
              <h3 className="font-semibold text-slate-850">Browse Directory</h3>
              <p className="text-xs text-slate-500 mt-1">Find top venue, caterer, and AV partners.</p>
            </Link>
            <Link to="/planner/create-event" className="block p-4 border border-slate-100 hover:border-violet-200 hover:bg-violet-50/10 rounded-xl transition-all">
              <h3 className="font-semibold text-slate-850">Create Client Proposal</h3>
              <p className="text-xs text-slate-500 mt-1">Set budget limits and link client proposals.</p>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-violet-500" />
              Recent Activities
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              No recent events found. Create your first event planning proposal to get started.
            </p>
          </div>
          <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-400">
            System status: Connected to backend
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerDashboard;
