"use client"
import React from 'react';
import './start-page.css'; // Import CSS for styling
import Footer from '@components/footer/footer'; // Import the Footer component
import { useRouter } from 'next/navigation';
import Navbar from '@components/navbar/navbar'; // Import the Navbar component


function Page() {
  const router = useRouter(); // Initialize the router for navigation 
  const handleGetStartedClick = () => {
    router.push('/teaching-page/basic-info'); // Navigate to basic-info page
  };
  return (
    <>
    <Navbar />
  
      <div className="start-page">
        <h1 className="welcome-text">Come teach with us</h1>
        <p className='p-caption'>Become an instructor and change lives — including your own</p>
        <button className="get-started-button"  onClick={handleGetStartedClick}>Get Started</button>
      </div>
      <Footer /> {/* Render the Footer component */}
    </>
  );
}

export default Page;