import React, { useState, useEffect } from 'react';
import { getPendingVendors, updateVendorStatus } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { Building, Award, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorModerationPage = () => {
  const navigate = useNavigate();
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPendingVendors();
      if (response.success && response.data) {
        setPendingList(response.data);
      } else {
        setError(response.message || 'Failed to retrieve pending vendor requests.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while loading verification queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleModerate = async (vendorId, status) => {
    try {
      const res = await updateVendorStatus(vendorId, status);
      if (res.success) {
        setToastType('success');
        setToastMsg(`Vendor profile application was successfully ${status.toLowerCase()}!`);
        // Remove item from UI list
        setPendingList(prev => prev.filter(v => v.id !== vendorId));
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Moderation action failed.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error occurred during status update.');
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="space-y-6">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-650 hover:text-slate-905 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Control
        </button>
      </div>

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Building className="w-8 h-8 text-violet-650" />
          Vendor Applications Queue
        </h1>
        <p className="text-slate-500 mt-1">Verify business descriptions, price brackets, and categories before approving listings on the marketplace.</p>
      </div>

      {/* Verification List table */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} onRetry={fetchPending} />
      ) : pendingList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
          <Award className="w-12 h-12 text-slate-350 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Verification queue empty</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            All registered marketplace vendors have been moderated and updated. No pending applications are currently awaiting review.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left">Business Name</th>
                  <th scope="col" className="px-6 py-4 text-left">Category</th>
                  <th scope="col" className="px-6 py-4 text-left">Price range</th>
                  <th scope="col" className="px-6 py-4 text-left">Description</th>
                  <th scope="col" className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                {pendingList.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{vendor.businessName}</div>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{vendor.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap uppercase text-slate-500">{vendor.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px]">
                      {vendor.priceRange ? `${formatPrice(vendor.priceRange.min)} - ${formatPrice(vendor.priceRange.max)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={vendor.description}>
                      {vendor.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleModerate(vendor.id, 'APPROVED')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerate(vendor.id, 'REJECTED')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-650 text-white bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorModerationPage;
