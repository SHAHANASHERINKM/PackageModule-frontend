"use client";

import React, { useEffect, useState } from "react";
import "./priceCard.css";
import { useParams } from "next/navigation";

interface PackageData {
  is_free: boolean;
  user: {
    user_id: number;
    name: string;
  };
  category: {
    cat_id: number;
    categoryName: string;
  };
  courseLandingPage: {
    title: string;
    subtitle: string;
    description: string;
    language: string;
    coverImage: string;
    thumbnailImage: string;
    videoFile: string;
  };
  feeDetails: {
    total_fee: number;
    has_discount: boolean;
    discount_value: number;
    duration: string; // ISO date string e.g. "2025-05-31"
    discount_type: 'amount' | 'percentage' | string;
    payment_methods: string;
    seats: number;
  };
  intendedLearners: {
    learningObjectives: string[];
    requirements: string[];
    audience: string[];
  }[];
}

export default function PriceCard() {
  const [data, setData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const params = useParams();
  const packageId = params?.packageId;

  useEffect(() => {
    async function fetchPackage() {
      if (!packageId) return;
      try {
        const res = await fetch(`http://localhost:3000/package/${packageId}/package`);
        const json = await res.json();
        console.log('Fetched package data from price card:', json);
        setData(json);

        // Calculate days remaining from duration
        if (json.feeDetails?.duration) {
          const today = new Date();
          const endDate = new Date(json.feeDetails.duration);
          const diffInTime = endDate.getTime() - today.getTime();
          const diffInDays = Math.max(0, Math.ceil(diffInTime / (1000 * 60 * 60 * 24)));
          setDaysLeft(diffInDays);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [packageId]);

  if (!data) return <p style={{ textAlign: "center" }}>No Data Found</p>;


  return (
    <div className="styled-price-card">
      {/* Thumbnail with preview overlay */}
      <div className="thumbnail-box">
        <img
          src={data?.courseLandingPage?.thumbnailImage || "/fallback-thumbnail.jpg"}
          alt="Course Thumbnail"
          className="thumbnail-image"
        />
        <div className="overlay-play">▶ Preview this course</div>
      </div>



      <div className="details-section">
        {/* Info */}
        <p className="info-note">✨ Get this premium course now</p>

        {/* Price Block */}
        <div className="price-info-block">
          {!data?.is_free && data.feeDetails && (
            <>
              {data.feeDetails.has_discount && data.feeDetails.discount_value ? (
                <div >
                <div className="course-price-line">
                  <span className="discounted-price">
                    ₹
                    {data.feeDetails.discount_type === "percent"
                      ? Math.round(
                        data.feeDetails.total_fee -
                        (data.feeDetails.total_fee * data.feeDetails.discount_value) / 100
                      )
                      : data.feeDetails.total_fee - data.feeDetails.discount_value}
                  </span>
                  <span className="original-price">₹{Math.round(data.feeDetails.total_fee)}</span>
                  <span className="discount-info">
                    (
                    {data.feeDetails.discount_type === "percent"
                      ? `${Math.round(data.feeDetails.discount_value)}% OFF`
                      : `Save ₹${Math.round(data.feeDetails.discount_value)}`}
                    )
                  </span>
     
                </div>
                {daysLeft !== null && (
                    <p className="limited-time">
                      ⏰ <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</strong> left at this price!
                    </p>
                  )}
                  </div>
              ) : (
                <div className="course-price">₹{data.feeDetails.total_fee}</div>
              )}
            </>
          )}
        </div>


        {data.feeDetails.seats && (
          <div className="no_of_seats">
            {data.feeDetails.seats && <p className="seats">🔥{data.feeDetails.seats} Seats Left! Hurry Up!</p>}
          </div>
        )}
      </div>
      {/* Buttons */}
      <div className="button-group">
        <button className="add-to-cart">Add to cart</button>
        <button className="wishlist">❤</button>
      </div>
      <button className="buy-now">Buy now</button>
    </div>
  );
}
