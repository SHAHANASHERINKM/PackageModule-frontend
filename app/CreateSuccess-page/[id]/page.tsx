"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './success-page.css';
import PreviewPanel from '@components/previewPanel/preview';
import dynamic from 'next/dynamic';
import ConfirmationModal from '@components/confirmationModal/confirmation';

const Editor = dynamic(() => import('@components/ckEditor/ckTextEditor'), { ssr: false });

function SuccessPage() {
  const [description, setDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false); // New state for forceUpdate
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isUpdate, setIsUpdate] = useState(false); // Track if update action is confirmed
  const params = useParams();
  const router = useRouter();
  const id = params?.packageId || params?.id || params?.packageid;

  console.log("Package ID:", id);

  // Helper function to fetch content for the given package ID
  const fetchExistingContent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/package/success-message/${id}`);
      
      // Check if the response is OK (status code 200-299)
      if (!res.ok) {
        throw new Error('Failed to fetch content');
      }
  
      // Read the response as text (HTML content)
      const data = await res.text(); // Get raw HTML response
  
      console.log("Fetched content:", data); // Log the raw HTML content
  
      // Check if the fetched HTML content is not empty (non-empty content means it exists)
      if (data && data.trim().length > 0) {
        setIsUpdate(true); // If content exists, show the confirmation modal
        setShowModal(true); // Show the confirmation modal
      } else {
        // If no content exists, proceed to save new content
        await saveContent();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch existing content.');
    }
  };
  

  // Helper function to save the new content
  const saveContent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/package/success-message/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: Number(id),
          pageContent: description,
          forceUpdate: false, // No force update when saving new content
        }),
      });
  
      // Check if the response is ok
      if (!res.ok) {
        throw new Error('Failed to save content');
      }
  
      // Parse the JSON response
      const data = await res.json();
  
      // Alert the user with the response message from the backend
      if (data && data.message) {
        alert(data.message);
      } else {
        throw new Error('Unexpected response format');
      }
  
      // Redirect to the package page
      router.push(`/packagePage/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    }
  };
  

  // Helper function to perform the content update
  const updateContent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/package/success-message/${id}`, {
        method: 'PUT', // PUT to update content
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: Number(id), // Ensure that the id is sent as a number
          pageContent: description, // HTML content that you want to save
        }),
      });
  
      const data = await res.json(); // Get the response data
  
      // Check if the response was successful
      if (res.ok) {
        alert('Content successfully updated');
      } else {
        alert(data.message || 'Error updating success page');
      }
  
      // Navigate to the package page after the update is successful
      router.push(`/packagePage/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update content.');
    }
  };
  
  

  const handleSave = async () => {
    if (!id) return alert("No package ID found in URL");
    if (!description) return alert("Please enter a success message");

    // First, fetch existing content for the given package ID
    await fetchExistingContent();
  };

  // Function to handle when user clicks "OK" on the modal
  const handleConfirmUpdate = async () => {
    setShowModal(false); // Close the modal
    await updateContent(); // Proceed to update the content
  };

  // Function to handle when user clicks "Cancel" on the modal
  const handleCancelUpdate = () => {
    setShowModal(false); // Close the modal
    alert('Update canceled'); // Alert the user that the update was canceled
  };

  return (
    <div className="main-container">
      <div className="title-container">
        <h2 className="title">Design Your Success Page Here</h2>
        <button className="preview-button" onClick={() => setShowPreview(true)}>
          Preview
        </button>
      </div>

      <div className="editor-container">
        <Editor value={description} onChange={setDescription} />
      </div>

      <div className="save-container">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>

      {showPreview && (
        <PreviewPanel content={description} onClose={() => setShowPreview(false)} />
      )}

      {/* Show Confirmation Modal if needed */}
      {showModal && (
        <ConfirmationModal
          message="Content already exists for this package. Do you want to update it?"
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
    </div>
  );
}

export default SuccessPage;
