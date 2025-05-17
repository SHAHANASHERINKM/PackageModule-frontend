"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./more-details.css"; // External CSS
import JoinModal from "../joinModal/joinModal"; // Import the JoinModal component
// Example in a React app



interface Package {
  package_id: number;
  name: string;
  is_free: boolean;
  is_published: boolean;
  skills_gained: string | null;
  duration: number;
  language: string;
  promoVideoUrl: string;
  thumbnailUrl: string;

  prerequisites?: string | null;
  completion_benefit?: string;
  instructor: {
    user_id: number;
    name: string;
    email: string;
    role: string;
    description: string | null;
  };
  feeDetails: {
    fee_id: number;
    total_fee: number;
    has_discount: boolean;
    discount_type: string;
    discount_value: number;
    is_recurring?: boolean; // Added property
    first_payment?: number; // Optional property for recurring payments
    recurring_amount?: number; // Optional property for recurring payments
    number_of_months?: number; // Optional property for recurring payments
  };
  cover_image: string | null;
  description: string;
  no_of_seats: number | null;
}

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [activeTab, setActiveTab] = useState("Skills you'll learn");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [successMessageHtml, setSuccessMessageHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Handle preview video click
  const handlePreviewClick = () => {
    setVideoPlaying(true);
  };

  // Parse description if it's in JSON format or raw HTML
  function parseDescription(desc: string): string {
    try {
      const parsed = JSON.parse(desc);

      if (Array.isArray(parsed) && parsed.every((el) => typeof el === "string")) {
        return parsed.join("");
      }

      if (Array.isArray(parsed) && parsed[0]?.children) {
        return parsed
          .map((block) => block.children?.map((c: any) => c.text).join("")).join("<br>");
      }

      if (typeof parsed === "string") {
        return parsed;
      }

      return "";
    } catch (err) {
      return desc; // Return raw HTML if parsing fails
    }
  }

  // Fetch success message after component mount
  useEffect(() => {
    console.log("Package ID:", id);
    async function fetchSuccessMessage() {
      try {
        const response = await fetch(`http://localhost:3000/package/success-message/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch success message. Status: ${response.status}`);
        }
    
        const rawData = await response.text(); // Get the raw HTML response as text
        console.log('Raw HTML data:', rawData); // Check the HTML response
    
        // If the response is HTML, set it as inner HTML directly
        setSuccessMessageHtml(rawData); // Assuming rawData is HTML string
    
      } catch (error) {
        console.error('Error fetching success message:', error);
        setSuccessMessageHtml('<p>Unable to fetch success message.</p>'); // Fallback message
      } finally {
        setLoading(false);
      }
    }
    
    

    if (id) {
      fetchSuccessMessage();
    }
  }, [id]);

  // Fetch package details after component mount
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/package/package/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Package:", data);
          setPkg(data.package);
        })
        .catch((err) => {
          console.error("Error fetching package details:", err);
          setLoading(false); // Stop loading if fetch fails
        });
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!pkg) {
    return <div className="error">Package not found or failed to load</div>;
  }

  return (
    <div className="full-page-container">
      <div className="course-container">
        <div className="left-section">
          {pkg.promoVideoUrl ? (
            <div className="media-preview-container">
              {!videoPlaying ? (
                <div className="media-wrapper">
                  <img
                    src={pkg.thumbnailUrl || pkg.cover_image || "/default-coverpage.jpg"}
                    alt={pkg.name}
                    className="media-preview"
                  />
                  <button className="preview-button" onClick={handlePreviewClick}>
                    <div className="play-icon">&#9658;</div>
                  </button>
                  <div className="preview-label">Preview this Course</div>
                </div>
              ) : (
                <video
                  src={pkg.promoVideoUrl}
                  controls
                  autoPlay
                  className="media-preview"
                />
              )}
            </div>
          ) : pkg.thumbnailUrl ? (
            <div className="media-preview-container">
              <div className="media-wrapper">
                <img src={pkg.thumbnailUrl} alt={pkg.name} className="thumbnail-image" />
              </div>
            </div>
          ) : pkg.cover_image ? (
            <div className="media-preview-container">
              <div className="cover-wrapper">
                <img src={pkg.cover_image} alt={pkg.name} className="cover-image" />
              </div>
            </div>
          ) : (
            <div className="default-image-wrapper">
              <img
                src="/default-coverpage.jpg"
                alt="Default Course"
                className="default-image"
              />
            </div>
          )}
        </div>

        <div className="right-section">
          <h1 className="course-title">{pkg.name}</h1>
          <div
            className="description"
            dangerouslySetInnerHTML={{
              __html: parseDescription(pkg.description),
            }}
          />

          <div className="course-meta">
            {pkg.is_free && <span className="badge">Free tutorial</span>}
            <span className="rating">4.5 ★ (3,682 ratings)</span>
            <span className="students">85,603 students</span>
          </div>

          <div className="course-info">
            <p className="duration">{pkg.duration}<span> Months To Complete</span></p>
            <p className="creator">Created by <strong>{pkg.instructor.name}</strong></p>
            <p className="language">🌐 {pkg.language}</p>
          </div>

          <div className="price-div">
            {!pkg.is_free && pkg.feeDetails && (
              <>
                {pkg.feeDetails.has_discount && pkg.feeDetails.discount_value ? (
                  <div className="course-price-line">
                    <span className="discounted-price">
                      ₹
                      {pkg.feeDetails.discount_type === "percent"
                        ? Math.round(
                          pkg.feeDetails.total_fee - 
                          (pkg.feeDetails.total_fee * pkg.feeDetails.discount_value) / 100
                        )
                        : pkg.feeDetails.total_fee - pkg.feeDetails.discount_value}
                    </span>
                    <span className="original-price">₹{pkg.feeDetails.total_fee}</span>
                    <span className="discount-info">
                      (
                      {pkg.feeDetails.discount_type === "percent"
                        ? `${Math.round(pkg.feeDetails.discount_value)}% OFF`
                        : `Save ₹${Math.round(pkg.feeDetails.discount_value)}`}
                      )
                    </span>
                  </div>
                ) : (
                  <div className="course-price">₹{pkg.feeDetails.total_fee}</div>
                )}
              </>
            )}
          </div>

          {pkg.no_of_seats && (
            <div className="no_of_seats">
              {pkg.no_of_seats && <p className="seats">🔥{pkg.no_of_seats} Seats Left! Hurry Up!</p>}
            </div>
          )}

          <button className="enroll-button">
            {pkg.is_free ? "Enroll now" : "Buy now"}
          </button>
          <button className="wishlist-btn">❤️ Add to Wishlist</button>

          <JoinModal buttonText="Join This Course" message={successMessageHtml} />
        </div>
      </div>

      {/* Bottom Section for Tabs */}
     {/* Bottom Section for Info Cards */}
<div className="info-cards-container">
  {(pkg.skills_gained && pkg.skills_gained.trim()) && (
    <div className="info-card">
      <h3>Skills You'll Learn</h3>
      <ul className="card-list">
        {pkg.skills_gained
          .split(",")
          .filter((skill) => skill.trim() !== "")
          .map((skill, index) => (
            <li key={index}>✔ {skill.trim()}</li>
          ))}
      </ul>
    </div>
  )}

  {(pkg.prerequisites && pkg.prerequisites.trim()) && (
    <div className="info-card">
      <h3>Prerequisites</h3>
      <p>{pkg.prerequisites}</p>
    </div>
  )}

  {(pkg.completion_benefit && pkg.completion_benefit.trim()) && (
    <div className="info-card">
      <h3>Completion Benefits</h3>
      <p>{pkg.completion_benefit}</p>
    </div>
  )}

{(pkg.feeDetails && !pkg.is_free) && (
  <div className="info-card">
    <h3>About Fee</h3>
    <ul className="card-list">
      <li>Total Amount: ₹{pkg.feeDetails.total_fee}</li>

      {pkg.feeDetails.has_discount && (
        <li>
          {pkg.feeDetails.discount_type === "percent"
            ? `${pkg.feeDetails.discount_value}% Discount Available`
            : `Flat ₹${pkg.feeDetails.discount_value} Off`} - Buy now for ₹
          {pkg.feeDetails.discount_type === "percent"
            ? Math.round(
                pkg.feeDetails.total_fee -
                  (pkg.feeDetails.total_fee * pkg.feeDetails.discount_value) / 100
              )
            : pkg.feeDetails.total_fee - pkg.feeDetails.discount_value}
        </li>
      )}

      {pkg.feeDetails.is_recurring && (
        <><p>Monthly Payment Available:</p>
          <li>💸 First Payment: ₹{pkg.feeDetails.first_payment}</li>
          <li>🔁 Recurring: ₹{pkg.feeDetails.recurring_amount} / month</li>
          <li>📆 Duration: {pkg.feeDetails.number_of_months} months</li>
        </>
      )}
    </ul>
  </div>
)}

</div>

    </div>
  );
}
