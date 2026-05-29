import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertTriangle } from 'lucide-react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';

export const UploadZone = ({ onUploadSuccess, jobDescription, onToast }) => {
  const { token, getAuthHeaders } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      validateAndProcessFile(droppedFiles[0]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      validateAndProcessFile(selectedFiles[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    const filetypes = ['.pdf', '.docx'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!filetypes.includes(extension)) {
      onToast('Invalid format. Only PDF and DOCX documents are accepted!', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onToast('File exceeds 10MB size limit.', 'error');
      return;
    }

    setFile(file);
    uploadResumeFile(file);
  };

  const uploadResumeFile = async (selectedFile) => {
    setUploading(true);
    setProgress(15);
    
    // Simulate upload stages
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 10;
      });
    }, 150);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/resumes/analyze`, {
        method: 'POST',
        headers: getAuthHeaders(true), // isMultipart = true (does not set Content-Type header so browser sets boundaries)
        body: formData
      });

      const resData = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (resData.success) {
        onToast('Resume uploaded and audited successfully!', 'success');
        setTimeout(() => {
          onUploadSuccess(resData.data);
          resetState();
        }, 300);
      } else {
        throw new Error(resData.message || 'Server failed to analyze the file.');
      }
    } catch (err) {
      onToast(`Failed to parse: ${err.message}`, 'error');
      resetState();
    }
  };

  const resetState = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={`upload-zone-container ${dragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !uploading && fileInputRef.current.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.docx" 
        style={{ display: 'none' }}
      />
      
      <div className="upload-icon-wrapper">
        <UploadCloud size={32} />
      </div>

      {!uploading ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {file ? file.name : 'Upload your resume'}
            </h3>
            <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem' }}>
              Drag and drop PDF or DOCX file, or click to browse
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'rgb(var(--text-tertiary-rgb))' }}>
            Maximum file size: 10MB
          </span>
        </>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Analyzing {file?.name}...</h3>
          <div className="upload-progress-track">
            <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'rgb(var(--text-secondary-rgb))' }}>
            {progress < 90 ? 'Parsing document structure...' : 'Generating AI Audit Metrics...'}
          </span>
        </div>
      )}
    </div>
  );
};
export default UploadZone;
