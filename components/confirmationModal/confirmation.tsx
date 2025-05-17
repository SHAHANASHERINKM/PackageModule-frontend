// ConfirmationModal.tsx
import React from 'react';
import './confirmation.css'; // Import your CSS file for styling
interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <p>{message}</p>
        <div className="confirmation-modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">OK</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
