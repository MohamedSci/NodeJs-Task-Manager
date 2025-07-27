// src/components/Modal.js
// A generic modal component that can display any content.
// It provides a backdrop and a central container for content,
// with an optional close button.

import React from 'react';
import { X } from 'lucide-react'; // Close icon

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
        // Simple animation classes for entry
        style={{ animationFillMode: 'forwards', animationDuration: '0.3s' }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body (children content) */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
