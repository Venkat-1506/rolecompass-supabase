import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { AtsTesterCard } from '../../components/cards/AtsTesterCard.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { resumeService } from '../../services/resumeService.js';
import { 
  UploadCloud, FileText, CheckCircle2, ArrowRight, Loader2, Sparkles, 
  RefreshCw, Check, Edit3, ShieldCheck, Download, CheckSquare, Eye, Sliders
} from 'lucide-react';
import '../../styles/glass.css';

export function ResumePage() {
  const navigate = useNavigate();
  const { candidateUser, currentUser, updateProfile, setResumeData } = useApp();

  const candidateName = candidateUser?.personal?.fullName || currentUser?.fullName || 'Candidate';
  const initialFileName = (candidateUser.resume?.fileName && candidateUser.resume?.fileName !== 'Arjun_Verma_Resume_2026.pdf')
    ? candidateUser.resume.fileName
    : `${candidateName.replace(/\s+/g, '_')}_Resume_2026.pdf`;

  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(initialFileName);
  const [fileSize, setFileSize] = useState(candidateUser.resume?.fileSize || "240 KB");
  const [progress, setProgress] = useState(0);
  const [toastMsg, setToastMsg] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [extractedData, setExtractedData] = useState({
    fullName: candidateUser.personal?.fullName || candidateName,
    title: candidateUser.personal?.title || "Frontend Engineer & Full Stack Developer",
    email: candidateUser.personal?.email || currentUser?.email || "candidate@rolecompass.com",
    phone: candidateUser.personal?.phone || "+91 98765 43210",
    location: candidateUser.personal?.location || "Bengaluru, Karnataka",
    skills: candidateUser.skills && candidateUser.skills.length > 0
      ? candidateUser.skills
      : ["React", "JavaScript", "HTML/CSS", "TypeScript", "Node.js", "Git"]
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setFileSize(`${(file.size / 1024).toFixed(0)} KB`);
      setToastMsg(`Uploaded ${file.name} successfully!`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setFileSize(`${(file.size / 1024).toFixed(0)} KB`);
      setToastMsg(`Uploaded ${file.name} successfully!`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const startProcessing = async () => {
    setStep(2);
    setProgress(25);
    setTimeout(() => setProgress(55), 350);
    setTimeout(() => setProgress(85), 700);

    const parsed = await resumeService.processResume({ name: selectedFile, size: fileSize }, candidateUser);
    setTimeout(() => {
      setProgress(100);
      setExtractedData({
        fullName: parsed.personal?.fullName || candidateName,
        title: parsed.personal?.headline || "Software Engineer",
        email: parsed.personal?.email || candidateUser.personal?.email || currentUser?.email,
        phone: parsed.personal?.phone || candidateUser.personal?.phone || "+91 98765 43210",
        location: parsed.personal?.location || candidateUser.personal?.location || "Bengaluru, Karnataka",
        skills: parsed.skills || extractedData.skills
      });
      setStep(3);
    }, 1100);
  };

  const addExtractedSkill = () => {
    if (newSkillInput.trim() && !extractedData.skills.includes(newSkillInput.trim())) {
      setExtractedData({
        ...extractedData,
        skills: [...extractedData.skills, newSkillInput.trim()]
      });
      setNewSkillInput('');
    }
  };

  const removeExtractedSkill = (skillToRemove) => {
    setExtractedData({
      ...extractedData,
      skills: extractedData.skills.filter(s => s !== skillToRemove)
    });
  };

  const completeResumeFlow = () => {
    updateProfile({
      personal: {
        fullName: extractedData.fullName,
        email: extractedData.email,
        title: extractedData.title,
        phone: extractedData.phone,
        location: extractedData.location
      },
      skills: extractedData.skills
    });

    setResumeData({
      fileName: selectedFile,
      fileSize: fileSize,
      uploadedAt: new Date().toISOString().split('T')[0],
      parsedScore: 94,
      isVerified: true
    });

    setToastMsg("Resume profile synchronized to central repository!");
    setStep(4);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDownloadSim = () => {
    setToastMsg(`Preparing ${selectedFile} for download...`);
    setTimeout(() => {
      setToastMsg(`Downloaded ${selectedFile}`);
      setTimeout(() => setToastMsg(null), 2500);
    }, 1000);
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          {/* Unified Candidate Header Banner */}
          <div className="rc-candidate-header-banner">
            <div>
              <span className="rc-candidate-eyebrow">
                ATS INTELLIGENCE & RESUME ENGINE
              </span>
              <h1 className="rc-candidate-h1">Candidate Resume Hub</h1>
              <p className="rc-candidate-subtitle">
                Manage your primary resume PDF, review extracted skills, and run real-time ATS readiness evaluations.
              </p>
            </div>

            <Badge variant="success" icon={<ShieldCheck size={14} />}>
              Single Profile Architecture
            </Badge>
          </div>

          {toastMsg && <Toast type="success" message={toastMsg} onClose={() => setToastMsg(null)} />}

          <Grid cols="responsive-3" gap="6">
            {/* Left 2 Columns: Main Resume Workspace */}
            <div className="rc-col-span-2-desktop">
              <Stack gap="6">

                {/* PRIMARY ACTIVE RESUME CARD */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.48)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderRadius: '20px',
                  padding: '26px',
                  border: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
                }}>
                  <Stack gap="4">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} color="#059669" />
                        <h3 className="rc-h3" style={{ margin: 0 }}>Primary Active Resume</h3>
                      </div>
                      <Badge variant="success">Active Document</Badge>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.85) 100%)',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          padding: '14px',
                          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                          borderRadius: '14px',
                          color: '#059669',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FileText size={32} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {selectedFile}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                              PDF Document • {fileSize} • Uploaded {candidateUser.resume?.uploadedDate || 'Recently'}
                            </span>
                            <span style={{
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              color: '#059669',
                              background: '#ecfdf5',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid #a7f3d0'
                            }}>
                              ATS Ready
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={handleDownloadSim}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#059669'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                        >
                          <Download size={15} /> Download
                        </button>

                        <label style={{
                          background: '#059669',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                          transition: 'all 0.15s ease'
                        }}>
                          <RefreshCw size={14} /> Replace File
                          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                  </Stack>
                </div>

                {/* STEP 1: INTERACTIVE PARSER & DROPZONE */}
                {step === 1 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
                  }}>
                    <Stack gap="5" align="center" style={{ textAlign: 'center' }}>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                          width: '100%',
                          border: isDragging ? '2px dashed #059669' : '2px dashed #94a3b8',
                          background: isDragging ? 'rgba(236, 253, 245, 0.6)' : 'rgba(248, 250, 252, 0.7)',
                          borderRadius: '18px',
                          padding: '36px 20px',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          padding: '18px',
                          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                          borderRadius: '50%',
                          color: '#059669',
                          boxShadow: '0 6px 18px rgba(5, 150, 105, 0.18)'
                        }}>
                          <UploadCloud size={40} />
                        </div>

                        <div>
                          <span style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: '#059669',
                            background: '#ecfdf5',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            display: 'inline-block',
                            marginBottom: '8px'
                          }}>
                            AI-Powered Resume Scanner
                          </span>
                          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            Extract Profile Intelligence
                          </h3>
                          <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '440px', margin: '6px auto 0' }}>
                            Parse skills, experience, and contact details from your resume to automatically update your central jobseeker profile.
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem', color: '#64748b' }}>
                          <span>Supports PDF, DOCX</span>
                          <span>•</span>
                          <span>Up to 10 MB</span>
                          <span>•</span>
                          <span>Auto ATS Scan</span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        onClick={startProcessing}
                        rightIcon={<ArrowRight size={18} />}
                        style={{ minWidth: '280px', padding: '14px 28px' }}
                      >
                        Run Resume Profile Preview Extraction
                      </Button>
                    </Stack>
                  </div>
                )}

                {/* STEP 2: PROCESSING ANIMATION */}
                {step === 2 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '40px 32px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    textAlign: 'center'
                  }}>
                    <Stack gap="5" align="center">
                      <div style={{
                        padding: '18px',
                        background: '#ecfdf5',
                        borderRadius: '50%',
                        color: '#059669',
                        boxShadow: '0 6px 20px rgba(5, 150, 105, 0.2)'
                      }}>
                        <Loader2 className="rc-animate-spin" size={42} />
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          Extracting Resume Intelligence...
                        </h3>
                        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.88rem' }}>
                          Parsing contact credentials, skill keywords, and formatting ATS checks.
                        </p>
                      </div>

                      <div style={{ width: '100%', maxWidth: '380px' }}>
                        <Progress value={progress} showLabel />
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        fontSize: '0.8rem',
                        color: '#059669',
                        fontWeight: 700,
                        marginTop: '8px'
                      }}>
                        <span>✓ Layout Check</span>
                        <span>✓ Skills Extraction</span>
                        <span>✓ Profile Sync</span>
                      </div>
                    </Stack>
                  </div>
                )}

                {/* STEP 3: EXTRACTED REVIEW & CONFIRM */}
                {step === 3 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '28px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
                  }}>
                    <Stack gap="5">
                      <Cluster justify="between" align="center">
                        <div>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: '#059669',
                            background: '#ecfdf5',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            Parsed Profile Review
                          </span>
                          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
                            Verify Extracted Credentials
                          </h3>
                        </div>
                        <Badge variant="success" icon={<Check size={14} />}>
                          94% Match Confidence
                        </Badge>
                      </Cluster>

                      <div style={{
                        background: 'rgba(248, 250, 252, 0.95)',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Stack gap="4">
                          <Grid cols="responsive-2" gap="4">
                            <Input
                              label="Full Name"
                              value={extractedData.fullName}
                              onChange={(e) => setExtractedData({ ...extractedData, fullName: e.target.value })}
                            />
                            <Input
                              label="Professional Title / Headline"
                              value={extractedData.title}
                              onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                            />
                            <Input
                              label="Email Address"
                              value={extractedData.email}
                              onChange={(e) => setExtractedData({ ...extractedData, email: e.target.value })}
                            />
                            <Input
                              label="Phone Number"
                              value={extractedData.phone}
                              onChange={(e) => setExtractedData({ ...extractedData, phone: e.target.value })}
                            />
                          </Grid>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                                Extracted Skill Tags ({extractedData.skills.length})
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                              <Input
                                placeholder="Add another skill (e.g. Docker, Python)..."
                                value={newSkillInput}
                                onChange={(e) => setNewSkillInput(e.target.value)}
                                style={{ maxWidth: '300px' }}
                              />
                              <Button variant="secondary" size="sm" onClick={addExtractedSkill}>
                                Add Skill
                              </Button>
                            </div>

                            <Cluster gap="2">
                              {extractedData.skills.map(sk => (
                                <Tag key={sk} onRemove={() => removeExtractedSkill(sk)}>
                                  {sk}
                                </Tag>
                              ))}
                            </Cluster>
                          </div>
                        </Stack>
                      </div>

                      <Cluster justify="between" align="center">
                        <Button variant="ghost" onClick={() => setStep(1)}>
                          Re-upload / Cancel
                        </Button>
                        <Button variant="primary" size="lg" onClick={completeResumeFlow} rightIcon={<ArrowRight size={16} />}>
                          Confirm & Sync to Central Profile
                        </Button>
                      </Cluster>
                    </Stack>
                  </div>
                )}

                {/* STEP 4: SUCCESS CONFIRMATION */}
                {step === 4 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '24px',
                    padding: '40px 32px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    textAlign: 'center'
                  }}>
                    <Stack gap="5" align="center">
                      <div style={{
                        padding: '16px',
                        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                        color: '#059669',
                        borderRadius: '50%',
                        boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)'
                      }}>
                        <CheckCircle2 size={54} />
                      </div>

                      <div>
                        <h2 className="rc-h2" style={{ fontSize: '1.65rem', margin: 0 }}>
                          Central Profile Synchronized!
                        </h2>
                        <p style={{ color: '#475569', marginTop: '6px', fontSize: '0.94rem', maxWidth: '480px' }}>
                          Your resume intelligence has been saved to your single Candidate Profile. Matching indices for over 50+ real-time jobs and company applications have been updated.
                        </p>
                      </div>

                      <Cluster gap="3">
                        <Button variant="primary" size="lg" onClick={() => navigate('/explore')}>
                          Explore Matching Jobs
                        </Button>
                        <Button variant="secondary" size="lg" onClick={() => navigate('/candidate')}>
                          Candidate Dashboard
                        </Button>
                      </Cluster>
                    </Stack>
                  </div>
                )}

              </Stack>
            </div>

            {/* Right Column: ATS SCANNER & BEST PRACTICES */}
            <Stack gap="6">
              {/* ATS Readiness Test Card */}
              <AtsTesterCard candidateUser={candidateUser} />

              {/* ATS OPTIMIZATION BEST PRACTICES CARD */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.48)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
              }}>
                <Stack gap="3">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckSquare size={18} color="#059669" />
                    <h3 className="rc-h3" style={{ fontSize: '1.1rem', margin: 0 }}>ATS Optimization Tips</h3>
                  </div>
                  <p className="rc-small" style={{ color: '#64748b' }}>
                    Follow these guidelines to maintain a 90+ ATS pass rate across top recruitment software:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span>Use standard headings like <strong>Experience</strong>, <strong>Education</strong>, and <strong>Skills</strong>.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span>Quantify achievements with metrics (e.g. <em>improved API performance by 40%</em>).</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span>Keep contact information (email, phone, city) prominently placed at top.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span>Avoid multi-column tables and fancy graphic elements that confuse parsers.</span>
                    </div>
                  </div>

                  <div style={{ paddingTop: '8px' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/candidate/profile')}
                      rightIcon={<Edit3 size={14} />}
                      style={{ width: '100%' }}
                    >
                      Edit Central Profile
                    </Button>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Grid>
        </Stack>
      </PageContainer>
    </Section>
  );
}
