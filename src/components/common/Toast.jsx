import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgClasses = {
    success: 'bg-emerald-50 border-emerald-250 text-emerald-800 shadow-emerald-100/50',
    error: 'bg-red-55 text-red-800 border-red-250 shadow-red-100/50',
    info: 'bg-violet-50 text-violet-850 border-violet-200 shadow-violet-100/50',
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type] || Info;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-lg max-w-sm transition-all animate-bounce ${bgClasses[type] || bgClasses.success}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-xs font-semibold flex-1">{message}</span>
      <button onClick={onClose} className="p-0.5 hover:bg-black/5 rounded-lg text-slate-500 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
