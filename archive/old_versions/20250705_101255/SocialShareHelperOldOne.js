// File: SocialShareHelper.js
// Path: frontend/src/utils/
// Author: Cod3
// Purpose: Provide reusable social sharing functionality across modules

function generateShareContent(type, data) {
  switch (type) {
    case 'badge':
      return `I earned a ${data.badge} on Rivers Auction! #CarTransport #HaulerBadge`;
    case 'lenderMatch':
      return `Best lender match secured via CFH! APR: ${data.apr}%, Loan: $${data.amount}`;
    default:
      return `Check out what I achieved on Rivers Auction!`;
  }
}

function shareToPlatform(platform, content) {
  const url = encodeURIComponent('https://riversauction.com');
  const text = encodeURIComponent(content);

  let shareUrl = '';
  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`;
      break;
    default:
      console.warn('Unsupported platform:', platform);
      return;
  }

  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

export { generateShareContent, shareToPlatform };
