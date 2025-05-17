import React from 'react';
import "./shareModal.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied!');
  };

  return (
    <div className="share-overlay">
      <div className="share-modal">
        <button className="share-close" onClick={onClose}>×</button>
        <h3 className='title'>Share this Package</h3>
        <div className='caption-container'>
            <p  className='caption'>Invite Your Friends And Team To Join This Course</p>
        </div>
        <div className="share-options">
            <a href={`https://wa.me/?text=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} className="icon whatsapp" /> 
            </a>
            <a href={`mailto:?subject=Check this course&body=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faEnvelope} className="icon email" /> 
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} className="icon facebook" /> 
            </a>
        </div>

        <div className="share-link-row">
      <div className="input-with-icon">
        <FontAwesomeIcon icon={faLink} className="link-icon" />
        <input className="share-url" value={url} readOnly />
      </div>
      <button className="share-copy-btn" onClick={copyToClipboard}>Copy</button>
    </div>
    
        

      </div>
    </div>
  );
};

export default ShareModal;
