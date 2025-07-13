// File: DocumentUploader.js
// Path: frontend/src/components/common/DocumentUploader.js
// 👑 Cod1 Crown Certified — Mixed Media Module: Voice, PDF, VR, Docs, and Image Files with Smart Preview + Upload Logic

import React, { useRef, useState } from 'react';
import axios from 'axios';

const ACCEPTED_TYPES = [
  '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png',
  '.mp3', '.wav', '.m4a',        // Voice memos
  '.glb', '.usdz', '.zip'        // 3D/AR/VR files
];

const DocumentUploader = ({ documents, setDocuments }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFiles = (files) => {
    const previews = Array.from(files).map((file) => ({
      file,
      name: file.name,
      type: file.type,
      preview: file.type.startsWith('audio') ? URL.createObjectURL(file) : null,
    }));
    setDocuments((prev) => [...prev, ...previews]);
  };

  const handleBrowse = (e) => {
    handleFiles(e.target.files);
  };

  const removeDoc = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    documents.forEach((doc) => {
      formData.append('files', doc.file);
    });

    try {
      setUploading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/uploads/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Documents uploaded successfully!');
      console.log('Upload response:', res.data);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Document upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-gray-300 p-4 rounded space-y-3 bg-white">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700 font-semibold">
          📎 Upload Supporting Files (PDF, Voice, VR, DOC, Images)
        </p>
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm"
          onClick={() => fileInputRef.current.click()}
        >Browse Files</button>
        <input
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          ref={fileInputRef}
          className="hidden"
          onChange={handleBrowse}
        />
      </div>

      {documents?.length > 0 && (
        <ul className="text-sm mt-2 space-y-2">
          {documents.map((doc, i) => (
            <li key={i} className="flex flex-col border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{doc.name}</span>
                <button
                  type="button"
                  className="text-red-500 hover:underline"
                  onClick={() => removeDoc(i)}
                >Remove</button>
              </div>

              {doc.type.startsWith('audio') && doc.preview && (
                <audio controls className="mt-2">
                  <source src={doc.preview} type={doc.type} />
                  Your browser does not support audio playback.
                </audio>
              )}

              {doc.name.endsWith('.pdf') && (
                <p className="text-xs text-gray-500">📄 PDF file ready for download or OCR</p>
              )}
              {doc.name.endsWith('.glb') || doc.name.endsWith('.usdz') ? (
                <p className="text-xs text-indigo-500">🕶️ 3D Model or AR Asset</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {documents?.length > 0 && (
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Documents'}
        </button>
      )}
    </div>
  );
};

export default DocumentUploader;
