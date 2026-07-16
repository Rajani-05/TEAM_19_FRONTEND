import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../api/eventApi';
import { Sparkles, Calendar, DollarSign, Mail, AlertCircle } from 'lucide-react';
import Toast from '../../components/common/Toast';

const CreateEventPage = () => {
  const [title, setTitle] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !targetBudget || !clientEmail) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const budgetNum = Number(targetBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setErrorMsg('Please enter a valid target budget greater than 0.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await createEvent(title, budgetNum, clientEmail);
      // wrapper: { success: true, message: "...", data: event }
      if (response.success && response.data) {
        setToastMsg('Event created successfully!');
        // Redirect to Event Builder Page
        navigate(`/planner/event-builder/${response.data.id}`);
      } else {
        setErrorMsg(response.message || 'Failed to create event. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving event proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Header Panel */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm mb-2">
          <Sparkles className="w-5 h-5" />
          <span>New Workspace</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Event Proposal</h1>
        <p className="text-slate-500 mt-1">Set up a new client proposal, assign a target budget cap, and build your vendor package.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-150 rounded-xl flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-750">
              Event Title
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 transition-all text-sm"
                placeholder="e.g. Bhumika's Wedding Gala"
              />
            </div>
          </div>

          {/* Target Budget */}
          <div>
            <label htmlFor="targetBudget" className="block text-sm font-semibold text-slate-750">
              Target Budget (INR)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                id="targetBudget"
                name="targetBudget"
                type="number"
                required
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value)}
                className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 transition-all text-sm"
                placeholder="e.g. 500000"
              />
            </div>
          </div>

          {/* Client Email */}
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-semibold text-slate-750">
              Client Email Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 transition-all text-sm"
                placeholder="client@domain.com"
              />
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Proposal & Open Builder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
