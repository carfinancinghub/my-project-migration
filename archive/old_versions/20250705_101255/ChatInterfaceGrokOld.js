// File: ChatInterface.js
// Path: frontend/src/components/ChatInterface.js
// Features: Modular version with: Real-time chat, attachment upload, PDF export, quote & flag menu, AI reply suggestions, scroll-to-top, typing indicator, arbitration summary, escrow audit trail, AI thread analyzer, audio playback, contract tag highlighting, smart search

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

import Navbar from './Navbar';
import MessageBubble from './chat/MessageBubble';
import ChatSummaryPanel from './chat/ChatSummaryPanel';
import AuditTrail from './chat/AuditTrail';
import SmartSearchBar from './chat/SmartSearchBar';
import ChatAttachmentUploader from './common/ChatAttachmentUploader';
import ChatAttachmentPreviewer from './common/ChatAttachmentPreviewer';

const socket = io('http://localhost:5000');

const ChatInterface = ({ recipientId, disputeId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const [suggestions, setSuggestions] = useState({});
  const [summary, setSummary] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [search, setSearch] = useState('');

  const messageEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', { recipientId, disputeId });
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on('userTyping', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });
    return () => socket.disconnect();
  }, [recipientId, disputeId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${disputeId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Message fetch failed:', err);
      }
    };
    fetchMessages();
  }, [disputeId]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await new Promise((resolve) =>
          setTimeout(() =>
            resolve({
              data: `This dispute involves a disagreement regarding the condition of the vehicle upon delivery. The buyer claims unexpected mechanical issues, while the seller asserts that the vehicle was fully functional at the time of shipment.`
            }), 500)
        );
        setSummary(res.data);
      } catch (err) {
        console.error('Summary fetch failed', err);
      }
    };
    fetchSummary();
  }, [messages]);

  useEffect(() => {
    const container = messageContainerRef.current;
    const handleScroll = () => setShowScrollTop(container.scrollTop > 300);
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    const formData = new FormData();
    formData.append('text', newMessage);
    formData.append('recipientId', recipientId);
    formData.append('disputeId', disputeId);
    attachments.forEach((preview) => formData.append('attachments', preview.raw));
    try {
      const res = await axios.post('/api/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      socket.emit('sendMessage', res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Message send failed', error);
    }
  };

  const handleDownloadTranscript = () => {
    const element = document.getElementById('chat-transcript');
    html2pdf().from(element).save(`dispute-${disputeId}-transcript.pdf`);
  };

  const handleQuote = (text) => setNewMessage((prev) => `${prev}\n> ${text}\n`);
  const handleFlag = (msg) => console.log('Flagged message:', msg);
  const handleSmartReply = async (msg, index) => {
    const res = await new Promise((resolve) =>
      setTimeout(() =>
        resolve({ data: [
          `Thanks for the update on that, I'll follow up.`,
          `Can you clarify the part about the attachment?`
        ] }), 500)
    );
    setSuggestions((prev) => ({ ...prev, [index]: res.data }));
  };
  const applySuggestion = (text) => setNewMessage((prev) => `${prev}\n${text}`);

  const filteredMessages = search
    ? messages.filter((m) => m.text.toLowerCase().includes(search.toLowerCase()))
    : messages;

  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <ChatSummaryPanel summary={summary} open={summaryOpen} toggle={() => setSummaryOpen((prev) => !prev)} />
      <div className="p-3 border-b bg-yellow-50 text-sm">
        <div className="font-semibold text-gray-800 mb-2">🧠 AI Thread Analyzer</div>
        <div className="text-gray-700">
          <p>
            "This conversation reveals a progression from the buyer's concerns over vehicle condition to the seller's clarification and the hauler's delivery confirmation. The dispute appears rooted in expectations around inspection documentation and final delivery condition."
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(`This conversation reveals a progression...`)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <ClipboardCopy size={12} /> Copy Summary
          </button>
        </div>
      </div>
      <AuditTrail />
      <SmartSearchBar search={search} setSearch={setSearch} />

      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2 relative">
        <div id="chat-transcript">
          {filteredMessages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              msg={msg}
              idx={idx}
              isOpen={actionMenuIndex === idx}
              onActionToggle={setActionMenuIndex}
              onQuote={handleQuote}
              onFlag={handleFlag}
              suggestions={suggestions}
              onSuggest={handleSmartReply}
              onApplySuggestion={applySuggestion}
            />
          ))}
          {isTyping && (
            <div className="text-sm italic text-gray-500 ml-2">User is typing...</div>
          )}
          <div ref={messageEndRef} />
        </div>
        {showScrollTop && (
          <button
            onClick={() => messageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-28 right-4 bg-gray-200 hover:bg-gray-300 p-2 rounded shadow text-sm"
          >
            ↑ Scroll to Top
          </button>
        )}
      </div>

      <div className="p-4 border-t">
        <textarea
          className="w-full border rounded-md p-2"
          rows={2}
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            socket.emit('typing', { recipientId, disputeId });
          }}
          placeholder="Type your message..."
        />
        <ChatAttachmentUploader attachments={attachments} setAttachments={setAttachments} />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Send
          </button>
          <button
            onClick={handleDownloadTranscript}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            📄 Export PDF
          </button>
        </div>
        {attachments.length > 0 && (
          <div className="p-4 bg-gray-50 border-t mt-2">
            <ChatAttachmentPreviewer attachments={attachments} onRemove={(index) => {
              setAttachments((prev) => prev.filter((_, i) => i !== index));
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
