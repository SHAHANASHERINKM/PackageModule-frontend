"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './style.css';  // Custom styles
import Navbar from '@components/navbar/navbar'
import ShareButton from '@components/shareButton/shareButton';
import { FaEdit, FaTrash, FaShareAlt, FaUpload } from 'react-icons/fa';
import Footer from '@components/footer/footer'


interface Package {
  package_id: number;
  title: string;
  description: string;
  is_free: boolean;
  status: string;
  complete_status: string;
  courseLandingPage: {
    title: string;
    description: string;
  }
}

const YourCourses = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const { userId: paramUserId } = useParams();  // Get userId from URL params
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');


    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.user_id) {
        setUserId(parsedUser.user_id);
      }
    }

    if (paramUserId || userId) {
      const fetchPackages = async () => {
        try {
          const res = await fetch(`http://localhost:3000/package/packages/${paramUserId || userId}`);
          const result = await res.json();

          if (result.success && Array.isArray(result.data)) {
            setPackages(result.data);
            const hasIncomplete = result.data.some((pkg: any) => pkg.complete_status === 'incomplete');
            setShowBanner(hasIncomplete);
          } else if (!result.success && result.message?.includes('does not exist')) {
            // Only handle user-not-found case with alert + redirect
            alert(result.message);
            router.push('/');
          } else {
            // User exists but has no packages — don't alert
            setPackages([]);
          }

          console.log("Fetched result:", result);
        } catch (err) {
          console.error("Error fetching packages:", err);
          alert("Something went wrong while fetching packages.");

        }
      };

      fetchPackages();
    }
  }, [userId, paramUserId]);


  const handleEdit = (packageId: number) => {
    router.push(`/teaching-page/package-page/${packageId}`);
  };

  const handleDelete = async (packageId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this course?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:3000/package/${packageId}`, { method: "DELETE" });
      setPackages(packages.filter((pkg) => pkg.package_id !== packageId));  // Remove the deleted course from state
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

const handlePublish = async (packageId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/package/${packageId}/publish`, {
      method: 'PATCH',
    });

    const data = await response.json();

    if (!response.ok) {
      // Show user-facing alert
      alert(data.message || 'Failed to publish the package');
      return; // ⚠️ Don't throw error anymore — avoids console error
    }

    alert('Package published successfully');

    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.package_id === packageId
          ? { ...pkg, status: 'published' }
          : pkg
      )
    );
  } catch (error) {
    // Only log network-level or unexpected errors
    console.error('Unexpected error occurred while publishing:', error);
    alert('Something went wrong while publishing the package');
  }
};





  const handleMoreDetails = (packageId: number) => {
    router.push(`/packageOverview/${packageId}`);  // Navigate to course details page
  };

  return (
    <div className="your-courses-container">
      <Navbar />
      {showBanner && (
        <div className="banner">
          <span>You have unfinished work. Please complete it.</span>
          <button className="close-banner" onClick={() => setShowBanner(false)}>×</button>
        </div>
      )}

      <div className="list-content">
        <h2 className='title'>Your Courses</h2>

        {packages.length === 0 ? (
          <div className="no-courses">
            <p>No courses yet.</p>
            <button className="start-teaching-btn" onClick={() => router.push('/teaching-page/start-page')}>
              Start Teaching Now
            </button>
          </div>
        ) : (
          <div className="courses-list">
            {packages.map((pkg) => (
              <div key={pkg.package_id} className="course-card">
                {/* Status Tag */}
                <div className={`status-tag ${pkg.status === 'published' ? 'published' : 'unpublished'}`}>
                  {pkg.status === 'published' ? 'Published' : 'Unpublished'}

                </div>

                {pkg.complete_status === 'incomplete' && (
                  <span className="incomplete-tag">Incomplete</span>
                )}

                <div className="course-details">
                  <h3 className="course-title">
                    {pkg.courseLandingPage?.title || pkg.title || 'Untitled Course'}
                  </h3>

                  <div
                    className="course-description"
                    dangerouslySetInnerHTML={{
                      __html: pkg.courseLandingPage?.description || pkg.description || '<i>No description provided</i>',
                    }}
                  />

                </div>

                <div className="card-footer">
                  <button className="more-details-btn" onClick={() => handleMoreDetails(pkg.package_id)}>
                    More Details
                  </button>

                  <div className="icon-buttons">
                    {/* Edit */}
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(pkg.package_id)} title="Edit">
                      <FaEdit />
                    </button>

                    {/* Delete */}
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(pkg.package_id)} title="Delete">
                      <FaTrash />
                    </button>
                    <ShareButton packageId={pkg.package_id} />

                    {pkg.status !== 'published' && (
                      <div className="publish-section">
                        <button className="publish-btn" onClick={() => handlePublish(pkg.package_id)}>
                          Publish
                        </button>


                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );


};

export default YourCourses;
