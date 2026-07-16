import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

const MessageBubble = ({ message, isSelf }) => {
  const { content, aiGenerated, sentAt } = message;

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} space-y-1 w-full`}>
      <div 
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border
          ${isSelf 
            ? 'bg-violet-650 text-white border-violet-600 rounded-tr-none' 
            : 'bg-white text-slate-800 border-slate-150 rounded-tl-none'}
        `}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        
        {/* AI Badge for counter-offers */}
        {aiGenerated && (
          <div className={`inline-flex items-center gap-1 mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
            ${isSelf 
              ? 'bg-violet-800/40 text-violet-200 border-violet-750/30' 
              : 'bg-violet-50 text-violet-700 border-violet-100'}
          `}>
            <Sparkles className="w-2.5 h-2.5" />
            AI Drafted
          </div>
        )}
      </div>
      
      {/* Timestamp */}
      <span className="text-[9px] font-bold text-slate-400 px-1 uppercase">
        {formatTime(sentAt)}
      </span>
    </div>
  );
};

export default MessageBubble;
