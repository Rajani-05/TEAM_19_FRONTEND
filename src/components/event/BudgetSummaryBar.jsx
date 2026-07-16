import React from 'react';
import { DollarSign, AlertTriangle, ShieldCheck } from 'lucide-react';

const BudgetSummaryBar = ({ targetBudget, totalCost }) => {
  const remaining = targetBudget - totalCost;
  const isOverBudget = remaining < 0;
  const percentage = Math.min((totalCost / targetBudget) * 100, 100);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm space-y-4">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Financial Overview</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-800">{formatPrice(totalCost)}</span>
            <span className="text-xs text-slate-450 font-bold">spent of {formatPrice(targetBudget)} target</span>
          </div>
        </div>

        {/* Budget Status Badge */}
        <div>
          {isOverBudget ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-750 border border-red-150 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              Budget Overrun ({formatPrice(Math.abs(remaining))})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              Within Budget ({formatPrice(remaining)} left)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-150">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-violet-600'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
          <span>0% SPENT</span>
          <span className={`${isOverBudget ? 'text-red-500 font-extrabold' : 'text-slate-500'}`}>
            {percentage.toFixed(1)}% SPENT
          </span>
          <span>100% CAP</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryBar;
