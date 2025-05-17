"use client"; 
import React, { useEffect, useRef, useState } from 'react';
import './main-page.css';
import { FaCode, FaBriefcase, FaDollarSign, FaLaptopCode, FaChartBar, FaLightbulb, FaPalette, FaBullhorn, FaHeartbeat, FaMusic, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons
import Footer from '@components/footer/footer'; // Import the Footer component
import Navbar from '@components/navbar/navbar'; // Import the Navbar component

function mainPage() {
  const [username, setUsername] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || 'User'); // Use user.name if available, otherwise 'User'
      } catch (error) {
        console.error('Error parsing user from sessionStorage:', error);
        setUsername('User'); // Default to 'User' in case of an error
      }
    } else {
      setUsername('User'); // Default to 'User' if no user in sessionStorage
    }
  }, []);
  const categories = [
    { name: 'Development', icon: FaCode, color: '#fc7703', link: '/development' },
    { name: 'Business', icon: FaBriefcase, color: '#8E44AD', link: '/business' },
    { name: 'Finance & Accounting', icon: FaDollarSign, color: '#e0cb07', link: '/finance' },
    { name: 'IT & Software', icon: FaLaptopCode, color: '#F39C12', link: '/it' },
    { name: 'Office Productivity', icon: FaChartBar, color: '#C0392B', link: '/office' },
    { name: 'Personal Development', icon: FaLightbulb, color: '#f7f028', link: '/personal' },
    { name: 'Design', icon: FaPalette, color: '#D35400', link: '/design' },
    { name: 'Marketing', icon: FaBullhorn, color: '#34495E', link: '/marketing' },
    { name: 'Health & Fitness', icon: FaHeartbeat, color: '#E74C3C', link: '/health' },
    { name: 'Music', icon: FaMusic, color: '#9B59B6', link: '/music' },
  ];

  const scrollLeft = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.scrollLeft -= width;
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.scrollLeft += width;
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };
  return (
    <>
    <Navbar/>
    <div style={{ backgroundColor: 'white' }}>
      <hr style={{ border: '1px solid #eee' }} />
      <div className="categories-container">
        <a href="#" className="category-link">Development</a>
        <a href="#" className="category-link">Business</a>
        <a href="#" className="category-link">Finance & Accounting</a>
        <a href="#" className="category-link">IT & Software</a>
        <a href="#" className="category-link">Office Productivity</a>
        <a href="#" className="category-link">Personal Development</a>
        <a href="#" className="category-link">Design</a>
        <a href="#" className="category-link">Marketing</a>
        <a href="#" className="category-link">Health & Fitness</a>
        <a href="#" className="category-link">Music</a>
      </div>
      <div className="background-image">
        <div className="welcome-text">Welcome Back, {username}</div>
        <div className='description-text'>Explore a world of knowledge and endless possibilities.</div>
      </div>

      <div className="card-container">
        <h2>Let's Start Learning From Top Categories</h2>
        <div className="card-scroll-container">
          <button className="scroll-button left" onClick={scrollLeft}><FaChevronLeft /></button>
          <div className="card-list" ref={containerRef}>
            {categories.map((category) => (
             <a href={category.link} key={category.name} className="card-link">
             <div className="card">
               <category.icon style={{ color: category.color }} size={55} className="card-icon" />
               <h3>{category.name}</h3>
             </div>
           </a>
            ))}
          </div>
          <button className="scroll-button right" onClick={scrollRight}><FaChevronRight /></button>
        </div>
      </div>
      <Footer />
     
    </div>
    </>
  );
}

export default mainPage;