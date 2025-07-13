import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Messaging from './Messaging';
import './SmartRecommendations.css';

const SmartRecommendations = ({ buyerId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const preferences = JSON.parse(localStorage.getItem('buyerPreferences')) || {};
        const res = await axios.post('/api/matchmaker/generate', {
          buyerId,
          preferences
        });
        setMatches(res.data);
      } catch (err) {
        setError('Failed to load smart recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [buyerId]);

  const handleContactLender = async (lenderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/messages/start', {
        participantIds: [buyerId, lenderId],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const conversationId = res.data._id;
      setActiveConversation(conversationId);
      setRecipientId(lenderId);
      setShowModal(true);

      await axios.post('/api/notifications', {
        recipient: lenderId,
        message: 'You have a new message from a buyer!',
        link: `/messages/${conversationId}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Unable to start conversation with lender.');
    }
  };

  if (loading) return <div className="loader">Loading smart recommendations...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="smart-recommendations">
      <h2>🔮 Smart Matches Just for You</h2>
      {matches.length === 0 ? (
        <p>No recommendations available. Try adjusting your preferences.</p>
      ) : (
        <div className="match-cards">
          {matches.map(({ car, auction, bid, score }, idx) => (
            <div key={idx} className="match-card">
              <h3>{car.make} {car.model} ({car.year})</h3>
              <p>Price: ${car.price.toLocaleString()}</p>
              <p>Down Payment: ${bid.proposedDownPayment}</p>
              <p>Interest Rate: {bid.interestRate}%</p>
              <p>Term: {bid.termMonths} months</p>
              <p className="score">Match Score: {score}/100</p>
              <button onClick={() => handleContactLender(bid.lenderId)}>💬 Contact Lender</button>
            </div>
          ))}
        </div>
      )}

      {showModal && activeConversation && (
        <div className="modal messaging-modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
            <Messaging
              conversationId={activeConversation}
              recipientId={recipientId}
              onClose={() => {
                setShowModal(false);
                setActiveConversation(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;