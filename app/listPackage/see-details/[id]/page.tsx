'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './see-details.css'; // Import the CSS file

interface Package {
  package_id: number;
  name: string;
  description: string;
  type: string;
  is_free: boolean;
  language: string;
  cover_image: string;
  target_audience: string;
  duration: number;
  completion_benefit: string;
  prerequisites: string;
  skills_gained: string;
  thumbnailUrl: string;
  promoVideoUrl: string;
  no_of_seats: number;
}

const PackageDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        console.log('Fetching for package_id:', id);
        const res = await fetch(`http://localhost:3000/package/package/${id}`);
        const data = await res.json();
        setPkg(data.package);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching package:', err);
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  if (loading) return <div>Loading package details...</div>;
  if (!pkg) return <div>Package not found.</div>;

  return (
    <div className="package-details-container">
      <h1 className="package-title">{pkg.name}</h1>
      <div className="content-wrapper">
        {/* Left Section */}
        <div className="left-section">
          {/* Details Section */}
          <div className="details-section">
            <h2 className="section-heading">Package Overview</h2>
            <p className="description-row">
              <strong>Description:</strong>
              
            </p>
            <div
                className="description-html"
                dangerouslySetInnerHTML={{ __html: pkg.description }}
              />
            <p>
              <strong>Type:</strong> {pkg.type}
            </p>
            <p>
              <strong>Language:</strong> {pkg.language}
            </p>
            <p>
              <strong>Duration:</strong> {pkg.duration} hours
            </p>
            <p>
              <strong>Target Audience:</strong> {pkg.target_audience}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* Benefits Section */}
          <div className="benefits-section">
            <h2 className="section-heading">Benefits & Requirements</h2>
            <p>
              <strong>Completion Benefit:</strong> {pkg.completion_benefit}
            </p>
            <p>
              <strong>Prerequisites:</strong> {pkg.prerequisites}
            </p>
            <p>
              <strong>Skills Gained:</strong> {pkg.skills_gained}
            </p>
          </div>

          {/* Additional Info Section */}
          <div className="additional-info-section">
            <h2 className="section-heading">Additional Information</h2>
            <p>
              <strong>Free:</strong> {pkg.is_free ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Available Seats:</strong> {pkg.no_of_seats}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
