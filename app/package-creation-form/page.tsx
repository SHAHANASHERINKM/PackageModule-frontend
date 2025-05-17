"use client";

import { useEffect, useState } from "react";
import "./packageForm.css";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const TextEditor = dynamic(() => import("./ckTextEditor"), { ssr: false });


const PackageForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "course",
    is_free: false,
    language: "English",
    cover_image: null as File | null,
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
    no_of_seats:"",
    cat_id: "",
  });

 
  

  const [description, setDescription] = useState("");
  //const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };
/*
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, cover_image: file }));

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
*/
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const formDataToSend = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formDataToSend.append(key, String(value));
    }
    // If empty string "", undefined, or null, skip it
  });

  formDataToSend.delete("description"); // avoid duplicate
  formDataToSend.set("description", description);

  try {
    const response = await fetch("http://localhost:3000/package/packages", {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();
    console.log("Response:", result);

    if (response.ok) {
      alert("Package Created Successfully!");
      const packageId = result.package_id;
      if (!formData.is_free) {
        router.push(`/fee-details/${packageId}`);
      } else {
        router.push(`/promo-page/${packageId}`);
      }
    } else {
      alert("Error creating package: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while creating the package.");
  }
};




  useEffect(() => {
    console.log("Description content:", description);
  }, [description]);
  

  return (
    
    <div style={{ display: "flex", gap: "2rem" }}>
      
      
      <form onSubmit={handleSubmit} className="package-form">
      <h2 className="form-title">Package Creation Form</h2>
      
      <p className="required-note">
      Fill the form below to create your package..❗Required fields are marked with an asterisk (*).
     </p>
        <label>Package Name:<span style={{color:"red"}}>*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Description:<span style={{color:"red"}}>*</span></label>
       
       
        <TextEditor value={description} onChange={setDescription} />

        <label>Type:<span style={{color:"red"}}>*</span></label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="course">Course</option>
          <option value="project">Project</option>
          <option value="practice test">Practice Test</option>
        </select>
        <label>Category:<span style={{ color: "red" }}>*</span></label>
<select
  name="cat_id"
  value={formData.cat_id}
  onChange={handleChange}
  required
>
  <option value="">-- Select Category --</option>
  <option value="1">Development</option>
  <option value="2">Business</option>
  <option value="3">Finance & Accounting</option>
  <option value="4">Personal Development</option>
  <option value="5">IT & Software</option>
  <option value="6">Office Productivity</option>
  <option value="7">Design</option>
  <option value="8">Marketing</option>
  <option value="9">Health & Fitness</option>
  <option value="10">Music</option>
</select>



        <div className="checkbox-container">
        <label>Is Free:</label>
        <input
        className="checkbox"
          type="checkbox"
          name="is_free"
          checked={formData.is_free}
          onChange={handleChange}
        />
        </div>

        <label>Language:</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
        >
          <option value="English">English</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Hindi">Hindi</option>
        </select>

        <label>Target Audience:</label>
        <select
          name="target_audience"
          value={formData.target_audience}
          onChange={handleChange}
          required
        >
          <option value="beginners">Beginners</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced Learners</option>
        </select>

        <label style={{ color: "red" }}>Instructor ID:</label>
        <input
          type="number"
          name="instructor_id"
          value={formData.instructor_id}
          onChange={handleChange}
        />
       <div className="checkbox-container">
        <label>Has Subtitles:</label>
        <input
        className="checkbox"
          type="checkbox"
          name="has_subtitles"
          checked={formData.has_subtitles}
          onChange={handleChange}
        />
        </div>

        <label>Duration (month):<span style={{color:"red"}}>*</span></label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="1"
        />

        <label>Completion Benefit:</label>
        <textarea
          name="completion_benefit"
          value={formData.completion_benefit}
          onChange={handleChange}
        />

        <label>Prerequisites:</label>
        <textarea
          name="prerequisites"
          value={formData.prerequisites}
          onChange={handleChange}
        />

        
        <label>Skills Gained:</label>
        <textarea
          name="skills_gained"
          value={formData.skills_gained}
          onChange={handleChange}
        />
        <label>Number of seats:</label>
        <input
          type="number"
          name="no_of_seats"
          value={formData.no_of_seats}
          onChange={handleChange}
        />

<div className="form-buttons">
  <div className="preview-line">
    <p className="preview-description">
      You can preview your package before submitting.
    </p>
    <button
      type="button"
      onClick={() => setShowPreview(true)}
      className="preview-btn"
    >
      Preview
    </button>
  </div>

  <button type="submit" className="submit-btn">
    Create Package
  </button>
</div>

      </form>

      {/* Preview Card */}
      
      {showPreview && (
         
        <div className="preview-card">
          <button className="close-btn" onClick={() => setShowPreview(false)}>
            &times;
          </button>
          <div className="preview-inner">
            
          <img
            src={ "/default-coverpage.jpg"}
            alt="cover"
            className="card-image"
          />
           
          <div className="card-content">
            <h3>{formData.name}</h3>
            <p>
              <strong>Instructor:</strong> instructor{formData.instructor_id}
            </p>
            <div className="card-description">
                <strong>Description:</strong>
                <div
                  className="card-html"  // 👈 Add this class
                  dangerouslySetInnerHTML={{ __html: description }}
                  style={{ marginTop: "0.5rem" }}
                />
          </div>

            <p>
              <strong>Fee:</strong> Your fee appears here  </p>
           
            
            <button className="more-btn">More Details</button>
            </div>
          </div>
        </div>
      
      )}
    </div>
  );
};

export default PackageForm;
