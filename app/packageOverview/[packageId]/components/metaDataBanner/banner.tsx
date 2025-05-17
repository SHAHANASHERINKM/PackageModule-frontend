// BannerComponent.jsx
import React from "react";
import "./banner.css";

const BannerComponent = () => {
  return (
    <div className="banner-wrapper">
      <div className="premium-tag">
       
        <span className="premium-text">Premium</span>
      </div>

      <div className="banner-description">
        Access this top-rated course, Get skills that accelerate your carreer.
        
      </div>

      <div className="learners-count">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="learners-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          height="24"
          width="24"
        >
          <path d="M17 21v-2a4 4 0 00-3-3.87" />
          <path d="M9 7a4 4 0 110 8" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="learners-number">1,573,386</span>
        <span className="learners-text">learners</span>
      </div>
    </div>
  );
};

export default BannerComponent;
