// File: ImageUploader.js
// Path: frontend/src/components/common/ImageUploader.js
// 👑 Cod1 Crown Certified — Drag & Drop Image Uploader with Preview and Cloud Prep

import React, { useRef } from 'react';

const ImageUploader = ({ images, setImages }) => {
  const fileInputRef = useRef();

  const handleFiles = (files) => {
    const previews = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowse = (e) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-dashed border-2 p-4 rounded bg-gray-50 text-center cursor-pointer"
      onClick={() => fileInputRef.current.click()}
    >
      <p className="text-sm text-gray-600">Drag & drop images here or click to browse</p>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleBrowse}
      />

      {images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img.preview} alt={`preview-${index}`} className="rounded h-24 w-full object-cover shadow" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 text-white bg-red-500 hover:bg-red-600 rounded px-2"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
