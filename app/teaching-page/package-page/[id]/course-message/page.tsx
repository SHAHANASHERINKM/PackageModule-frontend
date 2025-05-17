"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './style.css';
import PreviewPanel from '@components/previewPanel/preview';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@components/ckEditor/ckTextEditor'), { ssr: false });

function SuccessPage() {
  const [description, setDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); // Track if content already exists
  const [userId, setUserId] = useState<number | null>(null); // Store userId for future use

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  console.log("Package ID:", id);

  // Fetch existing content on mount
  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.user_id) {
        setUserId(Number(parsedUser.user_id));
      }
    }
   

      try {
  const res = await fetch(`http://localhost:3000/package/${id}/success-message`);
  if (!res.ok) return;

  const text = await res.text();
  if (!text) return;

  const data = JSON.parse(text);
  console.log(data);

  if (data?.pageContent?.trim().length > 0) {
    setDescription(data.pageContent);
    setIsUpdate(true);
  }
} catch (err) {
  console.error("Failed to load existing content:", err);
}

    };

    loadContent();
  }, [id]);

  const saveContent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/package/${id}/success-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: Number(id),
          pageContent: description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Content saved successfully!');
        router.push(`/teaching-page/package-page/${params.id}/intended-learners`);
      } else {
        alert(data.message || 'Failed to save.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    }
  };

  const updateContent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/package/${id}/success-message`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: Number(id),
          pageContent: description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Content updated successfully!');
        router.push(`/teaching-page/package-page/${params.id}/intended-learners`);
      } else {
        alert(data.message || 'Error updating success page');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update.');
    }
  };

  const handleSave = async () => {
    if (!id) return alert("No package ID found in URL");
    if (!description) return alert("Please enter a success message");

    if (isUpdate) {
      await updateContent();
    } else {
      await saveContent();
    }
  };

  return (
    <div className="component-container">
      <div className="flex justify-between items-center">
        <h2 className="title">Design Your Success Page Here</h2>
        <button className="preview-button" onClick={() => setShowPreview(true)}>
          Preview
        </button>
      </div>
      <hr />

      <div className="content">
        <p>
          Write messages to your students who join your course to encourage them to engage with the course content.
          Make it attractive!
        </p>
        <Editor value={description} onChange={setDescription} />
      </div>

      <div className="save-container">
        <button className="save-button" onClick={handleSave}>
          {isUpdate ? "Update" : "Save"}
        </button>
      </div>

      {showPreview && (
        <PreviewPanel content={description} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

export default SuccessPage;
