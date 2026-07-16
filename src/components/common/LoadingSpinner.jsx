import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'violet' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    violet: 'border-violet-600 border-t-transparent',
    slate: 'border-slate-800 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size] || sizeClasses.medium} ${colorClasses[color] || colorClasses.violet}`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default LoadingSpinner;
