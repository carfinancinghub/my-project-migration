// 👑 Modular Card Component for Arbitration Disputes
import React from 'react';
import PropTypes from 'prop-types';

const DisputeCard = ({ dispute, children }) => {
  return (
    <div className="border p-4 rounded shadow-sm" data-testid="dispute-card">
      <h2 className="text-lg font-semibold">Dispute ID: {dispute._id}</h2>
      <p>Parties: {dispute.parties}</p>
      <p>Status: {dispute.status}</p>
      {children}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
        data-testid="review-button"
      >
        Review Case
      </button>
    </div>
  );
};

DisputeCard.propTypes = {
  dispute: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default DisputeCard;
