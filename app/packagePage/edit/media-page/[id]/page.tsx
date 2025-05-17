"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './media-page.css';

const PackageMediaPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [promoVideo, setPromoVideo] = useState<File | null>(null);

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [promoVideoUrl, setPromoVideoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing media on mount
  useEffect(() => {
    const fetchMedia = async () => {
      if (!id) {
        setError('Package ID is missing');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/package/${id}/media`);

        if (!res.ok) {
          setError(`Failed to fetch media. Status: ${res.status}`);
          return;
        }

        const json = await res.json();
        console.log("Fetched media response:", json);

        const pkg = json.data?.package || json.data || json;

        setCoverImageUrl(pkg.cover_image || null);
        setThumbnailUrl(pkg.thumbnailUrl || null);
        setPromoVideoUrl(pkg.promoVideoUrl || null);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Failed to load existing media');
      }
    };

    fetchMedia();
  }, [id]);

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
    router.push(`/packagePage/${id}`);
  };

  const handleCancel = () => {
    console.log('Skipped');
    alert('Package media skipped successfully!');
    router.push(`/packagePage/${id}`);
  };

  const handleSubmit = async () => {
    if (!id) {
      alert('Package ID is missing!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (coverImage && validateFile(coverImage, 'image')) formData.append('coverImage', coverImage);
    if (thumbnail && validateFile(thumbnail, 'image')) formData.append('thumbnail', thumbnail);
    if (promoVideo && validateFile(promoVideo, 'video')) formData.append('promoVideo', promoVideo);

    try {
      const res = await fetch(`http://localhost:3000/package/${id}/media`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update package media');

      const { data } = await res.json();

      handleSave({
        coverImage: data.cover_image || null,
        thumbnail: data.thumbnailUrl || null,
        promoVideo: data.promoVideoUrl || null,
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the package.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = (fileType: string) => {
    if (fileType === 'coverImage') {
      setCoverImage(null);
      setCoverImageUrl(null);
    }
    if (fileType === 'thumbnail') {
      setThumbnail(null);
      setThumbnailUrl(null);
    }
    if (fileType === 'promoVideo') {
      setPromoVideo(null);
      setPromoVideoUrl(null);
    }
  };

  return (
    <div className="media-form-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="form-intro">
        <h2>📦 Edit Package Media</h2>
        <p>
          Update eye-catching visuals and promotional content to make your package stand out.
          You can change the <strong>cover image</strong>, <strong>thumbnail</strong>, and
          <strong> promo video</strong>.
        </p>
      </div>

      {/* Cover Image */}
      <div className="form-group">
        <label>Cover Image</label>
        {(coverImage || coverImageUrl) ? (
          <div className="media-preview-container">
            <img
              src={coverImage ? URL.createObjectURL(coverImage) : coverImageUrl || "/default-coverpage.jpg"}
              alt="Cover Preview"
              className="media-preview"
            />
            <button onClick={() => handleClearFile('coverImage')} className="close-btn">
              X
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          />
        )}
      </div>

      {/* Thumbnail */}
      <div className="form-group">
        <label>Thumbnail</label>
        {(thumbnail || thumbnailUrl) ? (
          <div className="media-preview-container">
            <img
              src={thumbnail ? URL.createObjectURL(thumbnail) : thumbnailUrl || "/default-coverpage.jpg"}
              alt="Thumbnail Preview"
              className="media-preview"
            />
            <button onClick={() => handleClearFile('thumbnail')} className="close-btn">
              X
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        )}
      </div>

      {/* Promo Video */}
      <div className="form-group">
        <label>Promotional Video</label>
        {(promoVideo || promoVideoUrl) ? (
          <div className="media-preview-container">
            <video
              src={promoVideo ? URL.createObjectURL(promoVideo) : promoVideoUrl || "/default-video.mp4"}
              controls
              className="media-preview"
            />
            <button onClick={() => handleClearFile('promoVideo')} className="close-btn">
              X
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setPromoVideo(e.target.files?.[0] || null)}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Update'}
        </button>
        <button onClick={handleCancel} className="skip-button">
          Skip
        </button>
      </div>
    </div>
  );
};

export default PackageMediaPage;
