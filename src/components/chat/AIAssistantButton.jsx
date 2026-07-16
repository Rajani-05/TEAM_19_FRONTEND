import React, { useState } from 'react';
import { draftNegotiationMessage } from '../../api/chatApi';
import { Sparkles, Send, Check, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const AIAssistantButton = ({ eventId, vendorId, onDraftGenerated }) => {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      setErrorMsg('Please specify a negotiation goal.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setDraft('');

    try {
      const response = await draftNegotiationMessage(eventId, vendorId, goal);
      // wrapper shape: { success: true, message: "...", data: textString }
      if (response.success && response.data) {
        setDraft(response.data);
      } else {
        setErrorMsg(response.message || 'Unable to generate negotiation draft.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while contacting Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (draft) {
      onDraftGenerated(draft);
      setOpen(false);
      setGoal('');
      setDraft('');
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-violet-50 text-violet-755 hover:bg-violet-600 hover:text-white rounded-xl border border-violet-150 transition-all text-xs font-bold shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        AI Negotiation
      </button>

      {/* Slide-out/Drop-down panel */}
      {open && (
        <div className="absolute right-0 bottom-12 z-30 w-80 bg-white border border-slate-200/80 shadow-2xl rounded-2xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-650" />
              Gemini AI Counter-Offer
            </span>
            <button 
              onClick={() => setOpen(false)} 
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Close
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-[10px] leading-relaxed flex gap-1.5 items-start">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!draft && !loading && (
            <form onSubmit={handleGenerate} className="space-y-3">
              <p className="text-[10px] text-slate-500 leading-normal">
                Describe your pricing target or discount query. The AI will draft a respectful, professional offer based on budget targets.
              </p>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
                className="block w-full border border-slate-205 rounded-xl p-3 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none placeholder-slate-400 resize-none text-slate-900"
                placeholder="e.g. Ask for a 12% price reduction since their catering quote exceeds our original plan."
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-colors shadow-md"
              >
                Draft Offer
              </button>
            </form>
          )}

          {loading && (
            <div className="py-8 text-center space-y-2">
              <LoadingSpinner size="small" />
              <p className="text-[10px] text-slate-400 animate-pulse font-semibold">Gemini is drafting counter-offer...</p>
            </div>
          )}

          {draft && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 max-h-40 overflow-y-auto">
                <p className="text-xs text-slate-650 leading-relaxed font-medium whitespace-pre-wrap">{draft}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-violet-605 text-white bg-violet-600 hover:bg-violet-700 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  Insert to Chat
                </button>
                <button
                  onClick={() => setDraft('')}
                  className="px-3.5 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl text-xs border border-slate-200 font-semibold"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistantButton;
