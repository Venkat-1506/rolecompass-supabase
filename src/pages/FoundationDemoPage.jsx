import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Stack } from '../components/layout/Stack.jsx';
import { Grid } from '../components/layout/Grid.jsx';
import { Cluster } from '../components/layout/Cluster.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { IconButton } from '../components/ui/IconButton.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Textarea } from '../components/ui/Textarea.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Checkbox } from '../components/ui/Checkbox.jsx';
import { Radio } from '../components/ui/Radio.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Tag } from '../components/ui/Tag.jsx';
import { Avatar } from '../components/ui/Avatar.jsx';
import { Progress } from '../components/ui/Progress.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { Divider } from '../components/ui/Divider.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { Toast } from '../components/ui/Toast.jsx';
import { GlassPanel } from '../components/glass/GlassPanel.jsx';
import { GlassCard } from '../components/glass/GlassCard.jsx';
import { useApp } from '../app/providers/AppProviders.jsx';
import { mockCompanies } from '../data/companies.js';
import { mockJobs } from '../data/jobs.js';
import { mockCandidateUser } from '../data/users.js';
import { calculateRoleCompassFit } from '../data/matching.js';
import { Compass, Sparkles, Check, Search, Shield, ArrowRight } from 'lucide-react';

export function FoundationDemoPage() {
  const { bgIntensity, setBgIntensity } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const [chkVal, setChkVal] = useState(true);
  const [radioVal, setRadioVal] = useState('option1');
  const [btnLoading, setBtnLoading] = useState(false);

  const demoFit = calculateRoleCompassFit(mockCandidateUser, mockJobs[0]);

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="8">
          {/* Header Banner */}
          <GlassPanel level={3} padding="8">
            <Cluster justify="between" align="center" style={{ marginBottom: 'var(--rc-space-4)' }}>
              <div className="rc-flex rc-items-center rc-gap-3">
                <div style={{ padding: '10px', background: 'var(--rc-color-green-accent)', color: '#fff', borderRadius: '12px' }}>
                  <Compass size={28} />
                </div>
                <div>
                  <h1 className="rc-h1">RoleCompass Foundation Test Bench</h1>
                  <p className="rc-small">Phase 0 Basement Verification & Design System Inspection</p>
                </div>
              </div>
              <Badge variant="success" icon={<Sparkles size={14} />}>
                Phase 0 Verified
              </Badge>
            </Cluster>

            {/* Background Intensity Switcher */}
            <Divider margin="4" />
            <Cluster align="center" gap="4">
              <span className="rc-label">Atmospheric Background Intensity:</span>
              <Cluster gap="2">
                {['low', 'medium', 'high'].map(intensity => (
                  <Button
                    key={intensity}
                    variant={bgIntensity === intensity ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setBgIntensity(intensity)}
                  >
                    {intensity.toUpperCase()}
                  </Button>
                ))}
              </Cluster>
            </Cluster>
          </GlassPanel>

          {/* 1. TYPOGRAPHY SYSTEM */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>1. Typography Hierarchy</h2>
            <Stack gap="3">
              <div><span className="rc-caption">Display</span><p className="rc-display">Career Navigation System</p></div>
              <div><span className="rc-caption">H1</span><h1 className="rc-h1">Discover Your Ideal Role Fit</h1></div>
              <div><span className="rc-caption">H2</span><h2 className="rc-h2">Skill Gaps & Recommended Learning</h2></div>
              <div><span className="rc-caption">H3</span><h3 className="rc-h3">Associate Software Engineer - Frontend</h3></div>
              <div><span className="rc-caption">Body</span><p className="rc-body">RoleCompass connects your profile, career preferences, skill readiness, and application tracking into one seamless journey.</p></div>
              <div><span className="rc-caption">Small</span><p className="rc-small">Posted 2 days ago • Bengaluru, KA • Hybrid</p></div>
            </Stack>
          </Card>

          {/* 2. GLASS DESIGN SYSTEM HIERARCHY */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>2. Glass Hierarchy Levels (Material Elevation)</h2>
            <Grid cols="responsive-4" gap="4">
              <GlassCard level={1}>
                <Badge variant="default">Level 1 — Solid</Badge>
                <h3 className="rc-h3" style={{ marginTop: '12px' }}>Primary Content</h3>
                <p className="rc-small">Used for main job details, forms, and critical action cards.</p>
              </GlassCard>

              <GlassCard level={2}>
                <Badge variant="info">Level 2 — Soft Glass</Badge>
                <h3 className="rc-h3" style={{ marginTop: '12px' }}>Supporting Surface</h3>
                <p className="rc-small">Used for secondary info cards, filters, and metadata overlays.</p>
              </GlassCard>

              <GlassCard level={3}>
                <Badge variant="success">Level 3 — Strong Glass</Badge>
                <h3 className="rc-h3" style={{ marginTop: '12px' }}>RoleCompass Fit</h3>
                <p className="rc-small">Used for matched skills, profile reveal, and premium contextual panels.</p>
              </GlassCard>

              <GlassCard level={4}>
                <Badge variant="warning">Level 4 — Atmospheric</Badge>
                <h3 className="rc-h3" style={{ marginTop: '12px' }}>Background Depth</h3>
                <p className="rc-small">Used for background layering, ambient surfaces, and structural depth.</p>
              </GlassCard>
            </Grid>
          </Card>

          {/* 3. BUTTON & ACTION PRIMITIVES */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>3. Button & Action Primitives</h2>
            <Stack gap="4">
              <Cluster gap="3" align="center">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="tertiary">Tertiary Action</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Action</Button>
              </Cluster>
              <Cluster gap="3" align="center">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large Button</Button>
                <Button
                  variant="primary"
                  isLoading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  {btnLoading ? 'Processing...' : 'Click to Test Loading'}
                </Button>
                <IconButton icon={<Search size={18} />} ariaLabel="Search" />
              </Cluster>
            </Stack>
          </Card>

          {/* 4. FORM PRIMITIVES */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>4. Form Primitives</h2>
            <Grid cols="responsive-2" gap="6">
              <Stack gap="4">
                <Input
                  label="Target Job Title"
                  placeholder="e.g. Frontend Engineer"
                  isRequired
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leftIcon={<Search size={16} />}
                  helperText="Enter the primary role you are discovering."
                />

                <Input
                  label="Email Address (Success State)"
                  value="arjun.verma@rolecompass.demo"
                  isSuccess
                  readOnly
                  helperText="Verified candidate account email."
                />

                <Input
                  label="Experience Years (Error State)"
                  value="-5"
                  errorText="Years of experience cannot be negative."
                />
              </Stack>

              <Stack gap="4">
                <Select
                  label="Preferred Work Mode"
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  options={[
                    { value: 'hybrid', label: 'Hybrid (Office + Remote)' },
                    { value: 'remote', label: '100% Remote' },
                    { value: 'onsite', label: 'On-Site' }
                  ]}
                  isRequired
                />

                <Textarea
                  label="Career Objective & Notes"
                  placeholder="Describe your career focus..."
                  rows={3}
                />

                <Cluster gap="6">
                  <Checkbox
                    label="Fresher / Entry Level Candidate"
                    isChecked={chkVal}
                    onChange={(e) => setChkVal(e.target.checked)}
                  />
                  <Radio
                    name="expType"
                    value="option1"
                    label="Full-Time"
                    isChecked={radioVal === 'option1'}
                    onChange={(e) => setRadioVal(e.target.value)}
                  />
                  <Radio
                    name="expType"
                    value="option2"
                    label="Internship"
                    isChecked={radioVal === 'option2'}
                    onChange={(e) => setRadioVal(e.target.value)}
                  />
                </Cluster>
              </Stack>
            </Grid>
          </Card>

          {/* 5. DATA MODELS & MATCHING FOUNDATION */}
          <Grid cols="responsive-2" gap="6">
            <GlassCard level={3}>
              <Cluster justify="between" align="center" style={{ marginBottom: '12px' }}>
                <span className="rc-caption">RoleCompass Fit Preview</span>
                <Badge variant="success">{demoFit.fitScore}% Fit Match</Badge>
              </Cluster>
              <h3 className="rc-h3" style={{ marginBottom: '8px' }}>{mockJobs[0].title}</h3>
              <p className="rc-small" style={{ marginBottom: '16px' }}>{mockJobs[0].salary} • {mockJobs[0].location}</p>

              <Stack gap="3">
                <div>
                  <span className="rc-label">Matched Skills:</span>
                  <Cluster gap="2" style={{ marginTop: '6px' }}>
                    {demoFit.matchedSkills.map(sk => (
                      <Tag key={sk} icon={<Check size={14} color="var(--rc-color-green-accent)" />}>{sk}</Tag>
                    ))}
                  </Cluster>
                </div>
                <div>
                  <span className="rc-label">Skills to Prepare:</span>
                  <Cluster gap="2" style={{ marginTop: '6px' }}>
                    {demoFit.missingRequiredSkills.map(sk => (
                      <Badge key={sk} variant="warning">{sk}</Badge>
                    ))}
                  </Cluster>
                </div>
                <Progress value={demoFit.fitScore} showLabel />
              </Stack>
            </GlassCard>

            <Card variant="solid">
              <span className="rc-caption">Fresher-Friendly Candidate Model</span>
              <Cluster align="center" gap="4" style={{ marginTop: '12px', marginBottom: '16px' }}>
                <Avatar name={mockCandidateUser.personal.fullName} size="lg" />
                <div>
                  <h3 className="rc-h3">{mockCandidateUser.personal.fullName}</h3>
                  <p className="rc-small">{mockCandidateUser.personal.title}</p>
                </div>
              </Cluster>
              <Stack gap="2">
                <p className="rc-body" style={{ fontSize: '0.875rem' }}>{mockCandidateUser.personal.bio}</p>
                <Divider margin="2" />
                <span className="rc-label">Education:</span>
                <p className="rc-small">{mockCandidateUser.education[0].degree} — {mockCandidateUser.education[0].institution}</p>
              </Stack>
            </Card>
          </Grid>

          {/* 6. COMPANY LOGO SYSTEM */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>6. Company Logo System & Asset Manifest</h2>
            <Grid cols="responsive-4" gap="4">
              {mockCompanies.slice(0, 8).map(comp => (
                <div key={comp.id} className="rc-flex rc-items-center rc-gap-3" style={{ padding: '8px', border: '1px solid var(--rc-color-soft-slate-200)', borderRadius: '8px' }}>
                  <Avatar name={comp.name} size="md" />
                  <div>
                    <h4 className="rc-label" style={{ fontSize: '0.875rem' }}>{comp.name}</h4>
                    <span className="rc-small" style={{ fontSize: '0.75rem' }}>{comp.industry}</span>
                  </div>
                </div>
              ))}
            </Grid>
          </Card>

          {/* 7. LOADING, ERROR, EMPTY STATES & TOAST */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>7. Data & UI Feedback States</h2>
            <Grid cols="responsive-3" gap="6">
              <Stack gap="3">
                <span className="rc-label">Skeleton Loading State:</span>
                <Skeleton height="24px" width="70%" />
                <Skeleton height="16px" width="100%" />
                <Skeleton height="16px" width="90%" />
              </Stack>

              <Stack gap="3">
                <span className="rc-label">Toast Notifications:</span>
                <Toast type="success" message="Role profile saved successfully!" />
                <Toast type="warning" message="Skill gap identified in Web Performance." />
              </Stack>

              <Stack gap="3">
                <span className="rc-label">Empty State Primitive:</span>
                <EmptyState title="No Applications Yet" description="Explore roles and check your RoleCompass Fit." />
              </Stack>
            </Grid>
          </Card>
        </Stack>
      </PageContainer>
    </Section>
  );
}
