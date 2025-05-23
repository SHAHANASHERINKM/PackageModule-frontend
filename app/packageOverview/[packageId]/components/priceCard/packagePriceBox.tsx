"use client";

import React, { useEffect, useState } from "react";
import "./priceCard.css";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import JoinModal from "../joinModal/joinModal";


interface PackageData {
  is_free: boolean;
  user: { user_id: number; name: string };
  category: { cat_id: number; categoryName: string };
  courseLandingPage: {
    title: string;
    subtitle: string;
    description: string;
    language: string;
    coverImage: string;
    thumbnailImage: string;
    videoFile: string;
    seats: number;
  };
  feeDetails: {
    total_fee: number;
    has_discount: boolean;
    discount_value: number;
    duration: string;
    discount_type: "amount" | "percentage" | string;
    payment_methods: string;
  };
  intendedLearners: {
    learningObjectives: string[];
    requirements: string[];
    audience: string[];
  }[];
  successMessage:{
    pageContent: string;
  }
}

export default function PriceCard() {
  const [data, setData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const packageId = params?.packageId;
  const [userId, setUserId] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
const [addedToCart, setAddedToCart] = useState(false);
const [showJoinModal, setShowJoinModal] = useState(false);
const [hasPurchased, setHasPurchased] = useState(false);
const [hasPurchasedOrEnrolled, setHasPurchasedOrEnrolled] = useState(false);
const [learnersCount, setLearnersCount] = useState<number>(0);

// Calculate seats left
const seatsLeft =
  data && typeof data.courseLandingPage.seats === "number"
    ? data.courseLandingPage.seats - learnersCount
    : 0;


  useEffect(() => {
    const userSession = sessionStorage.getItem("user");
    if (userSession) {
      const user = JSON.parse(userSession);
      setUserId(user.user_id);
    }
  }, []);

  useEffect(() => {
    async function fetchPackage() {
      if (!packageId) return;
      try {
        const res = await fetch(`http://localhost:3000/package/${packageId}/package`);
        const json = await res.json();
        setData(json);

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

  useEffect(() => {
  async function fetchLearnersCount() {
    if (!packageId) return;
    try {
      const res = await fetch(`http://localhost:3000/package/${packageId}/learners-count`);
      if (!res.ok) throw new Error("Failed to fetch learners count");
      const json = await res.json();
      // Assuming the API returns { count: number }
      setLearnersCount(json.count ?? 0);
    } catch (error) {
      console.error("Error fetching learners count:", error);
      setLearnersCount(0);
    }
  }
  fetchLearnersCount();
}, [packageId]);


  useEffect(() => {
  if (!userId || !packageId) return;

  async function checkStatus() {
    try {
      const res = await fetch(`http://localhost:3000/package/cart-wishlist-status/${userId}/${packageId}`);
      const json = await res.json();

      if (res.ok) {
        setIsWishlisted(json.isWishlisted);
        setAddedToCart(json.isInCart);
      } else {
        setIsWishlisted(false);
        setAddedToCart(false);
      }
    } catch (err) {
      console.error("Error checking wishlist and cart status:", err);
      setIsWishlisted(false);
      setAddedToCart(false);
    }
  }

  checkStatus();
}, [userId, packageId]);

useEffect(() => {
  if (!userId || !packageId) return;

  async function checkPurchaseStatus() {
    try {
      const res = await fetch(`http://localhost:3000/package/purchase-status/${userId}/${packageId}`);
      const json = await res.json();
      if (res.ok && json.purchased) {
        setHasPurchasedOrEnrolled(true);
      }
    } catch (err) {
      console.error("Failed to check purchase status:", err);
    }
  }

  checkPurchaseStatus();
}, [userId, packageId]);



  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const handleAddToCart = async () => {
  if (addedToCart) {
    // Navigate to cart page
    router.push(`/cart/${userId}`);
    return;
  }

  if (!userId || !packageId) {
    alert("Missing user or package ID.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/package/add-to-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, packageId: Number(packageId) }),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Added to cart successfully!");
      setAddedToCart(true);
    } else {
      alert(result.message || "Unknown error");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    alert("Something went wrong while adding to cart.");
  }
};

const handleBuyNow = async () => {
  const confirmMessage = data?.is_free
    ? "Are you sure you want to enroll in this free course?"
    : "Are you sure you want to buy this course?";

  const confirmed = window.confirm(confirmMessage);
  if (!confirmed) return;

  try {
    const res = await fetch("http://localhost:3000/package/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, packageId: Number(packageId) }),
    });

    const result = await res.json();

    if (res.ok) {
      alert(data?.is_free ? "Enrolled successfully!" : "Purchase successful!");
      setHasPurchasedOrEnrolled(true);
      
      setShowJoinModal(true);

    } else {
      alert(result.message || "Something went wrong.");
    }
  } catch (error) {
    console.error("Purchase failed:", error);
    alert("Something went wrong. Please try again.");
  }
};


  const handleAddToWishlist = async () => {
    if (!userId || !packageId) {
      alert("Missing user or package ID.");
      return;
    }

    try {
      if (isWishlisted) {
        const res = await fetch(`http://localhost:3000/package/wish-list/${userId}/${packageId}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (res.ok) {
          alert("Removed from wishlist successfully!");
          setIsWishlisted(false);
        } else {
          alert(result.message || "Failed to remove from wishlist.");
        }
      } else {
        const res = await fetch("http://localhost:3000/package/wish-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, packageId: Number(packageId) }),
        });
        const result = await res.json();
        if (res.ok) {
          alert("Added to wishlist successfully!");
          setIsWishlisted(true);
        } else {
          alert(result.message || "Failed to add to wishlist.");
        }
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      alert("Something went wrong.");
    }
  };

  if (!data) return <p style={{ textAlign: "center" }}>No Data Found</p>;

  return (
    <>
      <div className="styled-price-card">
        <div className="thumbnail-box">
          <img
            src={data?.courseLandingPage?.thumbnailImage || "/fallback-thumbnail.jpg"}
            alt="Course Thumbnail"
            className="thumbnail-image"
          />
          <div className="overlay-play">
            <button onClick={() => setIsModalOpen(true)}>▶ Preview this course</button>
          </div>
        </div>

        <div className="details-section">
          <p className="info-note">
            {data?.is_free ? "🎉 Get this course for FREE!" : "✨ Get this premium course now"}
          </p>

          <div className="price-info-block">
            {!data.is_free && data.feeDetails && (
              <>
                {data.feeDetails.has_discount && data.feeDetails.discount_value ? (
                  <div>
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
                        ({data.feeDetails.discount_type === "percent"
                          ? `${Math.round(data.feeDetails.discount_value)}% OFF`
                          : `Save ₹${Math.round(data.feeDetails.discount_value)}`})
                      </span>
                    </div>
                    {daysLeft !== null && (
                      <p className="limited-time">
                        ⏰ <strong>{daysLeft} {daysLeft === 1 ? "day" : "days"}</strong> left at this price!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="course-price">₹{data.feeDetails.total_fee}</div>
                )}
              </>
            )}
          </div>

         {typeof data.courseLandingPage.seats === "number" && (
  <div className="no_of_seats">
    {seatsLeft > 0 ? (
      <p className="seats">
        🔥 {seatsLeft} Seats Left! Hurry Up!
      </p>
    ) : (
      <p className="seats out-of-seats">❌ Out of Seats</p>
    )}
  </div>
)}
        </div>

        <div className="button-group">
          <button className="add-to-cart" onClick={handleAddToCart}>
  {addedToCart ? "Go to cart" : "Add to cart"}
</button>


          <button className="wishlist" onClick={handleAddToWishlist}>
            {isWishlisted ? (
              <AiFillHeart size={24} className="wishlist-icon active" />
            ) : (
              <AiOutlineHeart size={24} className="wishlist-icon" />
            )}
          </button>
        </div>

      {hasPurchasedOrEnrolled ? (
  <button
    className="buy-now"
    onClick={() => router.push(`/course-content-page/${packageId}`)}
  >
    Go to Course
  </button>
) : (
  <button
    className="buy-now"
    onClick={handleBuyNow}
    disabled={
      typeof data.courseLandingPage.seats === "number"
        ? seatsLeft <= 0
        : false
    }
    style={{
      cursor:
        typeof data.courseLandingPage.seats === "number" && seatsLeft <= 0
          ? "not-allowed"
          : "pointer",
    }}
    title={
      typeof data.courseLandingPage.seats === "number" && seatsLeft <= 0
        ? "No seats available"
        : undefined
    }
  >
    {typeof data.courseLandingPage.seats === "number" && seatsLeft <= 0
      ? "Out of Seats"
      : data?.is_free
      ? "Enroll Now"
      : "Buy Now"}
  </button>
)}



      </div>

      {isModalOpen && (
        <div className="video-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>✖</button>
            <h2 className="modal-heading">Course Preview</h2>
            <h2 className="modal-heading">{data.courseLandingPage.title}</h2>
            <video controls autoPlay className="promo-video">
              <source src={data?.courseLandingPage?.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <JoinModal
  isOpen={showJoinModal}
  onClose={() => setShowJoinModal(false)}
  message={data?.successMessage?.pageContent}
/>

    </>
  );
}
