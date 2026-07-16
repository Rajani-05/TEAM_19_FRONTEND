import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorBanner = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-4 shadow-sm shadow-red-100/50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-650 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-red-955 text-sm">An error occurred</h3>
          <p className="text-xs text-red-750 mt-0.5 leading-relaxed">{message || 'Unable to load resources. Please try again.'}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
