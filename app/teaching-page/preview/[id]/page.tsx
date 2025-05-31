"use client";

import React, { useEffect, useState } from "react";
import Navbar from '@components/navbar/navbar';
import Footer from '@components/footer/footer'
import "./style.css";
import { useParams } from "next/navigation";
import PriceCard from './components/priceCard/packagePriceBox';
import Banner from './components/metaDataBanner/banner'

interface PackageData {
  title: string;
  created_at: string;
  updated_at: string;
  user: {
    user_id: number;
    name: string;
  };
  category: {
    cat_id: number;
    categoryName: string;
  };
  courseLandingPage: {
    title: string;
    subtitle:string;
    description: string;
    language: string;
    coverImage: string;
    videoFile: string;
    seats:number;
    
  };
  intendedLearners: {
    learningObjectives: string[];
    requirements: string[];
    audience: string[];
  }[];
}

export default function PackageOverviewPage() {
  const [data, setData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const params = useParams();
  const id = params?.id;
    const packageId = id ? Number(id) : null;

  useEffect(() => {
    async function fetchPackage() {
      if (!packageId) return;
      try {
        const res = await fetch(`http://localhost:3000/package/${packageId}/package`);
        const json = await res.json();
        console.log('Fetched package data:', json);
        setData(json);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [packageId]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!data) return <p style={{ textAlign: "center" }}>No Data Found</p>;

  return (
    <div className="main-container">
      

      <div className="overview-page-wrapper">

        <div className="left-section">
          <div className="left-dark-container">
            <div className="breadcrumb">
              <p>{data.category.categoryName}</p>
            </div>

            <h1 className="title">
              {data.courseLandingPage?.title || "No Title Available"}
            </h1>

            <h1 className="overview-subtitle">
               {data.courseLandingPage?.subtitle || "No Subtitle Available"}
              
              
            </h1>

            <p className="author">Created by {data.user.name}</p>

            <div className="infoLine">
              <span>Last updated {new Date(data.updated_at).toLocaleDateString()}</span>
              <span>🌐 {data.courseLandingPage.language}</span>
            </div>
          </div>
          <Banner />

<div className="padded-content">
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
  <div className="learning-objectives-box">
    <h2>What you'll learn</h2>
    <div className="learning-objectives-list">
      {data.intendedLearners?.[0]?.learningObjectives?.length > 0 ? (
        data.intendedLearners[0].learningObjectives.map((item, index) => (
          <p key={index} className="learning-objective">
            <span className="checkmark">🗸 </span>
            {item}
          </p>
        ))
      ) : (
        <p>No learning objectives available.</p>
      )}
    </div>
  </div>
</div>

{/* Requirements as plain bullet list */}
<div className="requirements-section">
  <h2 className="requirements-heading">Requirements</h2>
  {data.intendedLearners?.[0]?.requirements?.length > 0 ? (
    <ul className="requirements-list">
      {data.intendedLearners[0].requirements.map((req, index) => (
        <li key={index} className="requirement-item">
          {req}
        </li>
      ))}
    </ul>
  ) : (
    <p className="no-data-message">No requirements found.</p>
  )}
</div>

        <div className="description">
              <h2 className="description-heading">Course Description</h2>
              <div
                className={`description-content ${showFullDescription ? "expanded" : "clamped"}`}
                dangerouslySetInnerHTML={{
                  __html: data.courseLandingPage?.description || "<i>No description provided.</i>",
                }}
              />
              {data.courseLandingPage?.description && (
                <button
                  className="toggle-button"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Show Less" : "Show More..."}
                </button>
              )}
            </div>

            <div className="learners-section">
  <h2 className="learners-heading">Who this course is for:</h2>
  {data.intendedLearners?.[0]?.audience?.length > 0 ? (
    <ul className="learners-list">
      {data.intendedLearners[0].audience.map((req, index) => (
        <li key={index} className="learners-item">
          {req}
        </li>
      ))}
    </ul>
  ) : (
    <p className="no-data-message">No audience found.</p>
  )}
</div>



</div>






        </div>
      <div >
        <div className="right-section">
          <PriceCard />
        </div>
        </div>
      </div>
     
    </div>
  );
}

