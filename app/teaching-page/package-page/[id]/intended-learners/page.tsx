"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import './intended-learners.css';
import { useDirty } from "../DirtyContext"; // <-- Import the context

type Props = {
  setStepStatus?: (cb: (prev: any) => any) => void;
};

export default function IntendedLearners({ setStepStatus }: Props) {
  const [learningObjectives, setLearningObjectives] = useState(["", "", "", ""]);
  const [requirements, setRequirements] = useState([""]);
  const [audience, setAudience] = useState([""]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const params = useParams();
  const packageId = params?.id;
  const router = useRouter();

  const { isDirty, setIsDirty } = useDirty(); // <-- Use context

  useEffect(() => {
    const fetchIntendedLearners = async () => {
      if (!packageId) return;

      try {
        const response = await fetch(
          `http://localhost:3000/package/${packageId}/intended-learners`
        );

        if (!response.ok) {
          console.warn("No existing intended learners found");
          setIsDataLoaded(false);
          setIsDirty(false); // Mark as clean on initial load
          return;
        }

        const data = await response.json();
        if (data) {
          setLearningObjectives(
            data.learningObjectives.length ? data.learningObjectives : ["", "", "", ""]
          );
          setRequirements(data.requirements.length ? data.requirements : [""]);
          setAudience(data.audience.length ? data.audience : [""]);
          setIsDataLoaded(true);
          setIsDirty(false); // Mark as clean after data load
          setStepStatus?.((prev) => ({ ...prev, intended: true }));
        }
      } catch (error) {
        setIsDirty(false); // Mark as clean on error
        console.error("Failed to fetch intended learners:", error);
      }
    };

    fetchIntendedLearners();
  }, [packageId, setIsDirty, setStepStatus]);

  const addInput = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
    setIsDirty(true); // Mark as dirty on add
  };

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    setIsDirty(true); // Mark as dirty on change
  };

  const hasEmptyField = (arr: string[]) => arr.some((val) => val.trim() === "");

  // Validation: sentence must be at least 3 chars, non-empty, and NOT end with a comma
  const isValidSentence = (sentence: string) => {
    const trimmed = sentence.trim();
    if (trimmed.length < 3) return false;
    if (trimmed.endsWith(",")) return false; // prevent fragmented commas at end
    return true;
  };

  const allValidSentences = (arr: string[]) => arr.every(isValidSentence);

  const handleSave = async () => {
    if (
      hasEmptyField(learningObjectives) ||
      hasEmptyField(requirements) ||
      hasEmptyField(audience)
    ) {
      alert("Please fill in all fields before saving");
      return;
    }

    if (
      !allValidSentences(learningObjectives) ||
      !allValidSentences(requirements) ||
      !allValidSentences(audience)
    ) {
      alert(
        "Each input must be at least 3 characters and must not end with a comma"
      );
      return;
    }

    const formData = {
      learningObjectives,
      requirements,
      audience,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/package/${packageId}/intended-learners`,
        {
          method: isDataLoaded ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save data");
      }

      alert("Data saved successfully!");
      setIsDirty(false); // Mark as clean after save
      router.push(`/teaching-page/package-page/${packageId}/course-landing-page`);
      setStepStatus?.((prev) => ({ ...prev, intended: true }));
    } catch (error: any) {
      console.error("Error saving data:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="component-container">
      <div className="flex justify-between items-center">
        <h2>Intended learners</h2>
        <button className="upload-button" onClick={handleSave}>
          {isDataLoaded ? "Update" : "Save"}
        </button>
      </div>
      <hr />
      <div className="content">
        <p>
          The following descriptions will be publicly visible on your Course Landing Page and will
          have a direct impact on your course performance. These descriptions will help learners
          decide if your course is right for them.
        </p>

        <p><strong>What will students learn in your course?</strong></p>
        <p className="description">
          You must enter at least 4 learning objectives or outcomes that learners can expect to
          achieve after completing your course.
        </p>

        {learningObjectives.map((val, idx) => (
          <div key={idx} className="input-wrapper">
            <input
              type="text"
              value={val}
              onChange={(e) => handleChange(setLearningObjectives, idx, e.target.value)}
              maxLength={160}
              className="input-small"
              placeholder="Objectives"
              required
            />
          </div>
        ))}
        <button className="add-more" onClick={() => addInput(setLearningObjectives)}>
          + Add more to your response
        </button>

        <p><strong>What are the requirements or prerequisites for taking your course?</strong></p>
        <p className="description">
          List the required skills, experience, tools or equipment learners should have prior to
          taking your course. If there are no requirements, use this space as an opportunity to
          lower the barrier for beginners.
        </p>

        {requirements.map((val, idx) => (
          <div key={idx} className="input-wrapper">
            <input
              type="text"
              value={val}
              onChange={(e) => handleChange(setRequirements, idx, e.target.value)}
              maxLength={160}
              className="input-small"
              placeholder="eg: No programming experience needed. You will learn everything you need to know"
              required
            />
          </div>
        ))}
        <button className="add-more" onClick={() => addInput(setRequirements)}>
          + Add more to your response
        </button>

        <p><strong>Who is this course for?</strong></p>
        <p className="description">
          Write a clear description of the <a href="#">intended learners</a> for your course who
          will find your course content valuable. This will help you attract the right learners to
          your course.
        </p>

        {audience.map((val, idx) => (
          <div key={idx} className="input-wrapper">
            <input
              type="text"
              value={val}
              onChange={(e) => handleChange(setAudience, idx, e.target.value)}
              maxLength={160}
              className="input-small"
              placeholder="e.g. Beginners, Intermediate, Advanced"
              required
            />
          </div>
        ))}
        <button className="add-more" onClick={() => addInput(setAudience)}>
          + Add more to your response
        </button>
      </div>
    </div>
  );
}
