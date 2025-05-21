'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@components/navbar/navbar';
import './cart.css';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Import Link from next/link

interface CartItem {
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

export default function CartPage() {
  const params = useParams();
  const userId = params?.userId;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchCartItems = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/cart/${userId}`);
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error('Error fetching cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  // Handler to remove item from cart
  const handleRemove = async (packageId: number) => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:3000/package/cart/${userId}/${packageId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to remove item from cart');
      }
      // Update cartItems state by filtering out removed item
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.packages.package_id !== packageId)
      );
    } catch (err) {
      console.error(err);
      alert('Could not remove item from cart. Please try again.');
    }
  };

  return (
    <div className="cart-page-container">
      <Navbar />
      <div className="cart-page-content">
        <h1 className="cart-heading">Shopping Cart</h1>

        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {cartItems.map((item, index) => {
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
                        <span className="free-tag">Free</span>
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
  <Link href="#" className="cart-action-link" onClick={() => handleRemove(package_id)}>
    Remove from Cart
  </Link>
  <Link href={`/buy/${package_id}`} className="cart-action-link">
    Buy Now
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
