"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import "./see-fee-details.css";

interface FeeDetails {
  fee_id: number;
  total_fee: number;
  first_payment: number | null;
  recurring_amount: number | null;
  is_recurring: boolean;
  number_of_months: number | null;
  has_discount: boolean;
  discount_value: number | null;
  discount_type: string | null;
  payment_methods: string;
  allow_min_amount: boolean;
  min_amount: number | null;
  financial_aid_available: boolean;
  individual_course_fee: Record<string, number>;
  created_at: Date;
  package: {
    name: string;
  };
}

const SeeFeeDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [feeDetails, setFeeDetails] = useState<FeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/${id}/fee`);
        const data = await res.json();
        if (res.ok) setFeeDetails(data);
        else console.error("Error fetching fee details:", data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeDetails();
  }, [id]);

  const formatNumber = (value: number | null) =>
    value !== null ? (value % 1 === 0 ? Number(value) : value) : null;

  if (loading) return <p className="loading">Loading...</p>;
  if (!feeDetails) return <p className="error">No fee details found.</p>;

  const handleEditFee = () => {
    router.push(`/packagePage/edit/fee/${id}?from=see-fee-details`);
  };


  return (
    <div className="fee-details-container">
      <h2>Fee Details for {feeDetails.package.name}</h2>

      <div className="fee-summary">
        <p>
          Total fee for enrolling in this package is{" "}
          <strong>${formatNumber(feeDetails.total_fee)}</strong>.
        </p>
        {feeDetails.has_discount && (
          <p>
            <strong>Discount available:</strong>{" "}
            {formatNumber(feeDetails.discount_value)}%
          </p>
        )}
        {feeDetails.is_recurring && (
          <p>
            <strong>Monthly installment available</strong>
          </p>
        )}
        <p>
          <strong>Payment methods:</strong> {feeDetails.payment_methods}
        </p>
      </div>

      <div className="fee-columns">
        {feeDetails.has_discount && (
          <div className="fee-column">
            <h3>Discount Details</h3>
            <p>
              Discount of{" "}
              <strong>{formatNumber(feeDetails.discount_value)}%</strong> is
              available.
            </p>
            <p>
              Grab this for just $
              {formatNumber(
                feeDetails.total_fee *
                  (1 - (feeDetails.discount_value ?? 0) / 100)
              )}
            </p>
          </div>
        )}

        {feeDetails.is_recurring && (
          <div className="fee-column">
            <h3>Installment Details</h3>
            <p>
              You can pay in monthly installments over{" "}
              {formatNumber(feeDetails.number_of_months)}-month period.
            </p>

            <p>First Payment: ${formatNumber(feeDetails.first_payment)}</p>
            <p>Recurring Amount: ${formatNumber(feeDetails.recurring_amount)}</p>
          </div>
        )}

        <div className="fee-column">
          <h3>Payment Method</h3>
          <p>Pay Via {feeDetails.payment_methods}</p>
          {feeDetails.allow_min_amount && (
            <p>
              Minimum Amount Allowed: ${formatNumber(feeDetails.min_amount)}
            </p>
          )}
          <p>
            Financial Aid:{" "}
            <strong>
              {feeDetails.financial_aid_available
                ? "Available"
                : "Not Available"}
            </strong>
          </p>
        </div>
      </div>
      <button className="edit-fee-button" onClick={handleEditFee}>
        Edit Fee Details
      </button>
    </div>
  );
};

export default SeeFeeDetails;
