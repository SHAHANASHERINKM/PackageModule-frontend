'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './style.css';
import { useParams, useRouter } from 'next/navigation';

const Editor = dynamic(() => import('@components/ckTextEditor/ckTextEditor'), { ssr: false });

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const VALID_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi'];
const REQUIRED_WIDTH = 750;
const REQUIRED_HEIGHT = 422;


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

const CourseLandingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle:'',
    description: '',
    language: '',
    level: '',
    categoryId: '',
    coverImage: null as File | null,
    thumbnailImage: null as File | null,
    videoFile: null as File | null,
  });
  const [description, setDescription] = useState('');

const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    title: null as string | null,
    subtitle:null as string | null,
    description: null as string | null,
    language: null as string | null,
    level: null as string | null,
    categoryId: null as string | null,
    coverImage: null as string | null,
    thumbnailImage: null as string | null,
    videoFile: null as string | null,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const params = useParams();
  const packageId = params?.id as string;

  useEffect(() => {
  const fetchCourseLandingData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/package/${packageId}/course-landing-page`);
      if (!res.ok) {
        console.warn('No existing course landing page data found.');
        setIsDataLoaded(false);
        return;
      }

      const data = await res.json();


      setFormData({
        title: data.title || '',
        subtitle:data.subtitle || '',
        description: data.description || '',
        language: data.language || '',
        level: data.level || '',
        categoryId: data.categoryId || '',
        coverImage: null, // file input remains null
        thumbnailImage: null,
        videoFile: null,
      });
      
      setDescription(data.description || '');

      setIsDataLoaded(true);
      console.log('Fetched Data:', data);

      if (data.coverImage) setPreviewUrl(data.coverImage);
      if (data.thumbnailImage) setThumbnailPreviewUrl(data.thumbnailImage);
      if (data.videoFile) setVideoPreviewUrl(data.videoFile);
    } catch (error) {
      console.error('Failed to fetch course landing page data:', error);
    }
  };

  if (packageId) {
    fetchCourseLandingData();
  }
}, [packageId]);


  const validateField = (name: string, value: string | File | null) => {
    const message = `${name.replace(/Image|File/, '')} is required.`;
    if (!value) {
      setErrors((prev) => ({ ...prev, [name]: message }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [name]: null }));
    return true;
  };

  const validateAllFields = () => {
  const validations = [
    { name: 'title', value: formData.title },
    {name:'subtitle',value:formData.subtitle},
    { name: 'description', value: formData.description },
    { name: 'language', value: formData.language },
    { name: 'level', value: formData.level },
    { name: 'categoryId', value: formData.categoryId },
    { name: 'coverImage', value: formData.coverImage || previewUrl },
    { name: 'thumbnailImage', value: formData.thumbnailImage || thumbnailPreviewUrl },
    { name: 'videoFile', value: formData.videoFile || videoPreviewUrl },
  ];

  return validations.every(({ name, value }) => validateField(name, value));
};


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'coverImage' | 'thumbnailImage' | 'videoFile'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDirty(true);
    setErrors((prev) => ({ ...prev, [type]: null }));

    // Video handling
    if (type === 'videoFile') {
      if (!VALID_VIDEO_TYPES.includes(file.type)) {
        setErrors((prev) => ({ ...prev, videoFile: 'Invalid video type.' }));
        setVideoPreviewUrl(null);
        setFormData((prev) => ({ ...prev, videoFile: null }));
        return;
      }
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
      setFormData((prev) => ({ ...prev, videoFile: file }));
      return;
    }

    // Image handling
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      const error = 'Only .jpg, .jpeg, .png, .gif formats are allowed.';
      setErrors((prev) => ({ ...prev, [type]: error }));
      type === 'thumbnailImage' ? setThumbnailPreviewUrl(null) : setPreviewUrl(null);
      setFormData((prev) => ({ ...prev, [type]: null }));
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT) {
        const url = img.src;
        type === 'thumbnailImage' ? setThumbnailPreviewUrl(url) : setPreviewUrl(url);
        setFormData((prev) => ({ ...prev, [type]: file }));
      } else {
        const error = `Image must be exactly ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px.`;
        setErrors((prev) => ({ ...prev, [type]: error }));
        type === 'thumbnailImage' ? setThumbnailPreviewUrl(null) : setPreviewUrl(null);
        setFormData((prev) => ({ ...prev, [type]: null }));
      }
    };
  };

  const handleRemoveFile = (type: 'coverImage' | 'thumbnailImage' | 'videoFile') => {
    setIsDirty(true);
    if (type === 'coverImage') setPreviewUrl(null);
    if (type === 'thumbnailImage') setThumbnailPreviewUrl(null);
    if (type === 'videoFile') setVideoPreviewUrl(null);
    setFormData((prev) => ({ ...prev, [type]: null }));
    setErrors((prev) => ({ ...prev, [type]: 'Required field.' }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof typeof formData
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
    setIsDirty(true);
  };

  const handleDescriptionChange = (value: string) => {
  setDescription(value); // update editor's content
  setFormData((prev) => ({ ...prev, description: value }));
  validateField('description', value);
  setIsDirty(true);
};


  const triggerFileInput = (type: 'coverImage' | 'thumbnailImage' | 'videoFile') => {
    if (type === 'coverImage') coverImageInputRef.current?.click();
    if (type === 'thumbnailImage') thumbnailInputRef.current?.click();
    if (type === 'videoFile') videoInputRef.current?.click();
  };

  const handleSave = async () => {
  if (!validateAllFields()) {
    alert('Please fill all required fields.');
    return;
  }

  setIsSaved(true);
  setIsDirty(false);

  const payload = new FormData();
  payload.append('title', formData.title);
  payload.append('subtitle',formData.subtitle);
  payload.append('description', formData.description);
  payload.append('language', formData.language);
  payload.append('level', formData.level);
  payload.append('categoryId', formData.categoryId);
  payload.append('coverImage', formData.coverImage as Blob);
  payload.append('thumbnailImage', formData.thumbnailImage as Blob);
  payload.append('videoFile', formData.videoFile as Blob);
  payload.append('packageId', packageId);
 

  try {
    const res = await fetch(`http://localhost:3000/package/${packageId}/course-landing-page`, {
     method: isDataLoaded ? "PUT" : "POST",
      body: payload,
    });

    if (res.ok) {
      alert('Data saved successfully!');
      router.push(`/teaching-page/package-page/${packageId}/pricing`);
    } else {
      alert('Failed to save data.');
    }
  } catch (error) {
    alert('An error occurred while saving data.');
    console.error(error);
  }
};



  return (
    <div className="component-container">
      <div className="flex justify-between items-center">
        <h2>Course Landing Page</h2>
        <button className="upload-button" onClick={handleSave}>
          {isDataLoaded ? "Update" : "Save"} {/* Change button text based on data availability */}
        </button>
      </div>
      <hr />

      <div className="content">
        <p>
          Your course landing page is crucial to your success. As you complete this section, think about creating a compelling
          Course Landing Page that demonstrates why someone would want to enroll in your course.
        </p>

        <div className="field-container">
          <p><strong>Course title</strong></p>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-title"
              placeholder="Programming"
              maxLength={50}
              value={formData.title}
              onChange={(e) => handleInputChange(e, 'title')}
              required
            />
          </div>
          {errors.title && <h3 className="error-text">{errors.title}</h3>}
          <h3>Your title should be a mix of attention-grabbing, informative, and optimized for search.</h3>
        </div>

        <div className="field-container">
          <p><strong>Course subtitle</strong></p>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-subtitle"
              placeholder="Insert your course subtitle"
              maxLength={120}
              value={formData.subtitle}
              onChange={(e) => handleInputChange(e, 'subtitle')}
              required
            />
          </div>
          {errors.title && <h3 className="error-text">{errors.subtitle}</h3>}
          </div>

        <div className="field-container">
          <p><strong>Course description</strong></p>
          <div className="editor-wrapper">
  <Editor value={description} onChange={handleDescriptionChange} />
</div>
          {errors.description && <h3 className="error-text">{errors.description}</h3>}
        </div>

        <br />
        <p><strong>Basic Info</strong></p>
        <div className="flex gap-4">
          <div className="field-container">
            <select
              value={formData.language}
              onChange={(e) => handleInputChange(e, 'language')}
              className="border rounded p-2 min-w-[450px] min-h-[50px]"
              required
            >
              <option value="">Select Language</option>
              <option value="English">English (US)</option>
              <option value="Hindi">Hindi</option>
              <option value="Malayalam">Malayalam</option>
            </select>
            {errors.language && <h3 className="error-text">{errors.language}</h3>}
          </div>

          <div className="field-container">
            <select
              value={formData.level}
              onChange={(e) => handleInputChange(e, 'level')}
              className="border rounded p-2 min-w-[450px] min-h-[50px]"
              required
            >
              <option value="">-- Select Level --</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.level && <h3 className="error-text">{errors.level}</h3>}
          </div>

          <div className="field-container">
            <select
              value={formData.categoryId}
              onChange={(e) => handleInputChange(e, 'categoryId')}
              className="border rounded p-2 min-w-[450px] min-h-[50px]"
              required
            >
              <option value="">-- Select Category --</option>
              {categoryOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <h3 className="error-text">{errors.categoryId}</h3>}
          </div>
        </div>

        <div className="field-container">
          <div className="course-image-container">
            <p className="course-image-label">Course image</p>
            <div className="course-image-row">
              <div className="image-preview relative">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Selected Course" />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => handleRemoveFile('coverImage')}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <span>No image selected</span>
                )}
              </div>
              <div className="upload-details">
                <p>
                  Upload your course image here. Important guidelines: 750x422
                  pixels; .jpg, .jpeg, .gif, or .png. No text on the image.
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={(e) => handleFileChange(e, 'coverImage')}
                  className="file-input"
                  ref={coverImageInputRef}
                  style={{ display: 'none' }}
                  required
                />
                <button
                  className="upload-button"
                  onClick={() => triggerFileInput('coverImage')}
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
          {errors.coverImage && <h3 className="error-text">{errors.coverImage}</h3>}
        </div>

        <div className="field-container">
          <div className="course-image-container">
            <p className="course-image-label">Course thumbnail</p>
            <div className="course-image-row">
              <div className="image-preview relative">
                {thumbnailPreviewUrl ? (
                  <>
                    <img src={thumbnailPreviewUrl} alt="Selected Thumbnail" />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => handleRemoveFile('thumbnailImage')}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <span>No thumbnail selected</span>
                )}
              </div>
              <div className="upload-details">
                <p>
                  Upload your course thumbnail here. Important guidelines: 750x422
                  pixels; .jpg, .jpeg, .gif, or .png. No text on the image.
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={(e) => handleFileChange(e, 'thumbnailImage')}
                  className="file-input"
                  ref={thumbnailInputRef}
                  style={{ display: 'none' }}
                  required
                />
                <button
                  className="upload-button"
                  onClick={() => triggerFileInput('thumbnailImage')}
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
          {errors.thumbnailImage && <h3 className="error-text">{errors.thumbnailImage}</h3>}
        </div>

        <div className="field-container">
          <div className="course-image-container">
            <p className="course-image-label">Promotional video</p>
            <div className="course-image-row">
              <div className="image-preview relative">
                {videoPreviewUrl ? (
                  <>
                    <video src={videoPreviewUrl} controls width="100%" />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => handleRemoveFile('videoFile')}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <span>No video selected</span>
                )}
              </div>
              <div className="upload-details">
                <p>
                  Upload your promotional video here. Supported formats: .mp4, .mov, .avi.
                </p>
                <input
                  type="file"
                  accept=".mp4,.mov,.avi"
                  onChange={(e) => handleFileChange(e, 'videoFile')}
                  className="file-input"
                  ref={videoInputRef}
                  style={{ display: 'none' }}
                  required
                />
                <button
                  className="upload-button"
                  onClick={() => triggerFileInput('videoFile')}
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
          {errors.videoFile && <h3 className="error-text">{errors.videoFile}</h3>}
        </div>
      </div>
    </div>
  );
};

export default CourseLandingPage;