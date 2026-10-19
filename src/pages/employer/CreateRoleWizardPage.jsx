import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { CheckCircle2, ArrowRight, ArrowLeft, Plus, Sparkles, Send, Upload, Trash2 } from 'lucide-react';

export function CreateRoleWizardPage() {
  const navigate = useNavigate();
  const { addJob, employerUser, companies = [], updateCompany } = useApp();

  const companyId = employerUser?.companyId || 'zoho';
  const existingCompany = companies.find(c => c.id === companyId) || {};

  const [step, setStep] = useState(1); // Exactly 6 steps!

  // Form State preserved across steps
  const [formData, setFormData] = useState({
    // Step 1: Role Details
    companyName: existingCompany.name || employerUser?.company?.name || "Zoho Corporation",
    companyLogo: existingCompany.logo || employerUser?.company?.logo || "",
    title: "",
    category: "Engineering",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Full-Time",
    experience: "0-2 Years",
    salary: "₹14,000,000 - ₹20,000,000 PA",

    // Step 2: Description
    description: "",
    responsibilitiesText: "Develop responsive React components.\nIntegrate REST APIs.\nOptimize Web Vitals.",

    // Step 3: Requirements
    education: "B.Tech / B.E. in Computer Science or STEM",
    skillsList: ["React", "JavaScript", "CSS Architecture"],
    newSkillInput: "",

    // Step 4: Screening
    screeningQuestions: [
      { id: 1, question: "Notice Period / Availability", type: "Text" },
      { id: 2, question: "Willing to relocate or work hybrid?", type: "Yes/No" }
    ],

    // Step 5: Application Settings
    deadline: "2026-11-15",
    requireResume: true,
    requireScreening: true
  });

  const [logoError, setLogoError] = useState('');

  const stepsList = [
    { num: 1, title: "Role Details" },
    { num: 2, title: "Description" },
    { num: 3, title: "Requirements" },
    { num: 4, title: "Screening" },
    { num: 5, title: "App Settings" },
    { num: 6, title: "Review & Publish" }
  ];

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const addSkill = () => {
    if (formData.newSkillInput.trim() && !formData.skillsList.includes(formData.newSkillInput.trim())) {
      setFormData({
        ...formData,
        skillsList: [...formData.skillsList, formData.newSkillInput.trim()],
        newSkillInput: ""
      });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose a PNG, JPG, SVG or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Image is too large. Please upload an icon under 2 MB.');
      return;
    }
    setLogoError('');
    const reader = new FileReader();
    reader.onload = () => setFormData(prev => ({ ...prev, companyLogo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoError('');
    setFormData(prev => ({ ...prev, companyLogo: '' }));
  };

  const handlePublish = () => {
    // Persist the employer's company identity (icon + name) so it reflects across both portals
    updateCompany?.(companyId, {
      name: formData.companyName.trim() || undefined,
      logo: formData.companyLogo || undefined
    });

    const published = addJob({
      title: formData.title || "Junior Data & Frontend Engineer",
      category: formData.category,
      location: formData.location,
      workMode: formData.workMode,
      employmentType: formData.employmentType,
      experience: formData.experience,
      salary: formData.salary,
      description: formData.description || "Join our fast-growing engineering team to build scalable React user interfaces.",
      responsibilities: formData.responsibilitiesText.split('\n').filter(Boolean),
      education: formData.education,
      skills: formData.skillsList,
      deadline: formData.deadline,
      companyId: employerUser.companyId || "zoho"
    });

    navigate(`/jobs/${published.id}`);
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          <div>
            <span className="rc-caption">6-Step Job Publishing Wizard</span>
            <h1 className="rc-h1">Create & Publish Role Position</h1>
          </div>

          {/* Stepper Header */}
          <Card variant="glass" padding="4">
            <Grid cols="responsive-4" gap="2">
              {stepsList.map(s => {
                const isActive = s.num === step;
                const isDone = s.num < step;
                return (
                  <div
                    key={s.num}
                    onClick={() => s.num < step && setStep(s.num)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: isActive ? 'var(--rc-color-soft-mint)' : 'transparent',
                      border: isActive ? '1px solid var(--rc-color-soft-mint-border)' : '1px solid transparent',
                      cursor: isDone ? 'pointer' : 'default'
                    }}
                    className="rc-flex rc-items-center rc-gap-2"
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isDone || isActive ? 'var(--rc-color-green-accent)' : 'var(--rc-color-soft-slate-200)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isDone ? <CheckCircle2 size={14} /> : s.num}
                    </div>
                    <span className="rc-small" style={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--rc-color-green-accent)' : undefined }}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </Grid>
          </Card>

          {/* STEP 1: ROLE DETAILS */}
          {step === 1 && (
            <Card variant="glass" padding="6">
              <Stack gap="4">
                <Badge variant="info">Step 1 of 6: Basic Role Details</Badge>

                {/* Company Identity: icon shown on job cards across both portals */}
                <Card variant="soft" padding="4">
                  <Cluster gap="4" align="center" wrap>
                    <CompanyLogoWithFallback
                      companyId={companyId}
                      name={formData.companyName}
                      logo={formData.companyLogo}
                      size="lg"
                      variant="square"
                    />
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <Input
                        label="Company Name"
                        placeholder="e.g. Zoho Corporation"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <span className="rc-label" style={{ fontSize: '0.8125rem', marginBottom: '6px', display: 'block' }}>Company Icon</span>
                      <Cluster gap="2">
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1px solid rgba(5, 150, 105, 0.45)',
                            background: 'rgba(236, 253, 245, 0.9)',
                            color: 'var(--rc-color-green-accent)',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Upload size={15} /> Upload Icon
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            onChange={handleLogoUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {formData.companyLogo && (
                          <Button variant="ghost" size="sm" onClick={handleRemoveLogo} leftIcon={<Trash2 size={15} />}>
                            Remove
                          </Button>
                        )}
                      </Cluster>
                      <span className="rc-small" style={{ display: 'block', marginTop: '4px', color: logoError ? 'var(--rc-color-danger)' : undefined }}>
                        {logoError || 'Square PNG or SVG works best. Shown on your job posts.'}
                      </span>
                    </div>
                  </Cluster>
                </Card>

                <Grid cols="responsive-2" gap="4">
                  <Input
                    label="Job Title"
                    placeholder="e.g. Junior Frontend Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    isRequired
                  />
                  <Select
                    label="Department / Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={[
                      { value: 'Engineering', label: 'Engineering' },
                      { value: 'Design', label: 'Design' },
                      { value: 'Data & Analytics', label: 'Data & Analytics' }
                    ]}
                    isRequired
                  />
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <Select
                    label="Work Mode"
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    options={[
                      { value: 'Hybrid', label: 'Hybrid' },
                      { value: 'Remote', label: 'Remote' },
                      { value: 'On-Site', label: 'On-Site' }
                    ]}
                  />
                  <Select
                    label="Experience Requirement"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    options={[
                      { value: 'Freshers Allowed (0-1 Year)', label: 'Freshers Allowed (0-1 Year)' },
                      { value: '0-2 Years', label: '0-2 Years' },
                      { value: '1-3 Years', label: '1-3 Years' },
                      { value: '2-4 Years', label: '2-4 Years' }
                    ]}
                  />
                  <Input
                    label="Salary Range (PA)"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </Grid>
              </Stack>
            </Card>
          )}

          {/* STEP 2: DESCRIPTION */}
          {step === 2 && (
            <Card variant="glass" padding="6">
              <Stack gap="4">
                <Badge variant="info">Step 2 of 6: Overview & Responsibilities</Badge>
                <Textarea
                  label="Role Overview / Intro"
                  placeholder="Describe the mission of this role..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <Textarea
                  label="Key Responsibilities (One per line)"
                  value={formData.responsibilitiesText}
                  onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
                  rows={5}
                />
              </Stack>
            </Card>
          )}

          {/* STEP 3: REQUIREMENTS */}
          {step === 3 && (
            <Card variant="glass" padding="6">
              <Stack gap="4">
                <Badge variant="info">Step 3 of 6: Required Skills & Education</Badge>
                <Input
                  label="Education Requirement"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
                <div>
                  <span className="rc-label" style={{ fontSize: '0.8125rem', marginBottom: '6px', display: 'block' }}>Required Skills:</span>
                  <Cluster gap="2" style={{ marginBottom: '8px' }}>
                    <Input
                      placeholder="Add required skill (e.g. React)"
                      value={formData.newSkillInput}
                      onChange={(e) => setFormData({ ...formData, newSkillInput: e.target.value })}
                      style={{ maxWidth: '280px' }}
                    />
                    <Button variant="secondary" onClick={addSkill} leftIcon={<Plus size={16} />}>Add</Button>
                  </Cluster>
                  <Cluster gap="2">
                    {formData.skillsList.map(sk => <Tag key={sk}>{sk}</Tag>)}
                  </Cluster>
                </div>
              </Stack>
            </Card>
          )}

          {/* STEP 4: SCREENING */}
          {step === 4 && (
            <Card variant="glass" padding="6">
              <Stack gap="4">
                <Badge variant="info">Step 4 of 6: Screening Questions</Badge>
                <Stack gap="3">
                  {formData.screeningQuestions.map((sq, idx) => (
                    <Card key={sq.id} variant="soft" padding="4">
                      <Cluster justify="between" align="center">
                        <span className="rc-label">{idx + 1}. {sq.question}</span>
                        <Badge variant="default">{sq.type}</Badge>
                      </Cluster>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          )}

          {/* STEP 5: APPLICATION SETTINGS */}
          {step === 5 && (
            <Card variant="glass" padding="6">
              <Stack gap="4">
                <Badge variant="info">Step 5 of 6: Application Deadline & Settings</Badge>
                <Input
                  label="Application Deadline Date"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
                <Checkbox
                  label="Require Resume / CV attachment"
                  isChecked={formData.requireResume}
                  onChange={(e) => setFormData({ ...formData, requireResume: e.target.checked })}
                />
              </Stack>
            </Card>
          )}

          {/* STEP 6: REVIEW & PUBLISH */}
          {step === 6 && (
            <Card variant="glass" padding="6">
              <Stack gap="6">
                <Badge variant="success">Step 6 of 6: Review & Publish Position</Badge>
                <Card variant="soft" padding="6">
                  <Stack gap="3">
                    <h2 className="rc-h2">{formData.title || "Junior Data & Frontend Engineer"}</h2>
                    <span className="rc-small">{formData.category} • {formData.location} • {formData.workMode}</span>
                    <span className="rc-label" style={{ color: 'var(--rc-color-green-accent)' }}>{formData.salary}</span>
                    <p className="rc-body" style={{ fontSize: '0.9375rem' }}>{formData.description || "Join our team to build accessible React applications."}</p>
                    <Cluster gap="2">
                      {formData.skillsList.map(sk => <Tag key={sk}>{sk}</Tag>)}
                    </Cluster>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          )}

          {/* Navigation Controls */}
          <Cluster justify="between" align="center">
            {step > 1 ? (
              <Button variant="ghost" onClick={handlePrev} leftIcon={<ArrowLeft size={16} />}>
                Previous Step
              </Button>
            ) : <div />}

            {step < 6 ? (
              <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
                Next Step
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={handlePublish} rightIcon={<Send size={18} />}>
                Publish Position Now
              </Button>
            )}
          </Cluster>
        </Stack>
      </PageContainer>
    </Section>
  );
}
