import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

const VendorFilterBar = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Debouncing logic for user input updates
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onFilterChange({ category, search });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, onFilterChange]);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="appearance-none block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm text-slate-900 transition-all"
          placeholder="Search by vendor name or description..."
        />
      </div>

      {/* Category Dropdown */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
        <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full md:w-56 px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
        >
          <option value="">All Categories</option>
          <option value="VENUE">Venues</option>
          <option value="CATERING">Catering</option>
          <option value="DECOR">Decoration</option>
          <option value="AV">Audio-Visual (AV)</option>
          <option value="OTHER">Other Services</option>
        </select>
      </div>
    </div>
  );
};

export default VendorFilterBar;
