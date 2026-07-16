import React, { useState, useEffect, useCallback } from 'react';
import { getVendors } from '../../api/vendorApi';
import VendorCard from '../../components/vendor/VendorCard';
import VendorFilterBar from '../../components/vendor/VendorFilterBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { Sparkles, HelpCircle } from 'lucide-react';

const VendorDirectoryPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: '', search: '' });

  const fetchVendors = useCallback(async (cat, searchStr) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVendors(cat, searchStr);
      // wrapper: { success: true, message: "...", data: [vendors] }
      if (response.success && response.data) {
        // filter out profiles that are not APPROVED (unless they belong to user, but here it's directory)
        // Wait, does backend do that? Yes, backend typically returns approved ones for directory.
        setVendors(response.data);
      } else {
        setError(response.message || 'Failed to fetch vendor directory.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to retrieve vendors. Connect to backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors(filters.category, filters.search);
  }, [filters, fetchVendors]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm mb-2">
          <Sparkles className="w-5 h-5" />
          <span>Marketplace Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sourcing & Vendor Procurement</h1>
        <p className="text-slate-500 mt-1">Explore, filter, and view reviews for registered event vendors across your marketplace.</p>
      </div>

      {/* Filter Bar */}
      <VendorFilterBar onFilterChange={handleFilterChange} />

      {/* Results View */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} onRetry={() => fetchVendors(filters.category, filters.search)} />
      ) : vendors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
          <HelpCircle className="w-12 h-12 text-slate-350 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No vendors found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your category selection or search keyword to discover more service providers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDirectoryPage;
