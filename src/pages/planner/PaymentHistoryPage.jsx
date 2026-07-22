import React, { useState, useEffect } from 'react';
import { getPaymentHistory } from '../../api/paymentApi';
import { getMyEvents } from '../../api/eventApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { CreditCard, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentHistoryPage = () => {
  const [searchParams] = useSearchParams();
  const eventIdFromQuery = searchParams.get('eventId') || '';

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdFromQuery);
  const [transactions, setTransactions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch planner's events list on mount
  useEffect(() => {
    const loadPlannerEvents = async () => {
      try {
        const res = await getMyEvents();
        if (res.success && res.data) {
          setEvents(res.data);
          if (!selectedEventId && res.data.length > 0) {
            setSelectedEventId(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading events:', err);
      }
    };
    loadPlannerEvents();
  }, []);

  const fetchHistory = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setTransactions([]);
    try {
      const historyRes = await getPaymentHistory(id);
      if (historyRes.success && historyRes.data) {
        setTransactions(historyRes.data);
      } else {
        setError(historyRes.message || 'Failed to fetch payment transactions.');
      }
      const foundEvent = events.find(e => e.id === id);
      setSelectedEvent(foundEvent || null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while loading payment logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchHistory(selectedEventId);
    }
  }, [selectedEventId]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-card p-8 border border-[var(--border-color)] flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-emerald-400" />
            Razorpay Payment Audit & Financial Logs
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Audit verified transaction signatures, Razorpay gateway orders, and status logs across your events.</p>
        </div>
      </div>

      {/* Select Event Dropdown */}
      <div className="glass-card p-6 border border-[var(--border-color)]">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="selectEvent" className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Select Event to Audit Razorpay Logs
            </label>
            <select
              id="selectEvent"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="">-- Choose an Event --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} (Client: {ev.clientEmail}) - {formatPrice(ev.totalCost)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Results View */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} onRetry={() => fetchHistory(selectedEventId)} />
      ) : !selectedEventId ? (
        <div className="glass-card border border-[var(--border-color)] p-16 text-center shadow-sm space-y-3">
          <HelpCircle className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
          <h3 className="text-lg font-bold text-[var(--text-main)]">Select an Event to View Razorpay Logs</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Choose an event from the dropdown above to load verified payment transactions.
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="glass-card border border-[var(--border-color)] p-16 text-center space-y-3">
          <CreditCard className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
          <h3 className="text-lg font-bold text-[var(--text-main)]">No Payment Transactions Recorded Yet</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            When your client approves the event proposal link and completes the Razorpay checkout, verified transactions will log here automatically.
          </p>
          {selectedEvent?.clientLinkToken && (
            <a
              href={`/client-view/${selectedEvent.clientLinkToken}/pay`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary rounded-xl text-xs font-bold shadow-md"
            >
              Open Client Payment Link
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Event Summary */}
          {selectedEvent && (
            <div className="glass-card p-6 border border-[var(--border-color)] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">Auditing Event Workspace</span>
                <h3 className="text-xl font-black text-[var(--text-main)] mt-1">{selectedEvent.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Client Email: {selectedEvent.clientEmail}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">Package Cost</span>
                <span className="text-xl font-black text-emerald-400">{formatPrice(selectedEvent.totalCost)}</span>
              </div>
            </div>
          )}

          {/* Audit Table */}
          <div className="glass-card border border-[var(--border-color)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border-color)] text-xs">
                <thead className="bg-[var(--bg-surface)] text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left">Gateway Order ID</th>
                    <th scope="col" className="px-6 py-4 text-left">Gateway Payment ID</th>
                    <th scope="col" className="px-6 py-4 text-left">Transaction Type</th>
                    <th scope="col" className="px-6 py-4 text-left">Verification Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Amount</th>
                    <th scope="col" className="px-6 py-4 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] font-semibold text-[var(--text-main)]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--bg-surface)]/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-emerald-400">{tx.gatewayOrderId || '--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-pink-400">
                        {tx.gatewayPaymentId || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                          tx.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          tx.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-black text-emerald-400 text-sm">
                        {formatPrice(tx.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--text-muted)] font-mono text-[11px]">
                        {new Date(tx.createdAt).toLocaleString('en-IN')}
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

export default PaymentHistoryPage;
