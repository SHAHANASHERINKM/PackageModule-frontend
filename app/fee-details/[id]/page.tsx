"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "./feeDetails.css";

const FeeDetailsForm = () => {
  const router = useRouter();
  const { id } = useParams(); // Get package_id from URL

  const [formData, setFormData] = useState({
    total_fee: "",
    individual_course_fee: "",
    has_discount: false,
    payment_methods: "",
    financial_aid_available: false,
    discount_type: "",
    discount_value: null, // Initialize as null
    allow_min_amount: false,
    min_amount: null, // Initialize as null
    is_recurring: false,
    recurring_amount: null, // For recurring fee
    number_of_months: 1, // Default value of 1 month
    first_payment:"",
  });

  const [errors, setErrors] = useState({
    discount_value: "",
    total_fee: "",
    recurring_amount: "",
    number_of_months: "",
  });

  useEffect(() => {
    if (!id) {
      alert("Package ID is missing!");
      router.push("/"); // Redirect if no package_id
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;

    let newValue: any = value;

    if (name === "discount_percentage" && value.trim() === "") {
      newValue = null;
    } else if (type === "number") {
      newValue = value.trim() === "" ? null : Number(value);  // Allow null for discount_value
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? isChecked : newValue,
    }));

    // Live validation for discount_value only when total_fee is entered
    if (name === "discount_value" && formData.total_fee) {
      let error = "";

      const discountValue = Number(value);
      const totalFee = Number(formData.total_fee);

      if (formData.discount_type === "percent") {
        if (discountValue > 100 || discountValue < 1) {
          error = "Percentage must be between 1 and 100.";
        }
      } else if (formData.discount_type === "amount") {
        if (discountValue >= totalFee) {
          error = "Amount must be less than the total fee.";
        }
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        discount_value: error,
      }));
    }

    // Ensure total_fee is entered if not recurring
    if (name === "total_fee") {
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          total_fee: "Total fee is required.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          total_fee: "",
        }));
      }
    }

    // Recurring Amount and Number of Months validation
    if (name === "recurring_amount" && formData.is_recurring) {
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          recurring_amount: "Recurring amount is required.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          recurring_amount: "",
        }));
      }
    }

    if (name === "number_of_months" && formData.is_recurring) {
      if (!value || Number(value) <= 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          number_of_months: "Number of months must be greater than 0.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          number_of_months: "",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure `package_id` is sent inside an object
    const requestData = {
      ...formData,
      package: { package_id: id },
      individual_course_fee: JSON.parse(formData.individual_course_fee || "{}"),
    };

    try {
      const response = await fetch("http://localhost:3000/package/fee", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (response.ok) {
        alert("Fee details saved successfully!");
        router.push(`/promo-page/${id}`);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="feeDetails-container">
      <form onSubmit={handleSubmit} className="feeDetails-form">
        <h2 className="title">Enter Fee Details For Your Package</h2>

        <label>Is Recurring:
        <input
          type="checkbox"
          name="is_recurring"
          checked={formData.is_recurring}
          onChange={handleChange}
          style={{ marginLeft: "1 rem"  }}    
              />
              </label>

        {/* Conditionally render fields based on Recurring */}
        {formData.is_recurring && (
          <>
            <label>First Payment:</label>
            <input
              type="number"
              name="first_payment"
              value={formData.first_payment }
              onChange={handleChange}
              
            />

            <label>Recurring Amount:</label>
            <input
              type="number"
              name="recurring_amount"
              value={formData.recurring_amount || ""}
              onChange={handleChange}
              required
            />
            
            {errors.recurring_amount && (
              <p className="error-message">{errors.recurring_amount}</p>
            )}

            <label>Number of Months:</label>
            <input
              type="number"
              name="number_of_months"
              value={formData.number_of_months || ""}
              onChange={handleChange}
              required
            />
            {errors.number_of_months && (
              <p className="error-message">{errors.number_of_months}</p>
            )}
          </>
        ) }
          <>
            <label>Total Fee:</label>
            <input
              type="number"
              name="total_fee"
              value={formData.total_fee}
              onChange={handleChange}
              required
            />
            {errors.total_fee && <p className="error-message">{errors.total_fee}</p>}
          </>
        
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
          style={{ marginLeft: "1 rem"  }}
        />
        </label>

        {formData.total_fee && formData.has_discount && (
          <>
            <label>Discount Type:</label>
            <select
              name="discount_type"
              value={formData.discount_type || ""}
              onChange={handleChange}
            >
              <option value="">--Select Type--</option>
              <option value="amount">Amount</option>
              <option value="percent">Percentage</option>
            </select>

            <div className="discount-inline-group">
              <label>
                {formData.discount_type === "percent"
                  ? "Discount Percentage:"
                  : "Discount Amount:"}
              </label>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value ?? ""} // This will be "" when null
                onChange={handleChange}
                className={errors.discount_value ? "error-input" : ""}
              />
            </div>
            {errors.discount_value && (
              <p className="error-message">{errors.discount_value}</p>
            )}
          </>
        )}

        <label>Allow Student To Pay Min-Amount:
        <input
          type="checkbox"
          name="allow_min_amount"
          checked={formData.allow_min_amount}
          onChange={handleChange}
          style={{ marginLeft: "1 rem"  }}
        />
        </label>
        {formData.allow_min_amount && (
          <div className="min-amount-group">
            <label>Min Amount:</label>
            <input
              type="number"
              name="min_amount"
              value={formData.min_amount || ""}
              onChange={handleChange}
            />
          </div>
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

        <button type="submit" className="submit-btn">Save Fee Details</button>
      </form>
    </div>
  );
};

export default FeeDetailsForm;
