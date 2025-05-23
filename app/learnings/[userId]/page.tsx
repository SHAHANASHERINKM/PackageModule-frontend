'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@components/navbar/navbar';
import './learning.css';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Import Link from next/link

interface LearningItem {
  id: number;
  packages: {
    package_id: number;
    title: string;
    is_free: boolean;
    courseLandingPage: {
      title: string;
      coverImage: string;
    };
    user: {
      name: string;
    };
    feeDetails: {
      total_fee: string;
      discount_value: string;
      discount_type: string;
    } | null;
  };
}

export default function LearningsPage() {
  const params = useParams();
  const userId = params?.userId;

  const [learnings, setLearnings] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchLearnings = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/purchased/${userId}`);
        const data = await res.json();
        setLearnings(data);
      } catch (err) {
        console.error('Error fetching learnings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnings();
  }, [userId]);

  

  return (
    <div className="cart-page-container">
      <Navbar />
      <div className="cart-page-content">
        <h1 className="cart-heading">Your Learnings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : learnings.length === 0 ? (
          <p className="cart-empty">No learnings found.</p>
        ) : (
          <ul className="cart-list">
            {learnings.map((item, index) => {
              const { packages } = item;
              const { courseLandingPage, user, feeDetails, is_free, package_id } = packages;

              const discountedPrice =
                feeDetails && feeDetails.discount_type === 'percentage'
                  ? Math.round(
                      Number(feeDetails.total_fee) -
                        (Number(feeDetails.total_fee) * Number(feeDetails.discount_value)) / 100
                    )
                  : feeDetails
                  ? Math.round(Number(feeDetails.total_fee) - Number(feeDetails.discount_value))
                  : 0;

              return (
                <li className="cart-item" key={index}>
                  <img
                    src={courseLandingPage.coverImage}
                    alt={courseLandingPage.title}
                    className="cart-image"
                  />
                  <div className="cart-details">
                    <p className="cart-course-title">{courseLandingPage.title}</p>
                    <p className="cart-instructor">{user.name}</p>
                    <div className="card-price">
                      {is_free ? (
                        <span className="learning-free-tag">Free Tutorial</span>
                      ) : feeDetails ? (
                        Number(feeDetails.discount_value) > 0 ? (
                          <>
                            <span className="discounted-price">₹{discountedPrice}</span>
                            <span className="original-price">
                              <s>₹{feeDetails.total_fee}</s>
                            </span>
                          </>
                        ) : (
                          <span>₹{feeDetails.total_fee}</span>
                        )
                      ) : null}
                    </div>
                  </div>

                  {/* Buttons container on the right */}
                  <div className="cart-actions">
                    <Link href={`/course-content-page/${package_id}`} className="cart-action-link">
  Go to Course
</Link>

                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}