import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { RoleCompassFit } from '../../components/cards/RoleCompassFit.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { MapPin, Briefcase, Bookmark, ArrowRight, Building2, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

export function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobs, companies, savedJobs, toggleSaveJob, getJobFit, applications, candidateUser, isAuthenticated } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(() => {
    return searchParams.get('apply') === 'true' && isAuthenticated;
  });

  useEffect(() => {
    if (searchParams.get('apply') === 'true' && isAuthenticated) {
      setIsApplyModalOpen(true);
    }
  }, [searchParams, isAuthenticated]);

  const job = jobs.find(j => j.id === jobId);
  if (!job) {
    return (
      <Section py="10">
        <PageContainer size="md">
          <ErrorState
            title="Job Post Not Found"
            description={`We could not locate a job posting with ID "${jobId}". It may have been closed or unlisted.`}
            onRetry={() => navigate('/explore')}
          />
        </PageContainer>
      </Section>
    );
  }

  const company = companies.find(c => c.id === job.companyId) || { name: job.companyId };
  const fit = getJobFit(job.id);
  const isSaved = savedJobs.includes(job.id);
  const hasApplied = isAuthenticated && applications.some(a => a.jobId === job.id && a.candidateId === candidateUser?.id);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      const targetPath = `/jobs/${job.id}?apply=true`;
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    } else {
      setIsApplyModalOpen(true);
    }
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          {/* Breadcrumb Navigation */}
          <Cluster align="center" gap="2" className="rc-small">
            <Link to="/explore" className="rc-link">Explore</Link>
            <span>/</span>
            <span>{job.title}</span>
          </Cluster>

          {/* Job Overview Header Card */}
          <Card variant="solid" padding="8">
            <Stack gap="6">
              <Cluster justify="between" align="start">
                <div className="rc-flex rc-items-start rc-gap-4">
                  <CompanyLogoWithFallback companyId={job.companyId} name={company.name} logo={company.logo} size="lg" variant="circle" />
                  <div>
                    <h1 className="rc-h1">{job.title}</h1>
                    <div className="rc-flex rc-items-center rc-gap-3" style={{ marginTop: '4px' }}>
                      <Link to={`/companies/${job.companyId}`} className="rc-link" style={{ fontWeight: 600 }}>
                        {company.name}
                      </Link>
                      <span className="rc-small">• {job.category}</span>
                    </div>
                  </div>
                </div>

                <div className="rc-flex rc-items-center rc-gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSaveJob(job.id)}
                    className="rc-btn rc-btn-secondary rc-btn-sm"
                    style={{ color: isSaved ? 'var(--rc-color-green-accent)' : undefined }}
                  >
                    <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    <span>{isSaved ? "Saved" : "Save Job"}</span>
                  </button>

                  {hasApplied ? (
                    <Badge variant="info">Application Submitted</Badge>
                  ) : (
                    <Button variant="primary" onClick={handleApplyClick} rightIcon={<ArrowRight size={16} />}>
                      Apply Now
                    </Button>
                  )}
                </div>
              </Cluster>

              {/* Key Job Metadata Grid */}
              <Grid cols="responsive-4" gap="4" style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                padding: '16px',
                borderRadius: '14px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}>
                <div>
                  <span className="rc-caption">Location</span>
                  <div className="rc-flex rc-items-center rc-gap-1 rc-label" style={{ marginTop: '4px' }}>
                    <MapPin size={16} color="var(--rc-color-green-accent)" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div>
                  <span className="rc-caption">Work Mode & Type</span>
                  <div className="rc-label" style={{ marginTop: '4px' }}>
                    {job.workMode} • {job.employmentType}
                  </div>
                </div>
                <div>
                  <span className="rc-caption">Experience Level</span>
                  <div className="rc-flex rc-items-center rc-gap-1 rc-label" style={{ marginTop: '4px' }}>
                    <Briefcase size={16} color="var(--rc-color-green-accent)" />
                    <span>{job.experience}</span>
                  </div>
                </div>
                <div>
                  <span className="rc-caption">
                    {job.employmentType === 'Internship' ? 'Monthly Stipend' : 'Annual Compensation (CTC)'}
                  </span>
                  <div className="rc-label" style={{ marginTop: '4px', color: 'var(--rc-color-green-accent)', fontWeight: '800' }}>
                    {job.salary || (job.employmentType === 'Internship' ? 'Stipend not disclosed' : 'Competitive CTC')}
                  </div>
                </div>
              </Grid>

              {/* Benchmark Disclaimer */}
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
                * Illustrative demonstration compensation benchmark. Verified offers are established directly with employers.
              </div>
            </Stack>
          </Card>

          {/* Content Columns: Job Details (2 Cols) + RoleCompass Fit (1 Col) */}
          <Grid cols="responsive-3" gap="6">
            {/* Left 2 Columns: Description & Requirements */}
            <div className="rc-col-span-2-desktop">
              <Stack gap="6">
                <Card variant="solid" padding="8">
                  <Stack gap="6">
                    <div>
                      <h2 className="rc-h2" style={{ marginBottom: '12px' }}>About the Role</h2>
                      <p className="rc-body">{job.description}</p>
                    </div>

                    <div>
                      <h3 className="rc-h3" style={{ marginBottom: '12px' }}>Key Responsibilities</h3>
                      <Stack gap="2">
                        {(job.responsibilities || []).map((resp, idx) => (
                          <div key={idx} className="rc-flex rc-items-start rc-gap-3">
                            <CheckCircle2 size={18} color="var(--rc-color-green-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <p className="rc-body" style={{ fontSize: '0.9375rem' }}>{resp}</p>
                          </div>
                        ))}
                      </Stack>
                    </div>

                    <div>
                      <h3 className="rc-h3" style={{ marginBottom: '12px' }}>Required Education & Experience</h3>
                      <p className="rc-body">{job.education}</p>
                    </div>

                    <div>
                      <h3 className="rc-h3" style={{ marginBottom: '12px' }}>Required Skills & Competencies</h3>
                      <Cluster gap="2">
                        {(job.skills || []).map(sk => <Tag key={sk}>{sk}</Tag>)}
                      </Cluster>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </div>

            {/* Right Column: RoleCompass Fit & Company Quick Info */}
            <Stack gap="6">
              <RoleCompassFit fit={fit} />

              <Card variant="solid" padding="6">
                <Stack gap="4">
                  <h3 className="rc-h3">About {company.name}</h3>
                  <p className="rc-small">{company.description}</p>
                  <Stack gap="2" style={{ fontSize: '0.8125rem' }}>
                    <div>Industry: <strong>{company.industry}</strong></div>
                    <div>Size: <strong>{company.size}</strong></div>
                    <div>Website: <a href={company.website} target="_blank" rel="noreferrer" className="rc-link">{company.website}</a></div>
                  </Stack>
                  <Link to={`/companies/${company.id}`}>
                    <Button variant="secondary" size="sm" style={{ width: '100%' }}>View Company Profile</Button>
                  </Link>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Stack>
      </PageContainer>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <ApplicationModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </Section>
  );
}
