"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from "@components/navbar/navbar";
import Footer from "@components/footer/footer";
import HoverCard from "./components/hoverCard/hoverCard";

import './style.css';

interface CourseData {
  package_id: number;
  title: string;
  is_free: boolean;
  updated_at: string;
  courseLandingPage: {
    title: string;
    subtitle: string;
    coverImage: string;
    language: string;
    level: string;
  };
  user: {
    name: string;
  };
  feeDetails: {
    total_fee: number;
    has_discount: boolean;
    discount_value: number;
    duration: string;
    discount_type: "amount" | "percentage" | string;
    payment_methods: string;
  } | null;
  category: {
    categoryName: string;
  };
  intendedLearners: {
    learningObjectives: string[];
  }[];
}

const DevelopmentCourses: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.cat_id;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://localhost:3000/package/packages/category/${id}`);
        const data = await res.json();
        const publishedCourses = data.filter((course: any) => course.status === 'published');
        setCourses(publishedCourses);

        if (publishedCourses.length > 0) {
          setCategoryName(publishedCourses[0].category.categoryName);
        }

      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [id]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMoreDetails = (packageId: number) => {
    router.push(`http://localhost:3001/packageOverview/${packageId}`);
  };

  return (
    <div className="courses-wrapper full-screen layout-container">
      <Navbar />
      <div className='content'>
        <h2 className='heading'>{categoryName ? `${categoryName} Courses` : 'Courses'}</h2>
        <p className='sub-head'> Choose courses of your choice</p>
        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <p>No packages found for this category.</p>
        ) : (
          <div className="scroll-container">
            <button className="scroll-btn left" onClick={() => scroll('left')}>&lt;</button>
            <div className="card-row" ref={scrollRef}>
              {courses.map((course, index) => {
                const position = index <= 1 ? 'right' : 'left'; // Show popup to right for first 2 cards
                return (
                  <div
                    className="course-card"
                    key={course.package_id}
                    onMouseEnter={() => setHoveredCard(course.package_id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ position: 'relative' }}
                  >
                    <div className="course-img">
                      <img src={course.courseLandingPage.coverImage} alt="Course Cover" />
                    </div>
                    <h4 className="course-title">{course.courseLandingPage.title}</h4>
                    <p className="instructor">{course.user.name}</p>
                    <p className="language">{course.courseLandingPage.language} | {course.courseLandingPage.level}</p>

                    <div className="card-price">
                      {course.is_free ? (
                        <span className="free-tag">Free</span>
                      ) : (
                        course.feeDetails && (
                          <>
                            <div className="price-wrapper">
                              {Number(course.feeDetails.discount_value) > 0 ? (
                                <>
                                  <span className="discounted-price">
                                    ₹
                                    {course.feeDetails.discount_type === "percent"
                                      ? Math.round(
                                        Number(course.feeDetails.total_fee) -
                                        (Number(course.feeDetails.total_fee) * Number(course.feeDetails.discount_value)) / 100
                                      )
                                      : Math.round(
                                        Number(course.feeDetails.total_fee) - Number(course.feeDetails.discount_value)
                                      )}
                                  </span>
                                  <span className="original-price">
                                    <s>₹{course.feeDetails.total_fee}</s>
                                  </span>
                                </>
                              ) : (
                                <span>₹{course.feeDetails.total_fee}</span>
                              )}
                            </div>
                            <div className="category-premium-tag">Premium</div>
                          </>
                        )
                      )}
                    </div>

                    <button
                      className="more-details-btn"
                      onClick={() => handleMoreDetails(course.package_id)}
                    >
                      More Details
                    </button>

                    {hoveredCard === course.package_id && (
                      <HoverCard
                        title={course.courseLandingPage.title}
                        position={position}
                        isFree={course.is_free}
                        subtitle={course.courseLandingPage.subtitle}
                        learnings={
                          course.intendedLearners?.flatMap(item => item.learningObjectives) || []
                        }
                      />

                    )}
                  </div>
                );
              })}
            </div>
            <button className="scroll-btn right" onClick={() => scroll('right')}>&gt;</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DevelopmentCourses;
