import React from "react";
import "./published-cards.css";
interface FilterProps {
  filters: {
    price: string;
    language: string;
    courseType: string;
    level: string;
  };
  setFilters: (filters: FilterProps["filters"]) => void;
}

const CourseFilters: React.FC<FilterProps> = ({ filters, setFilters }) => {
  // Options for each filter group
  const priceOptions = [
    { label: "All", value: "" },
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
  ];

  const languageOptions = [
    { label: "All Languages", value: "" },
    { label: "English", value: "english" },
    { label: "Hindi", value: "hindi" },
    { label: "Tamil", value: "tamil" },
    // Add more languages as needed
  ];

  const courseTypeOptions = [
    { label: "All Types", value: "" },
    { label: "Video", value: "video" },
    { label: "Live", value: "live" },
    { label: "Recorded", value: "recorded" },
  ];

  const levelOptions = [
    { label: "All Levels", value: "" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  // Handler for clicking an option
  const handleOptionClick = (group: keyof FilterProps["filters"], value: string) => {
    setFilters({ ...filters, [group]: value });
  };

  // Render a group of options
  const renderFilterGroup = (
    title: string,
    groupName: keyof FilterProps["filters"],
    options: { label: string; value: string }[]
  ) => {
    return (
      <div className="filter-section">
        <h3 className="filter-section__title">{title}</h3>
        <ul className="filter-list">
          {options.map((option) => (
            <li
              key={option.value}
              className={`filter-list__item ${
                filters[groupName] === option.value ? "active" : ""
              }`}
              onClick={() => handleOptionClick(groupName, option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="filter-panel">
      <h2 className="filter-panel__title">Filter Courses</h2>
      {renderFilterGroup("Price", "price", priceOptions)}
      {renderFilterGroup("Language", "language", languageOptions)}
      {renderFilterGroup("Course Type", "courseType", courseTypeOptions)}
      {renderFilterGroup("Level", "level", levelOptions)}
    </div>
  );
};

export default CourseFilters;
