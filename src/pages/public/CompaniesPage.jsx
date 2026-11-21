import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { fuzzyMatch } from '../../utils/helpers.js';
import {
  Search,
  MapPin,
  Briefcase,
  ArrowUpRight,
  ArrowRight,
  X,
  Building2,
  Sparkles,
} from 'lucide-react';
import '../../styles/glass.css';
import '../../styles/motion.css';

export function CompaniesPage() {
  const navigate = useNavigate();
  const { companies, jobs } = useApp();
  const [query, setQuery] = useState('');
  const primarySeqRef = useRef(null);
  const [sequenceWidth, setSequenceWidth] = useState(0);

  // Filter companies by name, industry, description, or location using flexible fuzzy match
  const filteredCompanies = (companies || []).filter((c) => {
    if (!query.trim()) return true;
    const q = query.trim();
    return (
      fuzzyMatch(c.name, q) ||
      fuzzyMatch(c.industry, q) ||
      fuzzyMatch(c.description, q) ||
      (c.location && fuzzyMatch(c.location, q))
    );
  });

  // Top companies for trusted logo rail
  const railCompanyIds = [
    'google',
    'microsoft',
    'amazon',
    'adobe',
    'nvidia',
    'netflix',
    'spotify',
    'airbnb',
    'uber',
    'github',
    'paypal',
    'cisco',
    'zoho',
    'freshworks',
    'accenture',
    'tcs',
    'flipkart',
    'phonepe',
  ];
  const railCompanies = railCompanyIds
    .map((id) => (companies || []).find((c) => c && c.id === id))
    .filter(Boolean);

  // Calculate the exact pixel translation distance of one complete sequence including spacing
  useEffect(() => {
    const measure = () => {
      if (primarySeqRef.current) {
        const rect = primarySeqRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setSequenceWidth(Math.round(rect.width));
        }
      }
    };

    measure();

    let observer;
    if (typeof ResizeObserver !== 'undefined' && primarySeqRef.current) {
      observer = new ResizeObserver(() => measure());
      observer.observe(primarySeqRef.current);
    }

    window.addEventListener('resize', measure);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [railCompanies.length]);

  return (
    <Section py="8" className="rc-companies-page">
      <PageContainer size="lg">
        {/* HERO SECTION WITH ATMOSPHERIC LIGHT FIELD */}
        <div style={{ position: 'relative', marginBottom: '36px' }}>
          {/* Ambient Glow Orb behind Hero Header */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '10%',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(134, 239, 172, 0.45) 0%, rgba(186, 230, 253, 0.2) 50%, rgba(255, 255, 255, 0) 75%)',
              filter: 'blur(45px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
            <ScrollReveal variant="slide-up">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#059669',
                    background: 'rgba(236, 253, 245, 0.9)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    padding: '6px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(167, 243, 208, 0.8)',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={13} color="#059669" /> COMPANYS DIRECTORY
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  fontWeight: '800',
                  color: '#0f172a',
                  letterSpacing: '-0.035em',
                  lineHeight: '1.12',
                  marginBottom: '14px',
                }}
              >
                Explore Top Hiring <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #0284c7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Organizations
                </span>
              </h1>

              <p
                style={{
                  color: '#475569',
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  fontWeight: '500',
                  maxWidth: '660px',
                }}
              >
                Discover leading tech companies, research culture and workplace insights, browse
                active positions, and connect your candidate profile.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* SEARCH WORKSPACE BAR (SCALE-UP ENTRANCE) */}
        <ScrollReveal variant="scale-up" delay={150}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderRadius: '18px',
              padding: '8px 12px 8px 20px',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow:
                '0 12px 36px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
              maxWidth: '740px',
              transition: 'all 0.2s ease',
            }}
          >
            <Search size={20} color="#059669" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search companies by name, industry, location, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.98rem',
                color: '#0f172a',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: '500',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '4px',
                }}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            <button
              style={{
                background: '#059669',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.92rem',
                padding: '10px 22px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                flexShrink: 0,
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Search <ArrowRight size={16} />
            </button>
          </div>
        </ScrollReveal>

        {/* TRUSTED COMPANY LOGO STRIP (CONTINUOUS MARQUEE RAIL WITH FADE ENTRANCE) */}
        <ScrollReveal variant="fade-in" delay={200}>
          <div className="rc-logo-marquee-banner">
            <span className="rc-logo-marquee-label">Trusted by Top Tech Employers</span>

            <div className="rc-logo-marquee-container">
              <div
                className="rc-logo-marquee-track"
                style={{
                  '--marquee-distance': sequenceWidth ? `-${sequenceWidth}px` : '-50%',
                  animationDuration: sequenceWidth
                    ? `${Math.max(28, Math.round(sequenceWidth / 70))}s`
                    : '45s',
                }}
              >
                {/* Primary Sequence */}
                <div className="rc-marquee-group" ref={primarySeqRef}>
                  {railCompanies.map((c) => (
                    <div
                      key={`rail-seq1-${c.id}`}
                      className="rc-marquee-item"
                      onClick={() => navigate(`/companies/${c.id}`)}
                      title={`View ${c.name} Profile`}
                    >
                      <CompanyLogoWithFallback
                        companyId={c.id}
                        name={c.name}
                        logo={c.logo}
                        size="md"
                        variant="transparent"
                      />
                    </div>
                  ))}
                </div>

                {/* Identical Cloned Sequence for Seamless Infinite Scrolling */}
                <div className="rc-marquee-group" aria-hidden="true">
                  {railCompanies.map((c) => (
                    <div
                      key={`rail-seq2-${c.id}`}
                      className="rc-marquee-item"
                      onClick={() => navigate(`/companies/${c.id}`)}
                      title={`View ${c.name} Profile`}
                    >
                      <CompanyLogoWithFallback
                        companyId={c.id}
                        name={c.name}
                        logo={c.logo}
                        size="md"
                        variant="transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* RESULTS HEADER & COUNTER */}
        <ScrollReveal variant="slide-up" delay={100}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.4rem',
                fontWeight: '800',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Featured Hiring Organizations
            </h2>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#059669',
                background: 'rgba(236, 253, 245, 0.9)',
                border: '1px solid #a7f3d0',
                padding: '6px 14px',
                borderRadius: '10px',
              }}
            >
              {filteredCompanies.length} Companies Listed
            </span>
          </div>
        </ScrollReveal>

        {/* COMPANY DIRECTORY GRID WITH STAGGERED SCROLL REVEAL ANIMATIONS */}
        {filteredCompanies.length === 0 ? (
          <ScrollReveal variant="scale-up">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(24px)',
                borderRadius: '24px',
                padding: '52px 24px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                maxWidth: '560px',
                margin: '20px auto',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Building2 size={44} color="#94a3b8" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                No matching companies found
              </h3>
              <p
                style={{
                  color: '#64748b',
                  fontSize: '0.92rem',
                  marginTop: '6px',
                  lineHeight: '1.5',
                }}
              >
                We couldn't find any hiring organizations matching "{query}". Try adjusting your
                keywords or clearing the search filter.
              </p>
              <button
                onClick={() => setQuery('')}
                style={{
                  marginTop: '20px',
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                }}
              >
                Clear Search Filter
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredCompanies.map((c, idx) => {
              const openJobsCount = jobs.filter((j) => j.companyId === c.id).length;

              return (
                <ScrollReveal key={c.id} variant="slide-up" delay={(idx % 4) * 80}>
                  <div
                    onClick={() => navigate(`/companies/${c.id}`)}
                    className="rc-company-card rc-glass-hoverable"
                    style={{
                      background: 'rgba(255, 255, 255, 0.48)',
                      backdropFilter: 'blur(22px)',
                      WebkitBackdropFilter: 'blur(22px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.75)',
                      boxShadow:
                        '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '18px',
                      cursor: 'pointer',
                      height: '100%',
                      boxSizing: 'border-box',
                      transition:
                        'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), boxShadow 0.2s ease, borderColor 0.2s ease',
                    }}
                  >
                    {/* TOP: LOGO + NAME + INDUSTRY */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          marginBottom: '14px',
                        }}
                      >
                        <CompanyLogoWithFallback
                          companyId={c.id}
                          name={c.name}
                          logo={c.logo}
                          size="md"
                          variant="square"
                        />
                        <div style={{ overflow: 'hidden' }}>
                          <h3
                            style={{
                              fontSize: '1.125rem',
                              fontWeight: '800',
                              color: '#0f172a',
                              margin: 0,
                              lineHeight: '1.25',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {c.name}
                          </h3>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              color: '#059669',
                              fontWeight: '700',
                              marginTop: '3px',
                              display: 'inline-block',
                            }}
                          >
                            {c.industry}
                          </span>
                        </div>
                      </div>

                      {/* MIDDLE: DESCRIPTION */}
                      <p
                        style={{
                          fontSize: '0.88rem',
                          color: '#475569',
                          lineHeight: '1.5',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {c.description}
                      </p>
                    </div>

                    {/* BOTTOM: JOBS COUNT + LOCATION + CIRCULAR ARROW */}
                    <div
                      style={{
                        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
                        paddingTop: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: '800',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Briefcase size={14} color="#059669" /> {openJobsCount} Open Jobs
                        </span>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            color: '#64748b',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <MapPin size={12} /> {c.location ? c.location.split('/')[0] : 'India'}
                        </span>
                      </div>

                      <div
                        className="rc-company-arrow"
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'rgba(236, 253, 245, 0.95)',
                          color: '#059669',
                          border: '1px solid rgba(167, 243, 208, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 200ms ease',
                        }}
                      >
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </PageContainer>
    </Section>
  );
}
