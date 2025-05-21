'use client';
import './joinModal.css';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function JoinModal({ isOpen, onClose, message = "" }: JoinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button onClick={onClose} className="close-button">
          &times;
        </button>

        <div className="welcome-container">
          <h2 className="welcome-text">You Are Successfully Joined To This Course!</h2>
        </div>

        {/* Modal Text */}
        <div
          className="modal-html-content ck-content"
          dangerouslySetInnerHTML={{ __html: message || "<p>No message available.</p>" }}
        />
      </div>
    </div>
  );
}
