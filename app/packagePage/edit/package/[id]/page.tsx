"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import "./editPackage.css";

const TextEditor = dynamic(() => import("./ckTextEditor"), { ssr: false });

const EditPackageForm = () => {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    type: "course",
    is_free: false,
    language: "English",
    target_audience: "beginners",
    instructor_id: "",
    has_subtitles: false,
    duration: "",
    completion_benefit: "",
    prerequisites: "",
    is_published: false,
    requires_unlock: false,
    skills_gained: "",
    description: "",
    no_of_seats: "",
  });
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/package/${id}`);
        const data = await res.json();

        if (res.ok && data.package) {
          setFormData({
            name: data.package.name || "",
            type: data.package.type || "course",
            is_free: !!data.package.is_free,
            language: data.package.language || "English",
            target_audience: data.package.target_audience || "beginners",
            instructor_id: data.package.instructor_id?.toString() || "",
            has_subtitles: !!data.package.has_subtitles,
            duration: data.package.duration?.toString() || "",
            completion_benefit: data.package.completion_benefit || "",
            prerequisites: data.package.prerequisites || "",
            is_published: !!data.package.is_published,
            requires_unlock: !!data.package.requires_unlock,
            skills_gained: data.package.skills_gained || "",
            description: data.package.description || "",
            no_of_seats: data.package.no_of_seats?.toString() || "",
          });

          setDescription(data.package.description || "");
        } else {
          alert("Failed to load package data.");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
      }
    };

    if (id) {
      fetchPackageData();
    }
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target as HTMLInputElement;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      ...formData,
      instructor_id: parseInt(formData.instructor_id),
      duration: parseInt(formData.duration),
      no_of_seats: parseInt(formData.no_of_seats),
      description: description,
    };
    

    try {
      const response = await fetch(`http://localhost:3000/package/package/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Package Updated Successfully!");
        if (from === "listPackage") {
          router.push(`/listPackage`);
        } else {
          router.push(`/packagePage/${id}`);
        }
      } else {
        console.error("Server error response:", result);
        alert("Error updating package: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while updating the package.");
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <form onSubmit={handleSubmit} className="package-form">
        <h2 className="form-title">Edit Package</h2>

        <p className="required-note">Update the fields and submit changes.</p>

        <label>Package Name:<span style={{ color: "red" }}>*</span></label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description:<span style={{ color: "red" }}>*</span></label>
        <TextEditor value={description} onChange={setDescription} />

        <label>Type:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="course">Course</option>
          <option value="project">Project</option>
          <option value="practice test">Practice Test</option>
        </select>

        <div className="checkbox-container">
          <label>Is Free:</label>
          <input type="checkbox" name="is_free" checked={formData.is_free} onChange={handleChange} />
        </div>

        <label>Language:</label>
        <select name="language" value={formData.language} onChange={handleChange}>
          <option value="English">English</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Hindi">Hindi</option>
        </select>

        <label>Target Audience:</label>
        <select name="target_audience" value={formData.target_audience} onChange={handleChange}>
          <option value="beginners">Beginners</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced Learners</option>
        </select>

        <label>Instructor ID:</label>
        <input type="number" name="instructor_id" value={formData.instructor_id} onChange={handleChange} />

        <div className="checkbox-container">
          <label>Has Subtitles:</label>
          <input type="checkbox" name="has_subtitles" checked={formData.has_subtitles} onChange={handleChange} />
        </div>

        <label>Duration (month):</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" />

        <label>Completion Benefit:</label>
        <textarea name="completion_benefit" value={formData.completion_benefit} onChange={handleChange} />

        <label>Prerequisites:</label>
        <textarea name="prerequisites" value={formData.prerequisites} onChange={handleChange} />

        <label>Skills Gained:</label>
        <textarea name="skills_gained" value={formData.skills_gained} onChange={handleChange} />

        <label>Number of Seats:</label>
        <input type="number" name="no_of_seats" value={formData.no_of_seats} onChange={handleChange} />

        <button type="submit" className="submit-btn">Update Package</button>
      </form>

      {showPreview && (
        <div className="preview-card">
          <button className="close-btn" onClick={() => setShowPreview(false)}>&times;</button>
          <div className="preview-inner">
            <img src={"/default-coverpage.jpg"} alt="cover" className="card-image" />
            <div className="card-content">
              <h3>{formData.name}</h3>
              <p><strong>Instructor:</strong> instructor{formData.instructor_id}</p>
              <div className="card-description">
                <strong>Description:</strong>
                <div className="card-html" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
              <p><strong>Fee:</strong> Your fee appears here</p>
              <button className="more-btn">More Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPackageForm;
