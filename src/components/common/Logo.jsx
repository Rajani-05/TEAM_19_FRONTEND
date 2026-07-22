import React from 'react';

export const LogoIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dynamic interlaced rings and sparkle theme for premium event aesthetic */}
      <circle cx="8" cy="12" r="6" stroke="url(#logoGrad)" strokeWidth="2.5" />
      <circle cx="16" cy="12" r="6" stroke="url(#logoGrad)" strokeWidth="2.5" />
      <path d="M12 4L13.5 7.5L17 9L13.5 10.5L12 14L10.5 10.5L7 9L10.5 7.5L12 4Z" fill="url(#logoGrad)" />
      <defs>
        <linearGradient id="logoGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" /> {/* Emerald Green */}
          <stop offset="1" stopColor="#ec4899" /> {/* Pink */}
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoWithText = ({ size = "md" }) => {
  const iconSize = size === "lg" ? "w-10 h-10" : "w-7 h-7";
  const textSize = size === "lg" ? "text-3xl" : "text-xl";
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center p-1.5 bg-slate-900/10 dark:bg-white/10 rounded-xl border border-[var(--border-color)]">
        <LogoIcon className={iconSize} />
      </div>
      <span className={`${textSize} font-black tracking-tight text-[var(--text-main)]`}>
        Event<span className="gradient-text">Pro</span>
      </span>
    </div>
  );
};
