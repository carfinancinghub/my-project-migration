// File: MessageBubble.js
// Path: frontend/src/components/chat/MessageBubble.js

import React from 'react';
import { Flag, MessageSquareQuote, Sparkles, ClipboardCopy, MoreVertical } from 'lucide-react';

const MessageBubble = ({ msg, idx, isOpen, onActionToggle, onQuote, onFlag, suggestions, onSuggest, onApplySuggestion }) => {
  const hasContractKeywords = /\b(contract|agreement|term|condition)\b/i.test(msg.text);

  return (
    <div className={`bg-gray-100 p-2 rounded-md relative group ${hasContractKeywords ? 'border-2 border-yellow-400' : ''}`}>
      <div className="text-sm font-medium">
        {msg.senderName} {hasContractKeywords && <span className="ml-2 text-yellow-600 text-xs">📑 Contract Tag</span>}
      </div>
      <div>{msg.text}</div>
      <div className="text-xs text-gray-500" title={new Date(msg.createdAt).toLocaleString()}>
        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      {msg.attachments?.map((file, i) => (
        file.fileType.startsWith('audio/') ? (
          <audio key={i} controls className="mt-2 w-full">
            <source src={file.url} type={file.fileType} />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <a
            key={i}
            href={file.url}
            download
            className="text-blue-500 underline text-xs block mt-1"
          >
            📎 Download Attachment {i + 1}
          </a>
        )
      ))}

      <button
        onClick={() => {
          onActionToggle(idx);
          onSuggest(msg, idx);
        }}
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-6 right-1 bg-white border rounded shadow p-2 space-y-2 z-10 text-xs w-64">
          <button onClick={() => onQuote(msg.text)} className="flex items-center gap-1 hover:underline">
            <MessageSquareQuote size={12} /> Quote
          </button>
          <button onClick={() => onFlag(msg)} className="flex items-center gap-1 text-red-500 hover:underline">
            <Flag size={12} /> Flag
          </button>
          {suggestions[idx] && (
            <div className="pt-1 border-t">
              <div className="text-xs font-semibold flex items-center gap-1 mb-1">
                <Sparkles size={12} /> Suggested Replies
              </div>
              {suggestions[idx].map((s, i) => (
                <button
                  key={i}
                  onClick={() => onApplySuggestion(s)}
                  className="block text-left w-full text-gray-600 hover:text-gray-800 hover:underline"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
