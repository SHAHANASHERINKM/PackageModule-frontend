import React, { useEffect, useState } from "react";
import "./banner.css";
import { useParams } from "next/navigation";

interface PackageData {
  is_free: boolean;
}

const BannerComponent = () => {
  const params = useParams();
  const packageId = params?.packageId;

  const [data, setData] = useState<PackageData | null>(null);
  const [learnersCount, setLearnersCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackage() {
      if (!packageId) return;
      try {
        const res = await fetch(`http://localhost:3000/package/${packageId}/package`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchLearnersCount() {
      if (!packageId) return;
      try {
        const res = await fetch(`http://localhost:3000/package/${packageId}/learners-count`);
        const json = await res.json();
        setLearnersCount(json.count);
      } catch (err) {
        console.error(err);
      }
    }

    setLoading(true);
    fetchPackage();
    fetchLearnersCount();
    setLoading(false);
  }, [packageId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="banner-wrapper">
      <div className="premium-tag">
        <span className="premium-text">{data?.is_free ? "Free" : "Premium"}</span>
      </div>

      <div className="banner-description">
        Access this top-rated course, Get skills that accelerate your career.
      </div>

      <div className="learners-count">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="learners-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          height="24"
          width="24"
        >
          <path d="M17 21v-2a4 4 0 00-3-3.87" />
          <path d="M9 7a4 4 0 110 8" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="learners-number">{learnersCount ?? "0"}</span>
        <span className="learners-text">learners</span>
      </div>
    </div>
  );
};

export default BannerComponent;
