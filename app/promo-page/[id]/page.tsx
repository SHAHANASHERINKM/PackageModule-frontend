'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './promo-page.css';

const PackageMediaPage = () => {
  const params = useParams();
  const id = params?.id;

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [promoVideo, setPromoVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router=useRouter();

  // Validate file type (without file size limit)
  const validateFile = (file: File, type: string): boolean => {
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (png, jpg, etc.).');
      return false;
    }

    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please upload a valid video file (mp4, avi, etc.).');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = (mediaUrls: {
    coverImage: string | null;
    thumbnail: string | null;
    promoVideo: string | null;
  }) => {
    console.log('Saved media:', mediaUrls);
    alert('Package media updated successfully!');
    router.push(`/CreateSuccess-page/${id}`);
  };

  const handleSkip = () => {
    console.log('Skipped');
    alert('Package media skipped successfully!');
    router.push(`/CreateSuccess-page/${id}`);
  };

  const handleSubmit = async () => {
    if (!id) {
      alert('Package ID is missing!');
      return;
    }

    if (!coverImage && !thumbnail && !promoVideo) {
      alert('Please select at least one media file to upload.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (coverImage && validateFile(coverImage, 'image')) formData.append('coverImage', coverImage);
    if (thumbnail && validateFile(thumbnail, 'image')) formData.append('thumbnail', thumbnail);
    if (promoVideo && validateFile(promoVideo, 'video')) formData.append('promoVideo', promoVideo);

    if (!formData.has('coverImage') && !formData.has('thumbnail') && !formData.has('promoVideo')) {
      setLoading(false);
      return; // Stop submission if no valid files
    }

    try {
      const res = await fetch(`http://localhost:3000/package/${id}/media`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to update package media');
      }

      const { data } = await res.json();

      console.log('Response data:', data);

      handleSave({
        coverImage: data.coverImage || null,
        thumbnail: data.thumbnail || null,
        promoVideo: data.promoVideo || null,
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the package.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = (fileType: string) => {
    if (fileType === 'coverImage') setCoverImage(null);
    if (fileType === 'thumbnail') setThumbnail(null);
    if (fileType === 'promoVideo') setPromoVideo(null);
  };

  return (
    <div className="media-form-container">

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="form-intro">
  <h2>📦 Add Package Media</h2>
  <p>
    Upload eye-catching visuals and promotional content to make your package stand out.
    Add a <strong>cover image</strong>, <strong>thumbnail</strong>, and an optional
    <strong>promo video</strong> to attract more attention.
  </p>
</div>

       <div className="form-group">
        <label>Cover Image</label>
        {!coverImage && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          />
        )}
        {coverImage && (
          <div className="media-preview-container">
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Cover Preview"
              className="media-preview"
            />
            <button onClick={() => handleClearFile('coverImage')} className="close-btn">
              X
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Thumbnail</label>
        {!thumbnail && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        )}
        {thumbnail && (
          <div className="media-preview-container">
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="Thumbnail Preview"
              className="media-preview"
            />
            <button onClick={() => handleClearFile('thumbnail')} className="close-btn">
              X
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Promotional Video</label>
        {!promoVideo && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setPromoVideo(e.target.files?.[0] || null)}
          />
        )}
        {promoVideo && (
          <div className="media-preview-container">
            <video
              src={URL.createObjectURL(promoVideo)}
              controls
              className="media-preview"
            />
            <button onClick={() => handleClearFile('promoVideo')} className="close-btn">
              X
            </button>
          </div>
        )}
      </div>

      <div className="button-group">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save & Next'}
        </button>
        <button onClick={handleSkip} className="skip-button">Skip</button>
      </div>
    </div>
  );
};

export default PackageMediaPage;
