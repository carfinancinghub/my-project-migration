// File: ChatAttachmentPreviewer.js
// Path: frontend/src/components/common/ChatAttachmentPreviewer.js

import React from 'react';

const ChatAttachmentPreviewer = ({ attachments = [] }) => {
  if (!attachments.length) return null;

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((file, index) => {
        const { url, fileType } = file;

        // Render image previews
        if (fileType.startsWith('image/')) {
          return (
            <div key={index} className="border rounded p-1 max-w-xs">
              <img src={url} alt={`attachment-${index}`} className="w-full h-auto rounded" />
            </div>
          );
        }

        // Render file download link for documents
        return (
          <div
            key={index}
            className="text-sm text-blue-700 underline hover:text-blue-500"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              📄 Download {url.split('/').pop()}
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default ChatAttachmentPreviewer;
