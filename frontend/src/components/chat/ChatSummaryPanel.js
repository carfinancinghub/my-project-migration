// File: ChatSummaryPanel.js
// Path: frontend/src/components/chat/ChatSummaryPanel.js

import React from 'react';
import { ClipboardCopy, ChevronDown, ChevronUp } from 'lucide-react';

const ChatSummaryPanel = ({ summary, open, toggle }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="p-3 border-b bg-gray-50">
      <div>
        <button
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:underline"
          onClick={toggle}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Summary of Dispute
        </button>
        {open && (
          <div className="text-sm text-gray-600 mt-1 max-w-3xl">
            {summary}
            <button
              onClick={copyToClipboard}
              className="ml-2 text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <ClipboardCopy size={12} /> Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSummaryPanel;
