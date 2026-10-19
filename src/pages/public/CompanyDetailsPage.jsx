import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { JobCard } from '../../components/cards/JobCard.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { MapPin, Globe, Users, Building2, ExternalLink, ArrowLeft } from 'lucide-react';
import '../../styles/glass.css';
import '../../styles/motion.css';

export function CompanyDetailsPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { companies, jobs } = useApp();

  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  const cleanId = String(companyId || '').toLowerCase().trim();
  const company = companies.find(c => c && c.id.toLowerCase() === cleanId);
  if (!company) {
    return (
      <Section py="10">
        <PageContainer size="md">
          <ErrorState
            title="Company Profile Not Found"
            description={`No company record matching ID "${companyId}".`}
            onRetry={() => navigate('/companies')}
          />
        </PageContainer>
      </Section>
    );
  }

  const companyJobs = jobs.filter(j => j && j.companyId.toLowerCase() === company.id.toLowerCase());

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          {/* Breadcrumb Navigation with Entrance Animation */}
          <ScrollReveal variant="fade-in">
            <Cluster align="center" gap="2" className="rc-small">
              <Link to="/companies" className="rc-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} /> Companies
              </Link>
              <span>/</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{company.name}</span>
            </Cluster>
          </ScrollReveal>

          {/* Company Profile Header Card with Slide-Up Animation */}
          <ScrollReveal variant="slide-up" delay={100}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '24px',
              padding: 'clamp(24px, 4vw, 36px)',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
            }}>
              <Stack gap="6">
                <Cluster justify="between" align="start">
                  <div className="rc-flex rc-items-start rc-gap-4">
                    <CompanyLogoWithFallback companyId={company.id} name={company.name} logo={company.logo} size="lg" variant="circle" />
                    <div>
                      <h1 className="rc-h1" style={{ fontSize: '2.2rem', fontWeight: 800 }}>{company.name}</h1>
                      <div className="rc-flex rc-items-center rc-gap-3" style={{ marginTop: '6px' }}>
                        <Badge variant="info">{company.industry}</Badge>
                        <span className="rc-small" style={{ fontWeight: '600' }}>{company.location}</span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Globe size={15} /> Visit Website <ExternalLink size={14} />
                  </a>
                </Cluster>

                <p className="rc-body" style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.65' }}>
                  {company.description}
                </p>

                {/* Metadata Grid */}
                <Grid cols="responsive-3" gap="4" style={{ background: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.85)' }}>
                  <div className="rc-flex rc-items-center rc-gap-3">
                    <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '10px', color: '#059669' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <span className="rc-caption" style={{ fontWeight: '700', color: '#64748b' }}>Industry</span>
                      <div className="rc-label" style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>{company.industry}</div>
                    </div>
                  </div>
                  
                  <div className="rc-flex rc-items-center rc-gap-3">
                    <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '10px', color: '#0284c7' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="rc-caption" style={{ fontWeight: '700', color: '#64748b' }}>Headquarters</span>
                      <div className="rc-label" style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>{company.location}</div>
                    </div>
                  </div>

                  <div className="rc-flex rc-items-center rc-gap-3">
                    <div style={{ background: '#faf5ff', padding: '10px', borderRadius: '10px', color: '#7b2cbf' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <span className="rc-caption" style={{ fontWeight: '700', color: '#64748b' }}>Company Size</span>
                      <div className="rc-label" style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>{company.size}</div>
                    </div>
                  </div>
                </Grid>
              </Stack>
            </div>
          </ScrollReveal>

          {/* Open Jobs List with Staggered Scroll Animations */}
          <ScrollReveal variant="slide-up" delay={200}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Open Positions at {company.name}
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                    Company-specific career catalogue. Or browse the general mixed feed on <Link to="/jobs" style={{ color: '#059669', fontWeight: '700', textDecoration: 'none' }}>Find Jobs →</Link>
                  </p>
                </div>
                <Badge variant="success" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  {companyJobs.length} Active Positions
                </Badge>
              </div>

              {companyJobs.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px'
                }}>
                  {companyJobs.map((j, idx) => (
                    <ScrollReveal key={j.id} variant="slide-up" delay={(idx % 3) * 100}>
                      <JobCard job={j} onApply={(jobToApply) => setSelectedJobToApply(jobToApply)} />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Active Job Openings"
                  description={`${company.name} does not currently have any active postings listed on RoleCompass.`}
                />
              )}
            </div>
          </ScrollReveal>
        </Stack>
      </PageContainer>

      {/* Application Modal */}
      {selectedJobToApply && (
        <ApplicationModal
          job={selectedJobToApply}
          isOpen={!!selectedJobToApply}
          onClose={() => setSelectedJobToApply(null)}
        />
      )}
    </Section>
  );
}
