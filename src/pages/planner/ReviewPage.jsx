import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../../api/eventApi';
import { getVendors } from '../../api/vendorApi';
import { createReview } from '../../api/reviewApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { Star, ArrowLeft, ShieldAlert, Sparkles, Send } from 'lucide-react';

const ReviewPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form state
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eventRes, vendorsRes] = await Promise.all([
          getEventById(eventId),
          getVendors()
        ]);

        if (eventRes.success && eventRes.data) {
          setEvent(eventRes.data);
        } else {
          setError(eventRes.message || 'Failed to retrieve event details.');
        }

        if (vendorsRes.success && vendorsRes.data) {
          setAllVendors(vendorsRes.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error occurred while loading data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVendorId || !rating || !comment.trim()) {
      setToastType('error');
      setToastMsg('Please fill in all review details.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createReview(eventId, selectedVendorId, rating, comment);
      if (res.success) {
        setToastType('success');
        setToastMsg('Review submitted successfully!');
        // Clear input form
        setComment('');
        setSelectedVendorId('');
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Failed to save review.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error occurred while submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} />;
  if (!event) return <ErrorBanner message="Event not found." />;

  // Resolve assigned vendors for review dropdown selection
  const assignedVendors = (event.vendors || []).map((evVendor) => {
    return allVendors.find((v) => v.id === evVendor.vendorId);
  }).filter(Boolean);

  const isCompleted = event.status === 'COMPLETED';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Back link */}
      <div>
        <Link 
          to={`/planner/event-builder/${eventId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Builder
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm mb-2">
          <Sparkles className="w-5 h-5" />
          <span>Feedback Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review Event Vendors</h1>
        <p className="text-slate-500 mt-1">Rate and write reviews for the vendors hired for Bhumika's Wedding Gala.</p>
      </div>

      {/* Guard Verification Panel */}
      {!isCompleted ? (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4 text-amber-800">
          <ShieldAlert className="w-6 h-6 shrink-0 text-amber-650" />
          <div>
            <h3 className="font-bold text-sm text-amber-900">Review Form Locked</h3>
            <p className="text-xs text-amber-750 mt-1 leading-relaxed">
              Reviews can only be submitted for completed events. Current event status is{' '}
              <span className="font-bold uppercase bg-amber-200/50 border border-amber-300 px-2 py-0.5 rounded text-[10px]">
                {event.status}
              </span>
              . Please ask the administrator to flag this event as completed once logistics finish.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Vendor Selector */}
            <div>
              <label htmlFor="vendor" className="block text-sm font-semibold text-slate-700">
                Select Vendor to Review
              </label>
              <select
                id="vendor"
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              >
                <option value="">-- Select a Vendor --</option>
                {assignedVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.businessName} ({v.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Star Rating
              </label>
              <div className="flex gap-2 items-center mt-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-8 h-8 ${rating >= val ? 'text-amber-500 fill-current' : 'text-slate-200'}`} 
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-400 ml-2 uppercase">({rating} of 5 stars)</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-slate-700">
                Write Your Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={5}
                className="mt-1 block w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none placeholder-slate-400 resize-none text-slate-900"
                placeholder="Write your review comments here. Your feedback will affect their average listing rating score."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
