import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getMessages, sendMessage } from '../../api/chatApi';
import { getEventById } from '../../api/eventApi';
import { getVendors } from '../../api/vendorApi';
import MessageBubble from '../../components/chat/MessageBubble';
import AIAssistantButton from '../../components/chat/AIAssistantButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { ArrowLeft, Send, Sparkles, Building, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const vendorIdFromQuery = searchParams.get('vendorId'); // Who we are chatting with
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isAiDrafted, setIsAiDrafted] = useState(false); // flag if message was drafted by AI

  const messageEndRef = useRef(null);

  // Load chat meta details (Event & Vendor profile)
  const fetchMeta = useCallback(async () => {
    try {
      const eventRes = await getEventById(eventId);
      if (eventRes.success && eventRes.data) {
        setEvent(eventRes.data);
      }

      if (vendorIdFromQuery) {
        const vendorsRes = await getVendors();
        if (vendorsRes.success && vendorsRes.data) {
          const profile = vendorsRes.data.find(v => v.userId === vendorIdFromQuery || v.id === vendorIdFromQuery);
          setVendorProfile(profile);
        }
      }
    } catch (err) {
      console.error('Error fetching chat metadata:', err);
    }
  }, [eventId, vendorIdFromQuery]);

  // Load message logs
  const fetchMessages = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getMessages(eventId);
      // wrapper: { success: true, message: "...", data: [messages] }
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Error loading chat logs:', err);
      // Only set error on initial mount loading
      if (showLoading) {
        setError(err.response?.data?.message || 'Failed to sync chat history.');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    const init = async () => {
      await fetchMeta();
      await fetchMessages(true);
    };
    init();

    // Poll message logs every 3 seconds
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchMeta, fetchMessages]);

  // Auto Scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // We need a recipient (the vendor). If no vendor is set, notify planner.
    const recipientId = vendorProfile?.userId || vendorIdFromQuery;
    if (!recipientId) {
      setToastMsg('No recipient vendor profile selected.');
      return;
    }

    setSending(true);
    const content = inputText;
    setInputText('');

    try {
      const response = await sendMessage(eventId, recipientId, content, isAiDrafted);
      if (response.success && response.data) {
        setMessages(prev => [...prev, response.data]);
        setIsAiDrafted(false); // Reset AI flag
      } else {
        setToastMsg(response.message || 'Failed to send message.');
        setInputText(content); // restore input
      }
    } catch (err) {
      console.error(err);
      setToastMsg(err.response?.data?.message || 'Error occurred while sending message.');
      setInputText(content); // restore input
    } finally {
      setSending(false);
    }
  };

  const handleApplyAIDraft = (draftText) => {
    setInputText(draftText);
    setIsAiDrafted(true); // Flag message as AI generated
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} onRetry={() => fetchMessages(true)} />;

  return (
    <div className="space-y-6">
      {toastMsg && <Toast message={toastMsg} type="error" onClose={() => setToastMsg('')} />}

      {/* Back to event builder */}
      <div>
        <Link 
          to={event ? `/planner/event-builder/${event.id}` : '/planner/dashboard'} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Builder
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch min-h-[70vh]">
        {/* Left Side: Meta panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Chat Discussion</h2>
              <h3 className="text-xl font-bold text-slate-800 mt-1 truncate">
                {event?.title || 'Event Negotiation'}
              </h3>
            </div>

            {vendorProfile ? (
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 bg-violet-100 text-violet-605 text-violet-650 rounded-lg flex items-center justify-center shadow-sm">
                  <Building className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-805 text-sm">{vendorProfile.businessName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 inline-block">
                    {vendorProfile.category} Vendor
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-150 text-[10px] leading-relaxed text-slate-500">
                  Negotiate details here. Use the AI Assistant to counter-offer when rates exceed budget.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>No specific vendor selected. Access this page from the Event Builder slot to chat with assigned vendors.</span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-4 mt-6">
            Polling active: Live updates
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="lg:col-span-3 bg-white border border-slate-205 rounded-2xl flex flex-col shadow-sm overflow-hidden h-[70vh]">
          {/* Chat header */}
          <div className="bg-slate-50 border-b border-slate-150 px-6 py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-650 font-bold text-xs uppercase">
                {vendorProfile?.businessName ? vendorProfile.businessName[0] : '?'}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  {vendorProfile?.businessName || 'Vendor Room'}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Active Room
                </span>
              </div>
            </div>

            {/* AI Assistant Hook */}
            {vendorProfile && (
              <AIAssistantButton 
                eventId={eventId} 
                vendorId={vendorProfile.id} 
                onDraftGenerated={handleApplyAIDraft} 
              />
            )}
          </div>

          {/* Messages Logs scrollbox */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No messages exchanged yet. Send a greeting or offer to begin!
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isSelf={msg.senderId === user?.id || msg.senderId === user?.email} 
                />
              ))
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Chat input box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-150 bg-white flex gap-3 shrink-0 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 appearance-none w-full px-4 py-3.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 transition-all text-xs"
              placeholder={isAiDrafted ? "Review AI suggested counter-offer template..." : "Write message..."}
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim() || !vendorIdFromQuery}
              className="p-3 bg-violet-650 text-white rounded-xl hover:bg-violet-755 hover:bg-violet-700 focus:outline-none disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-100/50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
