// File: ChatAttachmentUploader.js
// Path: frontend/src/components/common/ChatAttachmentUploader.js

import React from 'react';

const ChatAttachmentUploader = ({ attachments, setAttachments }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const safeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const validFiles = files.filter((file) => safeTypes.includes(file.type));
    const previews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      fileType: file.type,
      raw: file, // optional: if you need to send to backend later
    }));
    setAttachments((prev) => [...prev, ...previews]);
  };

  const handleRemove = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">📎 Attach Files</label>
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        accept=".png,.jpg,.jpeg,.pdf"
        className="block w-full text-sm border rounded px-3 py-2 cursor-pointer"
      />
      {attachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              {file.fileType.startsWith('image/') && (
                <img src={file.url} alt="preview" className="w-10 h-10 rounded" />
              )}
              <span className="truncate">{file.url.split('/').pop()}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatAttachmentUploader;
