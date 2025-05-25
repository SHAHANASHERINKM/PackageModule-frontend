"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './style.css';
import PreviewPanel from '@components/previewPanel/preview';
import dynamic from 'next/dynamic';
import { useDirty } from "../DirtyContext";

const Editor = dynamic(() => import('@components/ckEditor/ckTextEditor'), { ssr: false });

function SuccessPage() {
  const [description, setDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { isDirty, setIsDirty } = useDirty();

  // This ref will help us ignore the first editor change after loading data
  const justLoaded = useRef(false);

  // Load existing message on mount
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
        if (!res.ok) {
          setIsDirty(false);
          return;
        }

        const text = await res.text();
        if (!text) {
          setIsDirty(false);
          return;
        }

        const data = JSON.parse(text);

        if (data?.pageContent?.trim().length > 0) {
          setDescription(data.pageContent);
          setIsUpdate(true);
        }
        setIsDirty(false);
        justLoaded.current = true; // Set flag after loading data
      } catch (err) {
        setIsDirty(false);
        console.error("Failed to load existing content:", err);
      }
    };

    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setIsDirty]);

  // Mark as dirty on user edit, but ignore the first change after load
  const handleEditorChange = (val: string) => {
    setDescription(val);
    if (justLoaded.current) {
      justLoaded.current = false;
      return; // Ignore the first change event after loading data
    }
    setIsDirty(true);
  };

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
        setIsDirty(false);
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
        setIsDirty(false);
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
        <Editor value={description} onChange={handleEditorChange} />
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
