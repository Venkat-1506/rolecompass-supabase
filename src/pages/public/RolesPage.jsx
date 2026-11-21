import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { fuzzyMatch } from '../../utils/helpers.js';
import { Search, ArrowRight, BookOpen, X, Compass } from 'lucide-react';
import '../../styles/glass.css';

export function RolesPage() {
  const { roles, jobs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Real-time Role Filtering
  const filteredRoles = (roles || []).filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim();
    return (
      fuzzyMatch(r.title, q) ||
      fuzzyMatch(r.category, q) ||
      fuzzyMatch(r.overview, q) ||
      (r.coreSkills || []).some((sk) => fuzzyMatch(sk, q))
    );
  });

  return (
    <Section py="8" className="rc-roles-page">
      <PageContainer size="lg">
        <Stack gap="6">
          {/* HEADER & SMALL SEARCH BAR CLUSTER */}
          <Cluster justify="between" align="flex-end" style={{ flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="rc-caption">Career Navigation Directory</span>
              <h1
                className="rc-h1"
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
                  fontWeight: '800',
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  marginTop: '4px',
                }}
              >
                Discover & Understand Career Roles
              </h1>
              <p
                className="rc-small"
                style={{ color: '#475569', fontSize: '1rem', marginTop: '4px' }}
              >
                Explore key responsibilities, required core skills, and learning paths for industry
                roles.
              </p>
            </div>

            {/* SMALL GLASS SEARCH BAR */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '14px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                maxWidth: '380px',
                width: '100%',
              }}
            >
              <Search size={16} color="#059669" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search roles by title, skill, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  width: '100%',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    padding: '2px',
                    display: 'flex',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </Cluster>

          {/* COUNTER & EMPTY STATE */}
          {filteredRoles.length === 0 ? (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '40px 24px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                maxWidth: '520px',
                margin: '20px auto',
              }}
            >
              <Compass size={36} color="#94a3b8" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                No matching career roles
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
                No roles matched "{searchQuery}". Try searching for another role title or skill.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  marginTop: '16px',
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <Grid cols="responsive-2" gap="6">
              {filteredRoles.map((r) => {
                const relatedJobsCount = jobs.filter(
                  (j) =>
                    (r.relatedJobIds || []).includes(j.id) ||
                    j.category === r.category ||
                    j.title.toLowerCase().includes(r.title.toLowerCase().split(' ')[0]),
                ).length;

                return (
                  <Card
                    key={r.id}
                    variant="solid"
                    isHoverable
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      width: '100%',
                      padding: '24px',
                    }}
                  >
                    <Stack gap="4">
                      <Cluster justify="between" align="center">
                        <Badge variant="info">{r.category}</Badge>
                        <span className="rc-small" style={{ fontWeight: 600, color: '#64748b' }}>
                          {relatedJobsCount || 3} Matching Jobs
                        </span>
                      </Cluster>

                      <div>
                        <h2 className="rc-h2" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                          <Link
                            to={`/roles/${r.id}`}
                            style={{ color: '#0f172a', textDecoration: 'none' }}
                          >
                            {r.title}
                          </Link>
                        </h2>
                        <p
                          className="rc-body"
                          style={{
                            marginTop: '6px',
                            fontSize: '0.92rem',
                            color: '#475569',
                            lineHeight: '1.5',
                          }}
                        >
                          {r.overview}
                        </p>
                      </div>

                      <div style={{ width: '100%', boxSizing: 'border-box' }}>
                        <span
                          className="rc-label"
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            color: '#64748b',
                            marginBottom: '8px',
                            display: 'block',
                          }}
                        >
                          Core Required Skills:
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            width: '100%',
                            boxSizing: 'border-box',
                          }}
                        >
                          {(r.coreSkills || []).map((sk) => (
                            <Tag key={sk}>{sk}</Tag>
                          ))}
                        </div>
                      </div>

                      <Cluster
                        justify="between"
                        align="center"
                        style={{
                          paddingTop: 'var(--rc-space-3)',
                          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
                        }}
                      >
                        <Link to={`/candidate/learning`} style={{ textDecoration: 'none' }}>
                          <span
                            className="rc-small rc-link rc-flex rc-items-center rc-gap-1"
                            style={{ color: '#059669', fontWeight: '700' }}
                          >
                            <BookOpen size={14} /> Learning Paths
                          </span>
                        </Link>

                        <Link to={`/roles/${r.id}`} style={{ textDecoration: 'none' }}>
                          <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                            Understand Role
                          </Button>
                        </Link>
                      </Cluster>
                    </Stack>
                  </Card>
                );
              })}
            </Grid>
          )}
        </Stack>
      </PageContainer>
    </Section>
  );
}
