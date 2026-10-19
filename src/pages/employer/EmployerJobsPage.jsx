import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { Plus, MapPin, Briefcase, Users, Eye } from 'lucide-react';

export function EmployerJobsPage() {
  const { jobs, employerUser, applications } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ACTIVE');

  const myCompanyJobs = jobs.filter(j => j.companyId === (employerUser.companyId || 'zoho'));

  const filteredJobs = myCompanyJobs.filter(j => {
    if (activeTab === 'ACTIVE') return j.status === 'Active';
    if (activeTab === 'DRAFT') return j.status === 'Draft';
    if (activeTab === 'CLOSED') return j.status === 'Closed';
    return true;
  });

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          <Cluster justify="between" align="center">
            <div>
              <span className="rc-caption">Job Management</span>
              <h1 className="rc-h1">Manage Published Positions</h1>
              <p className="rc-small">Post new roles, edit requirements, and review active listings.</p>
            </div>

            <Link to="/employer/jobs/create">
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                Post New Job
              </Button>
            </Link>
          </Cluster>

          <Tabs
            activeTabId={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'ACTIVE', label: 'Active Jobs', badge: myCompanyJobs.filter(j => j.status === 'Active').length },
              { id: 'DRAFT', label: 'Drafts', badge: myCompanyJobs.filter(j => j.status === 'Draft').length },
              { id: 'CLOSED', label: 'Closed Jobs', badge: myCompanyJobs.filter(j => j.status === 'Closed').length }
            ]}
          />

          <Grid cols="responsive-2" gap="6" className="rc-stagger-grid">
            {filteredJobs.map((job) => {
              const appCount = applications.filter(a => a.jobId === job.id).length;
              return (
                <Card key={job.id} variant="glass" isHoverable>
                  <Stack gap="4">
                    <Cluster justify="between" align="start">
                      <div>
                        <Badge variant={job.status === 'Active' ? 'success' : 'default'}>{job.status}</Badge>
                        <h3 className="rc-h3" style={{ marginTop: '4px' }}>{job.title}</h3>
                        <span className="rc-small">{job.category} • Posted {job.postedDate}</span>
                      </div>
                      <Badge variant="info" icon={<Users size={12} />}>{appCount} Applicants</Badge>
                    </Cluster>

                    <Cluster gap="3">
                      <span className="rc-small rc-flex rc-items-center rc-gap-1"><MapPin size={14} />{job.location}</span>
                      <span className="rc-small rc-flex rc-items-center rc-gap-1"><Briefcase size={14} />{job.experience}</span>
                      <span className="rc-small" style={{ fontWeight: 600 }}>{job.salary}</span>
                    </Cluster>

                    <Cluster gap="2">
                      {(job.skills || []).slice(0, 3).map(sk => <Tag key={sk}>{sk}</Tag>)}
                    </Cluster>

                    <Cluster justify="between" align="center" style={{ paddingTop: '12px', borderTop: '1px solid var(--rc-color-soft-slate-100)' }}>
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="ghost" size="sm" icon={<Eye size={14} />}>Public View</Button>
                      </Link>
                      <Link to={`/employer/candidates`}>
                        <Button variant="secondary" size="sm">Review Applicants ({appCount})</Button>
                      </Link>
                    </Cluster>
                  </Stack>
                </Card>
              );
            })}
          </Grid>
        </Stack>
      </PageContainer>
    </Section>
  );
}
