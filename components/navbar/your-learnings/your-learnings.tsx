'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './your-learnings.css';

interface CartItem {
  id: number;
  packages: {
    package_id: number;
    title: string;
    is_free: boolean;
    courseLandingPage: {
      coverImage: string;
      title: string;
    };
    user: {
      name: string;
    };
    feeDetails: {
      total_fee: number;
      has_discount: boolean;
      discount_value: number;
      duration: string;
      discount_type: 'amount' | 'percentage' | string;
      payment_methods: string;
    } | null;
  };
}

interface Props {
  userId: string;
}

export default function CartDropdown({ userId }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/package/purchased/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();
        console.log('Cart Items:', data);
        setCartItems(data || []);
      } catch (err) {
        console.error(err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  if (loading) return <div className="cart-loading">Loading...</div>;

  return (
    <div className="cart-dropdown">
      <h4 className="cart-title">Your Learnings</h4>
      {cartItems.length === 0 ? (
        <p className="cart-empty">Learning list  is empty.Start learning</p>
      ) : (
        <>
        <ul className="cart-list">
          {cartItems.map((item, index) => {
            const {
              package_id,
              courseLandingPage,
              user,
              feeDetails,
              is_free,
              title,
            } = item.packages;

            const discountedPrice =
              feeDetails && feeDetails.discount_type === 'percentage'
                ? Math.round(
                  Number(feeDetails.total_fee) -
                  (Number(feeDetails.total_fee) * Number(feeDetails.discount_value)) / 100
                )
                : feeDetails
                  ? Math.round(Number(feeDetails.total_fee) - Number(feeDetails.discount_value))
                  : 0;

            // On click handler to route
            const handleClick = () => {
              router.push(`/packageOverview/${package_id}`);
            };

            return (
              <React.Fragment key={index}>
                <li key={index}>
                  <button
                    onClick={handleClick}
                    className="cart-item-button"
                    type="button"
                  >
                    <img
                      src={courseLandingPage?.coverImage}
                      alt={courseLandingPage?.title}
                      className="cart-image"
                    />
                    <div>
                      <p className="cart-course-title">{courseLandingPage?.title}</p>
                      <p className="cart-instructor"> {user?.name}</p>
                      <div className="card-price">
                        {is_free ? (
                          <span className="free-tag">Free</span>
                        ) : (
                          feeDetails && (
                            <>
                              <div className="price-wrapper">
                                {Number(feeDetails.discount_value) > 0 ? (
                                  <>
                                    <span className="discounted-price">₹{discountedPrice}</span>
                                    <span className="original-price">
                                      <s>₹{feeDetails.total_fee}</s>
                                    </span>
                                  </>
                                ) : (
                                  <span>₹{feeDetails.total_fee}</span>
                                )}
                              </div>

                            </>
                          )
                        )}
                      </div>
                    </div>
                  </button>
                </li>
                {index !== cartItems.length - 1 && <hr className="cart-divider" />}
              </React.Fragment>


            );
          })}
        </ul>
        <button
          type="button"
          className="go-to-wishlist-button"
          onClick={() => router.push(`/learnings/${userId}`)}
        >
          Go to Learnings
        </button>
        </>
      )}
    </div>
  );
}
