"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import "./editFee.css";

const FeeDetailsForm = () => {
  const router = useRouter();
  const { id } = useParams(); // Get package ID from URL
  const searchParams = useSearchParams();
const from = searchParams.get("from");


  const [formData, setFormData] = useState({
    total_fee: "",
    individual_course_fee: "",
    has_discount: false,
    payment_methods: "",
    financial_aid_available: false,
    discount_type: "",
    discount_value: null,
    allow_min_amount: false,
    min_amount: null,
    is_recurring: false,
    recurring_amount: null,
    number_of_months: 1,
    first_payment: "",
  });

  const [errors, setErrors] = useState({
    discount_value: "",
    total_fee: "",
    recurring_amount: "",
    number_of_months: "",
  });

  // 🟡 Fetch existing fee details
  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/${id}/fee`);
        const data = await res.json();
        console.log("Fetched data:", data);

        if (res.ok) {
          setFormData({
            ...data,
            individual_course_fee: JSON.stringify(data.individual_course_fee || {}),
          });
        }
        
      } catch (error) {
        console.error("Failed to fetch fee details:", error);
      }
    };

    if (id) fetchFeeData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;

    let newValue: any = value;
    if (type === "number") {
      newValue = value.trim() === "" ? null : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? isChecked : newValue,
     
    }));

    // Inline validation (optional)
    if (name === "discount_value" && formData.total_fee) {
      const discount = Number(value);
      const total = Number(formData.total_fee);
      if (formData.discount_type === "percent") {
        setErrors((prev) => ({
          ...prev,
          discount_value: discount > 100 || discount < 1 ? "1-100% allowed" : "",
        }));
      } else if (formData.discount_type === "amount") {
        setErrors((prev) => ({
          ...prev,
          discount_value: discount >= total ? "Less than total fee required" : "",
        }));
      }
    }
  };

  // ✅ Submit updated data using PUT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      individual_course_fee: JSON.parse(formData.individual_course_fee || "{}"),
    };

    try {
      const res = await fetch(`http://localhost:3000/package/${id}/fee`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Fee updated successfully!");
        if (from === "see-fee-details") {
          router.push(`/listPackage/see-fee-details/${id}`);
        } else {
          router.push(`/packagePage/${id}`);
        }
        
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error submitting fee data.");
    }
  };

  return (
    <div className="feeDetails-container">
      <form onSubmit={handleSubmit} className="feeDetails-form">
        <h2 className="title">Edit Fee Details</h2>

        <label>
          Is Recurring:
          <input
            type="checkbox"
            name="is_recurring"
            checked={formData.is_recurring}
            onChange={handleChange}
            style={{ marginLeft: "0.5rem" }} // Add some spacing
          />
        </label>

        {formData.is_recurring && (
          <>
            <label>First Payment:</label>
            <input
              type="number"
              name="first_payment"
              value={formData.first_payment}
              onChange={handleChange}
            />

            <label>Recurring Amount:</label>
            <input
              type="number"
              name="recurring_amount"
              value={formData.recurring_amount || ""}
              onChange={handleChange}
            />
            {errors.recurring_amount && (
              <p className="error-message">{errors.recurring_amount}</p>
            )}

            <label>Number of Months:</label>
            <input
              type="number"
              name="number_of_months"
              value={formData.number_of_months}
              onChange={handleChange}
            />
            {errors.number_of_months && (
              <p className="error-message">{errors.number_of_months}</p>
            )}
          </>
        )}

        <label>Total Fee:</label>
        <input
          type="number"
          name="total_fee"
          value={formData.total_fee}
          onChange={handleChange}
        />
        {errors.total_fee && <p className="error-message">{errors.total_fee}</p>}

        <label>Individual Course Fee (JSON):</label>
        <input
          type="text"
          name="individual_course_fee"
          value={formData.individual_course_fee}
          onChange={handleChange}
        />

        <label>Has Discount:
        <input
          type="checkbox"
          name="has_discount"
          checked={formData.has_discount}
          onChange={handleChange}
          style={{ marginLeft: "0.5rem" }}
        />
</label>
        {formData.has_discount && (
          <>
            <label>Discount Type:</label>
            <select
              name="discount_type"
              value={formData.discount_type || ""}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              <option value="amount">Amount</option>
              <option value="percent">Percentage</option>
            </select>

            <label>
              {formData.discount_type === "percent"
                ? "Discount (%)"
                : "Discount Amount"}
            </label>
            <input
              type="number"
              name="discount_value"
              value={formData.discount_value ?? ""}
              onChange={handleChange}
            />
            {errors.discount_value && (
              <p className="error-message">{errors.discount_value}</p>
            )}
          </>
        )}

        <label>Allow Min Amount:
        <input
          type="checkbox"
          name="allow_min_amount"
          checked={formData.allow_min_amount}
          onChange={handleChange}
          style={{ marginLeft: "1 rem"  }}
        />
        </label>

        {formData.allow_min_amount && (
          <>
            <label>Min Amount:</label>
            <input
              type="number"
              name="min_amount"
              value={formData.min_amount ?? ""}
              onChange={handleChange}
            />
          </>
        )}

        <label>Payment Methods (comma separated):</label>
        <input
          type="text"
          name="payment_methods"
          value={formData.payment_methods}
          onChange={handleChange}
        />

        <label>Financial Aid Available:
        <input
          type="checkbox"
          name="financial_aid_available"
          checked={formData.financial_aid_available}
          onChange={handleChange}
          style={{ marginLeft: "1 rem"  }}
        />
        </label>

        <button type="submit" className="submit-btn">Update Fee</button>
      </form>
    </div>
  );
};

export default FeeDetailsForm;
