import React, { useState, useEffect } from 'react';
import { getPaymentHistory } from '../../api/paymentApi';
import { getEventById } from '../../api/eventApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { CreditCard, ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorPaymentsPage = () => {
  const navigate = useNavigate();
  const [eventIdInput, setEventIdInput] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setTransactions([]);
    setEventDetails(null);
    try {
      const [historyRes, eventRes] = await Promise.all([
        getPaymentHistory(id),
        getEventById(id).catch(() => ({ success: false }))
      ]);

      if (historyRes.success && historyRes.data) {
        // Vendors can view payment transactions linked to the event
        setTransactions(historyRes.data);
      } else {
        setError(historyRes.message || 'Failed to retrieve payment records.');
      }

      if (eventRes.success && eventRes.data) {
        setEventDetails(eventRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while loading payment transactions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchHistory(eventIdInput);
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
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/vendor/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-650 hover:text-slate-905 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-violet-600" />
          Payment Transactions
        </h1>
        <p className="text-slate-500 mt-1">Audit transaction references and receipt status for hired event packages.</p>
      </div>

      {/* Query Event Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="eventId" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Query Event ID
            </label>
            <input
              id="eventId"
              type="text"
              required
              value={eventIdInput}
              onChange={(e) => setEventIdInput(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-slate-905 transition-all"
              placeholder="e.g. 64b2d18fa7b2c8a9116c4f03"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !eventIdInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-violet-605 bg-violet-600 hover:bg-violet-755 hover:bg-violet-700 rounded-xl transition-all shadow-sm shrink-0"
          >
            Load Transactions
          </button>
        </form>
      </div>

      {/* Main Results View */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} onRetry={() => fetchHistory(eventIdInput)} />
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
          <HelpCircle className="w-12 h-12 text-slate-350 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No payment history found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Input the active event ID in the panel to inspect verified transactions for that package.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {eventDetails && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Auditing Hired Event</span>
                <h3 className="text-xl font-bold text-white mt-1">{eventDetails.title}</h3>
              </div>
            </div>
          )}

          {/* Payments Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left">Transaction ID</th>
                    <th scope="col" className="px-6 py-4 text-left">Gateway Order</th>
                    <th scope="col" className="px-6 py-4 text-left">Type</th>
                    <th scope="col" className="px-6 py-4 text-left">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Amount</th>
                    <th scope="col" className="px-6 py-4 text-left">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-slate-500">{tx.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-slate-400">
                        {tx.gatewayOrderId || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border
                          ${tx.type === 'CLIENT_TO_PLATFORM' ? 'bg-violet-50 text-violet-755 border-violet-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}
                        `}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border
                          ${tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : ''}
                          ${tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                          ${tx.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                          ${tx.status === 'REFUNDED' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        `}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-slate-800">
                        {formatPrice(tx.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-semibold">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPaymentsPage;
