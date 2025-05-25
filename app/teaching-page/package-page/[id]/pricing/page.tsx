"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "./pricing.css";
import { useDirty } from "../DirtyContext"; // <-- Import the context

const FeeDetailsForm = () => {
  const router = useRouter();
  const params = useParams();
  const package_id = params?.id as string;
  const { isDirty, setIsDirty } = useDirty(); // <-- Use context

  const [isLoad, setIsLoad] = useState(false); // true = editing, false = creating

  const [formData, setFormData] = useState({
    total_fee: "",
    has_discount: false,
    payment_methods: "",
    discount_type: "",
    discount_value: null,
    duration: null,
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
    duration: "",
  });

  useEffect(() => {
    if (!package_id) {
      alert("Package ID is missing!");
      router.push("/"); // Redirect if no package_id
      return;
    }

    const fetchPricingData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/package/${package_id}/price`);
        if (!response.ok) return;

        const result = await response.json();
        if (!result || result.isFree) {
          setIsLoad(false);
          setIsDirty(false); // Mark as clean after initial load
          return;
        }

        setIsLoad(true);
        setFormData({
          total_fee: result.total_fee?.toString() || "",
          has_discount: result.has_discount ?? false,
          payment_methods: result.payment_methods || "",
          discount_type: result.discount_type || "",
          discount_value: result.discount_value ?? null,
          duration: result.duration ?? null,
          allow_min_amount: result.allow_min_amount ?? false,
          min_amount: result.min_amount ?? null,
          is_recurring: result.is_recurring ?? false,
          recurring_amount: result.recurring_amount ?? null,
          number_of_months: result.number_of_months ?? 1,
          first_payment: result.first_payment?.toString() || "",
        });
        setIsDirty(false); // Mark as clean after data load
      } catch (err) {
        setIsDirty(false); // Mark as clean on error
        console.error("Error fetching pricing data:", err);
      }
    };

    fetchPricingData();
  }, [package_id, router, setIsDirty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIsDirty(true); // Mark as dirty on any change

    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;

    let newValue: any = value;

    if (name === "discount_percentage" && value.trim() === "") {
      newValue = null;
    } else if (type === "number") {
      newValue = value.trim() === "" ? null : Number(value);
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

    const requestData = {
      ...formData,
      packages: { package_id: package_id },
    };

    try {
      const response = await fetch("http://localhost:3000/package/price", {
        method: isLoad ? "PUT" : "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (response.ok) {
        setIsDirty(false); // Mark as clean after save
        alert("Fee details saved successfully!");
        router.push(`/teaching-page/package-page/${package_id}/course-message`);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSetFree = async () => {
    const isConfirmed = window.confirm("Are you sure you want to set the package to free?");
    if (!isConfirmed) return;

    try {
      const feeResponse = await fetch(`http://localhost:3000/package/${package_id}/price`);
      if (!feeResponse.ok) {
        alert("Failed to fetch fee details.");
        return;
      }

      const feeDetails = await feeResponse.json();

      if (feeDetails.isFree) {
        alert(feeDetails.message);
        router.push(`/teaching-page/package-page/${package_id}/course-message`);
        return;
      }

      if (!feeDetails.isFree) {
        const deleteResponse = await fetch(`http://localhost:3000/package/${package_id}/price`, {
          method: "DELETE",
        });

        if (deleteResponse.ok) {
          alert("Fee details deleted successfully!");
        } else {
          const errorData = await deleteResponse.json();
          alert("Error deleting fee details: " + errorData.message);
          return;
        }
      }

      router.push(`/teaching-page/package-page/${package_id}/course-message`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process the request.");
    }
  };

  return (
    <div className="component-container">
      <div className="flex justify-between items-center">
        <h2 className="title">Set a price for your course</h2>
        <button className="upload-button" onClick={handleSetFree}>
          Set Free
        </button>
      </div>
      <hr />
      <div className="content">
        <p className="description">
          Please set the  the price  for your course.You can make it free or paid. If you choose to make it paid, you can set a one-time fee or a recurring fee. You can also set a discount for the course.
        </p>
        <form onSubmit={handleSubmit} className="feeDetails-form">
          <>
            <p><strong>Total Fee</strong></p>
            <div className="input-wrap">
              <input
                placeholder="Enter total fee"
                type="number"
                name="total_fee"
                value={formData.total_fee ?? ''}
                onChange={handleChange}
                required
              />
            </div>
            {errors.total_fee && <p className="error-message">{errors.total_fee}</p>}
          </>

          <div className="form-group checkbox-group">
            <label htmlFor="is_recurring">
              <p><strong>Is Recurring</strong></p>
              <input
                type="checkbox"
                id="is_recurring"
                name="is_recurring"
                checked={formData.is_recurring}
                onChange={handleChange}
              />
            </label>
            <p>Allow student to pay monthly</p>
          </div>

          {formData.is_recurring && (
            <div className="flex gap-6">
              <div className="w-1/2">
                <label className="block text-xl font-semibold mb-1">First Payment</label>
                <input
                  type="number"
                  name="first_payment"
                  value={formData.first_payment}
                  onChange={handleChange}
                  className="input border border-gray-300 rounded-md p-2 w-full h-[45px]"
                  placeholder="Enter first payment"
                />
              </div>
              <div className="w-1/2">
                <label className=" block text-xl font-semibold mb-1">Recurring Amount</label>
                <input
                  type="number"
                  name="recurring_amount"
                  value={formData.recurring_amount || ""}
                  onChange={handleChange}
                  className=" input border border-gray-300 rounded-md p-2 w-full h-[45px]"
                  placeholder="Enter monthly amount"
                  required
                />
                {errors.recurring_amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.recurring_amount}</p>
                )}
              </div>
              <div className="w-1/2 ">
                <label className="block text-xl font-semibold mb-1">Number of Months</label>
                <input
                  type="number"
                  name="number_of_months"
                  value={formData.number_of_months || ""}
                  onChange={handleChange}
                  className="input border border-gray-300 rounded-md p-2 w-full h-[45px]"
                  placeholder="e.g. 6"
                  required
                />
                {errors.number_of_months && (
                  <p className="text-red-500 text-sm mt-1">{errors.number_of_months}</p>
                )}
              </div>
            </div>
          )}

          <div className="form-group checkbox-group">
            <label htmlFor="has_discount">
              <p><strong>Discount</strong></p>
              <input
                type="checkbox"
                id="has_discount"
                name="has_discount"
                checked={formData.has_discount}
                onChange={handleChange}
                className="w-5 h-5 accent-purple-600"
              />
            </label>
          </div>

          {formData.total_fee && formData.has_discount && (
            <>
              <div className="flex gap-6">
                <div className="w-1/3">
                  <label className="block text-xl font-semibold mb-1">Discount Type</label>
                  <select
                    name="discount_type"
                    id="discount_type"
                    value={formData.discount_type || ""}
                    onChange={handleChange}
                    className="input border border-gray-300 rounded-md p-2 w-full h-[45px]"
                  >
                    <option value="">--Select Type--</option>
                    <option value="amount">Amount</option>
                    <option value="percent">Percentage</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label
                    htmlFor="discount_value"
                    className="block font-semibold mb-1 text-xl text-gray-700"
                  >
                    {formData.discount_type === "percent"
                      ? "Discount Percentage"
                      : "Discount Amount"}
                  </label>
                  <input
                    type="number"
                    name="discount_value"
                    id="discount_value"
                    value={formData.discount_value ?? ""}
                    onChange={handleChange}
                    className={`input border border-gray-300 rounded-md p-2 w-full h-[45px] ${errors.discount_value
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-600"
                      }`}
                  />
                  {errors.discount_value && (
                    <p className="text-red-500 text-sm mt-1">{errors.discount_value}</p>
                  )}
                </div>
                <div className="w-1/3">
                  <label
                    htmlFor="duration"
                    className="block font-semibold mb-1 text-xl text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="duration"
                    id="duration"
                    value={formData.duration ?? ""}
                    onChange={handleChange}
                    className={`input border border-gray-300 rounded-md p-2 w-full h-[45px] ${errors.duration
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-600"
                      }`}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="form-group checkbox-group">
            <label htmlFor="allow_min_amount">
              <p><strong>Allow Student To Pay Min-Amount</strong></p>
              <input
                type="checkbox"
                name="allow_min_amount"
                checked={formData.allow_min_amount}
                onChange={handleChange}
                style={{ marginLeft: "1 rem" }}
              />
            </label>
          </div>

          {formData.allow_min_amount && (
            <div className="flex gap-6">
              <div className="w-1/3">
                <label htmlFor="min_amount" className="block text-xl font-semibold mb-1 text-gray-700 ">
                  Min Amount
                </label>
                <input
                  type="number"
                  name="min_amount"
                  id="min_amount"
                  placeholder="Enter min amount"
                  value={formData.min_amount || ""}
                  onChange={handleChange}
                  className=" input w-[450px] border border-gray-300 rounded-md p-2 h-[45px] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          )}
          <p><strong>Payment Methods</strong></p>
          <div className="flex gap-6">
            <div className="w-1/3">
              <input
                type="text"
                name="payment_methods"
                className=" input w-[450px] border border-gray-300 rounded-md p-2 h-[45px] focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="eg: PayPal, Google Pay"
                value={formData.payment_methods}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end items-center">
            <button className="save-button" type="submit">
              {isLoad ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeDetailsForm;
