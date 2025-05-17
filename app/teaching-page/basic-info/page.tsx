"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './basic-info.css';
import Link from 'next/link';
import Navbar from '@components/navbar/navbar';

const categoryOptions = [
  { id: '1', name: 'Development' },
  { id: '2', name: 'Business' },
  { id: '3', name: 'Finance & Accounting' },
  { id: '4', name: 'Personal Development' },
  { id: '5', name: 'IT & Software' },
  { id: '6', name: 'Office Productivity' },
  { id: '7', name: 'Design' },
  { id: '8', name: 'Marketing' },
  { id: '9', name: 'Health & Fitness' },
  { id: '10', name: 'Music' },
];

const BasicInfoPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(2);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  const handleCreatePackage = async () => {
    const userSession = sessionStorage.getItem('user');
    const user = userSession ? JSON.parse(userSession) : null;

    if (!title.trim() || !categoryId) {
      alert('Please fill in both title and category.');
      return;
    }

    if (!user || !user.user_id) {
      alert('User not found in session.');
      return;
    }

    const category = categoryOptions.find(cat => cat.id === categoryId);

    const payload = {
      title,
      categoryId: parseInt(categoryId),
      categoryName: category?.name,
      userId: user.user_id,
    };

    try {
      const response = await fetch('http://localhost:3000/package/basic-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create package');

      const data = await response.json();
      console.log('Package created:', data);
    const id=data.packageId;
    console.log(id)
      router.push(`/teaching-page/package-page/${id}`); // update as needed
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 2:
        return (
          <div className="step-container">
            <h2 className="step-heading">How about a working title?</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="step-input"
            />
          </div>
        );
      case 3:
        return (
          <div className="step-container">
            <h2 className="step-heading">What category best fits the knowledge you'll share?</h2>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="step-select"
            >
              <option value="">-- Select Category --</option>
              {categoryOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return <div className="step-complete">Basic Info Complete!</div>;
    }
  };

  const renderButtons = () => {
    if (step === 2) {
      return (
        <div className="buttons-container justify-end">
          <button onClick={() => setStep(step + 1)} className="step-button continue-button">Continue</button>
        </div>
      );
    } else if (step === 3) {
      return (
        <div className="buttons-container justify-between">
          <button onClick={() => setStep(step - 1)} className="step-button previous-button">Previous</button>
          <button onClick={handleCreatePackage} className="step-button continue-button">Create Package</button>
        </div>
      );
    } else {
      return (
        <div className="buttons-container">
          <button onClick={() => router.push('/teaching-page/start-page')} className="step-button back-button">
            Go Back to Start
          </button>
        </div>
      );
    }
  };

  return (
    <div className="main-container">
      <Navbar />
      <Link href="/teaching-page/start-page" className="exit-link">Exit</Link>
      {renderStepContent()}
      {renderButtons()}
    </div>
  );
};

export default BasicInfoPage;
