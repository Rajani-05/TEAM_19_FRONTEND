import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../api/eventApi';
import { Sparkles, Calendar, DollarSign, Mail, AlertCircle, Tag } from 'lucide-react';
import Toast from '../../components/common/Toast';

const CreateEventPage = () => {
  const [title, setTitle] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const navigate = useNavigate();

  const servicePresets = [
    { label: '🎂 Birthday Party', defaultTitle: "Grand Birthday Soiree & Party", defaultBudget: "150000" },
    { label: '💍 Wedding & Reception', defaultTitle: "Royal Palace Wedding & Reception", defaultBudget: "350000" },
    { label: '🏢 Corporate Summit', defaultTitle: "Annual Corporate Tech Gala", defaultBudget: "250000" },
    { label: '👶 Baby Shower', defaultTitle: "Bespoke Baby Shower & Naming", defaultBudget: "80000" },
    { label: '🎧 DJ Night & Concert', defaultTitle: "Sonic Boom DJ Concert Night", defaultBudget: "200000" },
    { label: '🥂 Anniversary Gala', defaultTitle: "Silver Jubilee Anniversary Party", defaultBudget: "180000" },
  ];

  const applyPreset = (preset) => {
    setTitle(preset.defaultTitle);
    setTargetBudget(preset.defaultBudget);
    if (!clientEmail) {
      setClientEmail("rishika@example.com");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !targetBudget || !clientEmail) {
      setErrorMsg('Please fill in all required fields.');
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
      if (response.success && response.data) {
        setToastMsg('Event proposal created successfully!');
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
      <div className="glass-card p-8 border border-[var(--border-color)]">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
          <Sparkles className="w-5 h-5" />
          <span>Bespoke Package Builder</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Create Event Proposal</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">Select an event service type, assign a target budget cap, and bundle your venue, caterers, and decorators.</p>
      </div>

      {/* Quick Presets */}
      <div className="glass-card p-6 border border-[var(--border-color)] space-y-3">
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-pink-400" />
          Quick Event Service Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {servicePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-main)] transition-all hover:scale-105"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card py-8 px-6 border border-[var(--border-color)] sm:px-10">
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
              Event Title & Package Service *
            </label>
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11 text-sm"
                placeholder="e.g. Rishika's Grand Birthday Fiesta"
              />
              <Calendar className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Target Budget */}
          <div>
            <label htmlFor="targetBudget" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
              Target Budget (INR) *
            </label>
            <div className="relative">
              <input
                id="targetBudget"
                name="targetBudget"
                type="number"
                required
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11 text-sm font-mono font-bold"
                placeholder="e.g. 150000"
              />
              <DollarSign className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Client Email */}
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
              Client Email Address *
            </label>
            <div className="relative">
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11 text-sm"
                placeholder="rishika@example.com"
              />
              <Mail className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 px-4 rounded-xl text-sm font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Proposal & Open Package Builder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
