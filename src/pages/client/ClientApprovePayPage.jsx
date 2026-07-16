import React from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, BadgeCheck } from 'lucide-react';

const ClientApprovePayPage = () => {
  const { clientLinkToken } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md text-center py-16">
          <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout Portal</h1>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Review checkout rates, confirm proposal packages, and complete payments using Razorpay Checkout.
          </p>
          <div className="mt-6 p-3 bg-slate-100 rounded-xl text-slate-600 text-xs font-mono inline-block max-w-full overflow-x-auto">
            Token: {clientLinkToken}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientApprovePayPage;
