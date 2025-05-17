"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "./packagePage.css";

interface PackageData {
  package_id: string;
  name: string;
  description: string;
  duration: number;
  level: string;
  instructor: string;
  cover_image: string;
  language: string;
  is_free: boolean;
  is_published: boolean;
  target_audience: string;
  has_subtitles: boolean;
  completion_benefit: string;
  prerequisites: string;
  skills_gained: string;
  no_of_seats: string;
  type: string;
  promoVideoUrl?: string;
  thumbnailUrl?: string;
}

interface FeeDetails {
  total_fee: number;
  first_payment: number | null;
  recurring_amount: number | null;
  is_recurring: boolean;
  number_of_months: number | null;
  individual_course_fee: object | null;
  has_discount: boolean;
  discount_value: number | null;
  discount_type: string | null;
  payment_methods: string;
  allow_min_amount: boolean;
  min_amount: number | null;
  financial_aid_available: boolean;
}

const PackagePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [feeDetails, setFeeDetails] = useState<FeeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      alert("Package ID is missing!");
      router.push("/");
      return;
    }

    const fetchPackageData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/package/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPackageData(data.package);
          if (!data.package.is_free) {
            fetchFeeDetails();
          } else {
            setLoading(false);
          }
        } else {
          console.error("Error fetching package:", data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Network error:", error);
        setLoading(false);
      }
    };

    const fetchFeeDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/${id}/fee`);
        const data = await res.json();
        if (res.ok) {
          setFeeDetails(data);
        } else {
          console.error("Error fetching fee details:", data);
        }
      } catch (error) {
        console.error("Fee fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [id, router]);

  const renderField = (
    label: string,
    value: string | number | boolean | null | undefined
  ) => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return null;
    }

    const displayValue =
      typeof value === "boolean" ? (value ? "Yes" : "No") : value;

    return (
      <p>
        <strong>{label}:</strong> {displayValue}
      </p>
    );
  };

  const handleDelete = async () => {
    if (!id) {
      alert("Package ID is missing!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        const res = await fetch(`http://localhost:3000/package/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("Package deleted successfully!");
          router.push("/"); // Redirect to home or package listing page
        } else {
          const errorData = await res.json();
          console.error("Error deleting package:", errorData);
          alert(`Failed to delete package: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting the package.");
      }
    }
  };

  const handlePublish = async () => {
    if (!id) return;

    try {
      const res = await fetch(`http://localhost:3000/package/packages/${id}/publish`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (res.ok) {
        setPackageData((prevData) => ({
          ...prevData!,
          is_published: true,
        }));
        alert("Package published successfully!"); // Show success message
      } else {
        console.error("Error publishing package:", data);
        alert("Failed to publish package."); // Show failure message
      }
    } catch (error) {
      console.error("Error during publishing:", error);
    }
  };

  const hasMedia = 
    packageData?.cover_image || packageData?.promoVideoUrl || packageData?.thumbnailUrl;

  if (loading) return <p>Loading package details...</p>;

  return (
    <div className="page-container">
      {packageData ? (
        <>
          <div className="package-card">
            <div className="package-title-container">
              <h2 className="package-title">📦 {packageData.name}</h2>
              {!packageData.is_published && (
                <button className="publish-button" onClick={handlePublish}>
                  Publish
                </button>
              )}
            </div>

            <div className="package-grid">
              {packageData.description && (
                <div className="package-description">
                  <p><strong>Description:</strong></p>
                  <div dangerouslySetInnerHTML={{ __html: packageData.description }} />
                </div>
              )}
              {renderField("Type", packageData.type)}
              {renderField("Duration", `${packageData.duration} months`)}
              {renderField("Language", packageData.language)}
              {renderField("Level", packageData.level)}
              {renderField("Published", packageData.is_published ? "Yes" : "No")}
              {renderField("Target Audience", packageData.target_audience)}
              {renderField("Has Subtitles", packageData.has_subtitles)}
              {renderField("Completion Benefit", packageData.completion_benefit)}
              {renderField("Prerequisites", packageData.prerequisites)}
              {renderField("Skills Gained", packageData.skills_gained)}
              {renderField("No. of Seats", packageData.no_of_seats)}
            </div>

            <button
              className="edit-button"
              onClick={() => router.push(`/packagePage/edit/package/${id}`)}
            >
              ✏️ Edit Package
            </button>
          </div>

          {/* Fee Details Section */}
          <div className="package-card">
            <h3 className="package-title">💰 Fee Details</h3>
            {packageData.is_free ? (
              <p>This package is <strong>free</strong>.</p>
            ) : feeDetails ? (
              <>
                <div className="package-grid">
                  {renderField("Total Fee", `$${feeDetails.total_fee}`)}
                  {feeDetails.is_recurring && (
                    <>
                      {renderField("First Payment", `$${feeDetails.first_payment}`)}
                      {renderField("Recurring Amount", `$${feeDetails.recurring_amount}`)}
                      {renderField("Number of Months", feeDetails.number_of_months)}
                    </>
                  )}
                  {feeDetails.has_discount && (
                    <>
                      {renderField("Discount", `${feeDetails.discount_value}%`)}
                      {renderField("Discount Type", feeDetails.discount_type)}
                    </>
                  )}
                  {renderField("Payment Methods", feeDetails.payment_methods)}
                  {feeDetails.allow_min_amount &&
                    renderField("Minimum Amount", `$${feeDetails.min_amount}`)}
                  {renderField("Financial Aid", feeDetails.financial_aid_available)}
                </div>

                <button
                  className="edit-button"
                  onClick={() => router.push(`/packagePage/edit/fee/${id}`)}
                >
                  ✏️ Edit Fee Details
                </button>
              </>
            ) : (
              <p>Fee details not available.</p>
            )}
          </div>

          {/* Media Section */}
          <div className="media-section">
            <h3 className="package-title">🎬 Media</h3>
            {hasMedia ? (
              <div className="media-grid">
                {packageData.cover_image && (
                  <div className="media-item">
                    <p>
                      <strong>Cover Image</strong>
                    </p>
                    <img
                      src={packageData.cover_image}
                      alt="Cover"
                      className="media-thumbnail"
                    />
                  </div>
                )}
                {packageData.promoVideoUrl && (
                  <div className="media-item">
                    <p>
                      <strong>Promo Video</strong>
                    </p>
                    <video
                      className="media-thumbnail"
                      controls
                      src={packageData.promoVideoUrl}
                    />
                  </div>
                )}
                {packageData.thumbnailUrl && (
                  <div className="media-item">
                    <p>
                      <strong>Thumbnail</strong>
                    </p>
                    <img
                      src={packageData.thumbnailUrl}
                      alt="Thumbnail"
                      className="media-thumbnail"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p>No media available for this package.</p>
            )}
          </div>

          {/* Edit or Add Media Button */}
          <button
            className="edit-button"
            onClick={() => router.push(`/packagePage/edit/media-page/${id}`)}
          >
            {hasMedia ? "✏️ Edit Media Details" : "➕ Add Media Details"}
          </button>
        </>
      ) : (
        <p>Package not found.</p>
      )}
       <button className="delete-button" onClick={handleDelete}>
        🗑️ Delete Package
      </button>
    </div>
  );
};

export default PackagePage;
