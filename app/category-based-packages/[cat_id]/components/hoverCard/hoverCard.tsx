import React, { useState } from 'react';
import './hoverCard.css';

interface HoverCardProps {
  title: string;
  position?: 'left' | 'right'; // default to 'right'
  isFree: boolean;
  subtitle: string;
  learnings?: string[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const HoverCard: React.FC<HoverCardProps> = ({
  title,
  position = 'right',
  isFree,
  subtitle,
  learnings,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
  };

  return (
    <div
      className={`hover-popup ${position}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ position: 'absolute', zIndex: 20 }}
    >
      <h3 className="hover-title">{title}</h3>

      <div className={`hover-tag ${isFree ? 'free' : 'premium'}`}>
        {isFree ? 'Free' : 'Premium'}
      </div>

      {subtitle && <p className="hover-subtitle">{subtitle}</p>}

      {learnings && learnings.length > 0 && (
        <div className="hover-learnings">
          <h4>What you'll learn</h4>
          <ul className="learning-list">
            {learnings.slice(0, 3).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      
    </div>
  );
};

export default HoverCard;
