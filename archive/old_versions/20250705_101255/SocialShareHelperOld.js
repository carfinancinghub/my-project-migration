// File: SocialShareHelper.js
// Path: frontend/src/utils/SocialShareHelper.js
// Author: Cod3 (05051016, May 5, 2025, 10:16 PDT)
// Purpose: Utility for generating and sharing content (badges, summaries) to social platforms like Twitter, gated for Enterprise users

import axios from 'axios';
import { logError } from '@utils/logger';
import { toast } from 'react-toastify';

// === Interfaces ===
interface ShareData {
  badge?: string;
  history?: Array<{ type: string; price: number }>;
}

interface ShareContent {
  text: string;
}

// === Utility Functions ===
// Generates shareable content based on type and data
export const generateShareContent = (type: 'badge' | 'summary', data: ShareData): ShareContent => {
  try {
    if (type === 'badge' && data.badge) {
      return { text: `Just earned the ${data.badge} on Rivers Auction! 🚚 #HaulerPride` };
    } else if (type === 'summary' && data.history) {
      const totalTransports = data.history.length;
      const totalValue = data.history.reduce((sum, tx) => sum + tx.price, 0);
      return {
        text: `Completed ${totalTransports} transports worth $${totalValue.toFixed(2)} on Rivers Auction! 🚛 #TransportSuccess`
      };
    } else {
      throw new Error('Invalid share type or data');
    }
  } catch (err) {
    logError(err);
    throw new Error('Failed to generate share content.');
  }
};

// Shares content to the specified platform (e.g., Twitter)
export const shareToPlatform = async (platform: 'twitter', content: ShareContent): Promise<void> => {
  try {
    if (platform !== 'twitter') {
      throw new Error('Unsupported platform');
    }
    await axios.post('/api/social/share/twitter', { text: content.text });
    toast.success('Shared to Twitter successfully!');
  } catch (err) {
    logError(err);
    toast.error('Failed to share to Twitter.');
    throw new Error('Failed to share content.');
  }
};