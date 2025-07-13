/**
 * File: PDFPreviewModal.jsx
 * Path: frontend/src/components/common/PDFPreviewModal.jsx
 * Author: Mini (Finalized by Cod4)
 * 👑 Crown Certified
 * Purpose: Reusable modal component for displaying PDF previews.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { X } from 'lucide-react';

interface PDFPreviewModalProps {
  pdfData: string | null;
  onClose: () => void;
  title?: string; // Optional title for the modal
}

const PDFPreviewModal = ({ pdfData, onClose, title = "PDF Preview" }: PDFPreviewModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pdfData) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="PDF Preview Modal"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
        >
          {/* Title & Close */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PDF Preview Iframe */}
          <iframe
            src={pdfData}
            title="PDF Preview"
            className="w-full h-[60vh] border border-gray-300 rounded-md"
          />

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFPreviewModal;