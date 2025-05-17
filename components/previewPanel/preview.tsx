"use client";
import React from 'react';
import './preview.css';

// Define the props interface
interface PreviewPanelProps {
  content: string; // Explicitly type content as a string
  onClose: () => void; // Type for the onClose function
}

const PreviewPanel = ({ content, onClose }: PreviewPanelProps) => {
  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-panel" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <h3>Preview</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="preview-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default PreviewPanel;