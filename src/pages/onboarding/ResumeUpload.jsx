import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export function ResumeUpload() {
  const navigate = useNavigate();
  const { setResumeData, updateOnboardingStep, currentUser } = useApp();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(() => {
    if (currentUser?.resume?.fileName) {
      return {
        rawFile: null,
        name: currentUser.resume.fileName,
        size: currentUser.resume.fileSize || '2.4 MB',
        ready: true,
      };
    }
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateAndProcessFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    // Extension Validation
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileNameParts = file.name.split('.');
    const ext = fileNameParts[fileNameParts.length - 1].toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      setErrorMsg('Only PDF, DOC, and DOCX files are supported.');
      return;
    }

    // Size Validation (Max 10MB)
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMsg('File size must be less than 10MB.');
      return;
    }

    // Valid File
    setSelectedFile({
      rawFile: file,
      name: file.name,
      size: formatFileSize(file.size),
      ready: true,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleContinue = () => {
    if (!selectedFile) {
      setErrorMsg('Please upload your resume to continue.');
      return;
    }

    setResumeData({
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      rawFile: selectedFile.rawFile,
    });

    updateOnboardingStep('processing');
    navigate('/onboarding/resume-processing');
  };

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="md">
        <OnboardingProgress currentStep="upload" variant="resume" />

        {/* HIDDEN REAL FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#059669',
              background: 'rgba(236, 253, 245, 0.85)',
              padding: '6px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(167, 243, 208, 0.8)',
            }}
          >
            AUTOMATED PROFILE EXTRACTION
          </span>

          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
              fontWeight: '800',
              color: '#0f172a',
              marginTop: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Upload Your Resume
          </h1>

          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '8px' }}>
            Upload your latest resume and we'll extract the information needed to build your
            RoleCompass profile.
          </p>
        </div>

        {/* ERROR DISPLAY BANNER */}
        {errorMsg && (
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto 20px',
              background: 'rgba(254, 242, 242, 0.95)',
              border: '1px solid rgba(254, 202, 202, 0.9)',
              color: '#991b1b',
              padding: '12px 18px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              fontWeight: '700',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* UPLOAD WORKSPACE CARD */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.48)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderRadius: '24px',
            padding: '44px 36px',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            boxShadow:
              '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          {/* DRAG & DROP DASHED ZONE */}
          <div
            onClick={handleBrowseClick}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed #059669' : '2px dashed rgba(5, 150, 105, 0.35)',
              background: isDragging ? 'rgba(236, 253, 245, 0.9)' : 'rgba(248, 250, 252, 0.65)',
              borderRadius: '18px',
              padding: '36px 24px',
              textAlign: 'center',
              transition: 'all 200ms ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(236, 253, 245, 0.95)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(5, 150, 105, 0.15)',
              }}
            >
              <UploadCloud size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Drag & drop your resume here
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
                or{' '}
                <span style={{ color: '#059669', fontWeight: '700', textDecoration: 'underline' }}>
                  Browse Files
                </span>{' '}
                from your computer
              </p>
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                fontWeight: '600',
                background: 'rgba(241, 245, 249, 0.8)',
                padding: '4px 14px',
                borderRadius: '8px',
              }}
            >
              Supported Formats: PDF, DOC, DOCX (Max 10MB)
            </div>
          </div>

          {/* SELECTED FILE DISPLAY STATE */}
          {selectedFile && (
            <div
              style={{
                marginTop: '24px',
                background: 'rgba(236, 253, 245, 0.9)',
                border: '1px solid rgba(167, 243, 208, 0.9)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '10px',
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                    {selectedFile.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: '#059669',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '2px',
                    }}
                  >
                    <CheckCircle2 size={14} /> {selectedFile.size} • Ready to continue
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={14} /> Change File
              </button>
            </div>
          )}

          {/* ACTION BUTTON */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={handleContinue}
              disabled={!selectedFile}
              style={{
                background: selectedFile ? '#059669' : '#94a3b8',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '1rem',
                padding: '14px 36px',
                borderRadius: '12px',
                border: 'none',
                cursor: selectedFile ? 'pointer' : 'not-allowed',
                boxShadow: selectedFile ? '0 4px 18px rgba(5, 150, 105, 0.35)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 200ms ease',
              }}
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
