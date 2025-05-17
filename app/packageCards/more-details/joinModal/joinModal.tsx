'use client';
import { useState } from 'react';
import './joinModal.css'; // Your external CSS


interface JoinModalProps {
  buttonText?: string;
  message?: string;
}

export default function JoinModal({ buttonText = "Join This Course", message = "" }: JoinModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Join Button */}
      <button onClick={() => setIsOpen(true)} className="join-button">
        {buttonText}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Close Button */}
            <button onClick={() => setIsOpen(false)} className="close-button">
              &times;
            </button>
            <div  className='welcome-container'>
              <h2 className='welcome-text'>Your Are Successfully Joined To This Course!</h2>
            </div>
            {/* Modal Text */}
            <div
              className="modal-html-content ck-content"
              dangerouslySetInnerHTML={{ __html: message || "<p>No message available.</p>" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
