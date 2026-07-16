import React from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Calendar, BadgeCheck, ShieldAlert } from 'lucide-react';

const ClientPackageViewPage = () => {
  const { clientLinkToken } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm mb-4">
            <Sparkles className="w-5 h-5" />
            <span>Shared Event Proposal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Event Proposal Workspace</h1>
          <p className="text-slate-500 mt-2">
            Review your selected vendor packages, rates, and approval options here.
          </p>
          <div className="mt-4 p-3 bg-slate-100 rounded-xl text-slate-600 text-xs font-mono select-all overflow-x-auto">
            Token: {clientLinkToken}
          </div>
        </div>

        {/* Content placeholder */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md flex flex-col justify-center items-center text-center py-16">
          <Calendar className="w-12 h-12 text-slate-300 mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-slate-800">Proposal Data Awaiting Fetch</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Once connected to the backend API, this view will show the details of the event proposal and packages created by your event planner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientPackageViewPage;
