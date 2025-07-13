// File: votingController.js
// Path: backend/controllers/disputes/votingController.js
// 👑 Cod1 Crown Certified — Voting Controller for Disputes

const Dispute = require('@/models/dispute/Dispute');
const { triggerDisputeNotification } = require('@/utils/notificationTrigger');
const { awardArbitratorBadge } = require('./arbitratorRecognition');
const { updateReputation } = require('@/utils/reputationEngine');

// Moderator (Judge) Voting — 3 Votes System
const castModeratorVote = async (req, res) => {
  try {
    const { id: disputeId } = req.params;
    const { vote } = req.body;
    const voterId = req.user.id;
    const io = req.app.get('socketio');

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    const existingVote = dispute.votes.find((v) => v.voter.toString() === voterId);
    if (existingVote) return res.status(400).json({ error: 'You have already voted' });

    dispute.votes.push({ voter: voterId, vote, timestamp: new Date() });
    dispute.timeline.push({
      event: 'Vote Submitted',
      value: `${vote} by ${voterId}`,
      timestamp: new Date(),
    });

    await dispute.save();

    const yesVotes = dispute.votes.filter(v => v.vote === 'yes').length;
    const noVotes = dispute.votes.filter(v => v.vote === 'no').length;

    if (dispute.votes.length === 3 && (yesVotes === 3 || noVotes === 3)) {
      dispute.status = 'resolved';
      dispute.timeline.push({
        event: 'Dispute Resolved',
        value: `Unanimous ${yesVotes === 3 ? 'approval' : 'rejection'}`,
        timestamp: new Date(),
      });

      await awardArbitratorBadge(disputeId);
      await updateReputation(dispute.raisedBy, 'dispute-win');
      await updateReputation(dispute.againstUserId, 'dispute-loss');
      await dispute.save();

      io.to(disputeId).emit('dispute-resolved', dispute);
    } else {
      io.to(disputeId).emit('vote-cast', { voterId, vote });
    }

    await triggerDisputeNotification({
      type: 'Vote Submitted',
      disputeId,
      recipientId: [dispute.raisedBy, dispute.againstUserId],
      message: `🗳️ A vote has been submitted on dispute ${disputeId}`,
      suppressDuplicates: true,
    });

    res.status(201).json({ message: 'Vote submitted' });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Simple Dispute Vote (for normal users if needed)
const voteOnDispute = async (req, res) => {
  try {
    const { disputeId, vote } = req.body;
    const userId = req.user.id;

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    dispute.votes.push({ judgeId: userId, vote, timestamp: new Date() });

    await dispute.save();

    res.status(201).json({ message: 'Vote recorded successfully.' });
  } catch (error) {
    console.error('voteOnDispute error:', error);
    res.status(500).json({ message: 'Server error recording vote' });
  }
};

// ✅ Proper Crown Export
module.exports = {
  castModeratorVote,
  voteOnDispute, // ✅ Now available for router
};
