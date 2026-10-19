import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { GlassCard } from '../../components/glass/GlassCard.jsx';
import { JobCard } from '../../components/cards/JobCard.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { fuzzyMatch } from '../../utils/helpers.js';
import {
  Compass, Search, MapPin, ArrowRight, GraduationCap, Briefcase, Sparkles,
  Target, BookOpen, Send, DollarSign, Palette, ChevronDown, CheckCircle2,
  Layers, Code2, Cpu, TrendingUp, ArrowUpRight, ShieldCheck, Check, Clock, Building2, UserCheck
} from 'lucide-react';

import heroFemaleCutout from '../../assets/images/public/hero-female-professional-cutout.png';

export function HomePage() {
  const { jobs = [], companies = [], isAuthenticated } = useApp() || {};
  const navigate = useNavigate();
  const { hash } = useLocation();

  const getCategoryCount = (catKeyword) => {
    if (!jobs || jobs.length === 0) return 'Multiple Openings';
    const count = jobs.filter(j => {
      const jc = (j.category || '').toLowerCase();
      const sub = (j.subcategory || '').toLowerCase();
      const title = (j.title || '').toLowerCase();
      const kw = (catKeyword || '').toLowerCase();
      return jc.includes(kw) || sub.includes(kw) || title.includes(kw);
    }).length;
    return `${count || 3} Active Roles`;
  };

  useEffect(() => {
    if (hash === '#how-it-works' || window.location.hash === '#how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  const categories = ['All', 'Technology', 'Data & AI', 'Product', 'Design', 'Marketing', 'Sales', 'Finance', 'Operations', 'Cybersecurity', 'Consulting', 'Content'];

  const filteredJobs = (jobs || []).filter(j => {
    if (!j) return false;
    const company = (companies || []).find(c => c && c.id === j.companyId) || {};
    const companyName = company.name || j.company || '';

    const q = (searchQuery || '').trim();
    const matchesSearch = !q ||
      fuzzyMatch(j.title, q) ||
      fuzzyMatch(companyName, q) ||
      fuzzyMatch(j.location, q) ||
      (Array.isArray(j.skills) && j.skills.some(s => s && fuzzyMatch(s, q)));

    const matchesCategory = selectedCategory === 'All' || (() => {
      const jc = (j.category || '').toLowerCase();
      const sc = selectedCategory.toLowerCase();
      return jc === sc;
    })();
    return matchesSearch && matchesCategory;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const locParam = selectedLocation !== 'All Locations' ? selectedLocation : '';
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locParam)}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* 1. HERO SECTION — HIGH-END FROSTED GLASS ENVIRONMENT WITH TRANSPARENT FEMALE CUTOUT ON RIGHT */}
      <Section py="6" className="rc-hero-section">
        <PageContainer size="lg">
          <div
            className="rc-hero-banner"
            style={{
              background: 'rgba(255, 255, 255, 0.38)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow: '0 24px 60px 0 rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
              padding: 'clamp(32px, 5vw, 60px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* ABSTRACT TRANSLUCENT CURVED GLASS LAYER FOR HERO DEPTH */}
            <div style={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: '550px',
              height: '550px',
              borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
              background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.6) 0%, rgba(224, 242, 254, 0.35) 50%, rgba(255, 255, 255, 0) 80%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              transform: 'rotate(-12deg)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* EXPLICIT 2-COLUMN SIDE-BY-SIDE FLEX LAYOUT FOR DESKTOP */}
            <div className="rc-hero-grid-wrap" style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '48px',
              position: 'relative',
              zIndex: 2
            }}>

              {/* LEFT COLUMN: EDITORIAL CONTENT & INTEGRATED SEARCH BAR */}
              <div className="rc-hero-left-col" style={{ flex: '1 1 480px', maxWidth: '620px', zIndex: 3 }}>
                <ScrollReveal variant="slide-left" delay={100}>
                  <div className="rc-hero-eyebrow-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <span className="rc-animate-glow-pulse" style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#059669',
                      background: 'rgba(236, 253, 245, 0.85)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      padding: '6px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(167, 243, 208, 0.8)',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                    }}>
                      INTELLIGENT CAREER NAVIGATION
                    </span>
                  </div>

                  <h1 className="rc-display rc-hero-headline" style={{
                    fontSize: 'clamp(2.6rem, 5.2vw, 4.2rem)',
                    lineHeight: '1.08',
                    fontWeight: '800',
                    color: '#0f172a',
                    letterSpacing: '-0.03em',
                    marginBottom: '20px'
                  }}>
                    Finding the job <br />
                    <span style={{ color: '#0f172a' }}>beyond borders</span>
                  </h1>

                  <p className="rc-body rc-hero-description" style={{
                    fontSize: '1.125rem',
                    color: '#334155',
                    maxWidth: '500px',
                    lineHeight: '1.65',
                    marginBottom: '36px'
                  }}>
                    Discover job you love, research the fastest-growing companies, and start your career journey.
                  </p>

                  {/* INTEGRATED PREMIUM SEARCH CONTROL BAR */}
                  <form onSubmit={handleSearchSubmit} className="rc-hero-search-form" style={{ width: '100%', maxWidth: '580px' }}>
                    <div className="rc-hero-search-bar" style={{
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      padding: '8px 10px 8px 20px',
                      borderRadius: '14px',
                      boxShadow: '0 16px 40px -4px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.85)'
                    }}>
                      {/* Role / Company Input */}
                      <div className="rc-hero-search-input-wrap" style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={18} color="#64748b" />
                        <input
                          type="text"
                          placeholder="Search by company or role..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '0.95rem',
                            background: 'transparent',
                            color: '#0f172a',
                            fontWeight: '500'
                          }}
                        />
                      </div>

                      <div className="rc-hero-search-divider" style={{ width: '1px', height: '28px', background: 'rgba(203, 213, 225, 0.7)' }} />

                      {/* Location Select + Action button wrapper (display: contents on desktop, flex row on mobile) */}
                      <div className="rc-hero-search-action-row" style={{ display: 'contents' }}>
                        {/* Location Select Dropdown */}
                        <div className="rc-hero-search-loc-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
                          <MapPin size={18} color="#64748b" />
                          <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            style={{
                              border: 'none',
                              outline: 'none',
                              fontSize: '0.95rem',
                              background: 'transparent',
                              color: '#1e293b',
                              cursor: 'pointer',
                              fontWeight: '600',
                              paddingRight: '20px',
                              appearance: 'none',
                              width: '100%'
                            }}
                          >
                            <option value="All Locations">Location</option>
                            <option value="Bengaluru">Bengaluru</option>
                            <option value="Remote">Remote</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Mumbai">Mumbai</option>
                          </select>
                          <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '4px', pointerEvents: 'none' }} />
                        </div>

                        {/* Accent Search Action Button */}
                        <button
                          type="submit"
                          className="rc-hero-search-btn"
                          style={{
                            background: '#B8F23A', /* Vibrant RoleCompass Lime/Green Accent */
                            color: '#0f172a',
                            fontWeight: '800',
                            fontSize: '0.95rem',
                            padding: '12px 28px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            cursor: 'pointer',
                            boxShadow: '0 4px 18px rgba(184, 242, 58, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontFamily: 'Plus Jakarta Sans, sans-serif'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 22px rgba(184, 242, 58, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 18px rgba(184, 242, 58, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                          }}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </ScrollReveal>
              </div>

              {/* RIGHT COLUMN: TRANSPARENT FEMALE CUTOUT + FLOATING GLASS CARDS (SLIDES IN FROM RIGHT) */}
              <div className="rc-hero-right-col" style={{
                flex: '1 1 420px',
                position: 'relative',
                minHeight: '480px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                <ScrollReveal variant="slide-right" delay={200} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  {/* Glowing Ambient Light Field behind female photo */}
                  <div className="rc-hero-ambient-glow" style={{
                    position: 'absolute',
                    top: '12%',
                    right: '12%',
                    width: '360px',
                    height: '360px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(134, 239, 172, 0.65) 0%, rgba(184, 242, 58, 0.35) 50%, rgba(255, 255, 255, 0) 75%)',
                    filter: 'blur(40px)',
                    zIndex: 0
                  }} />

                  {/* TRANSPARENT FEMALE CUTOUT IMAGE (NO WHITE BOX BACKGROUND) */}
                  <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                  }}>
                    <img
                      src={heroFemaleCutout}
                      alt="RoleCompass Professional Employee"
                      className="rc-hero-cutout-img"
                      style={{
                        maxHeight: '480px',
                        width: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 20px 35px rgba(15, 23, 42, 0.16))'
                      }}
                    />
                  </div>

                  {/* CARD A: UI DESIGNER CARD (Top Left of Female Employee) */}
                  <div className="rc-animate-float rc-hero-card-designer" style={{
                    position: 'absolute',
                    top: '14%',
                    left: '-4%',
                    zIndex: 3
                  }}>
                    <div className="rc-hero-card-inner rc-hero-card-designer-inner" style={{
                      background: 'rgba(255, 255, 255, 0.58)',
                      backdropFilter: 'blur(22px)',
                      WebkitBackdropFilter: 'blur(22px)',
                      border: '1px solid rgba(255, 255, 255, 0.75)',
                      borderRadius: '14px',
                      padding: '12px 18px',
                      minWidth: '150px',
                      boxShadow: '0 12px 32px 0 rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div className="rc-hero-card-icon" style={{
                        background: 'rgba(224, 242, 254, 0.85)',
                        color: '#0284c7',
                        padding: '8px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Palette size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.2' }}>UI Designer</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>Design Team</div>
                      </div>
                    </div>
                  </div>

                  {/* CARD B: MANAGER CARD (Top Right of Female Employee) */}
                  <div className="rc-animate-float-reverse rc-hero-card-manager" style={{
                    position: 'absolute',
                    top: '6%',
                    right: '-2%',
                    zIndex: 3
                  }}>
                    <div className="rc-hero-card-inner rc-hero-card-manager-inner" style={{
                      background: 'rgba(255, 255, 255, 0.52)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.70)',
                      borderRadius: '14px',
                      padding: '10px 16px',
                      minWidth: '140px',
                      boxShadow: '0 10px 28px 0 rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div className="rc-hero-card-icon" style={{
                        background: 'rgba(236, 253, 245, 0.85)',
                        color: '#059669',
                        padding: '7px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.2' }}>Manager</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>Leadership</div>
                      </div>
                    </div>
                  </div>

                  {/* CARD C: MONTHLY SALARY CARD (Lower Right of Female Employee - Primary Data Card) */}
                  <div className="rc-animate-float rc-hero-card-salary" style={{
                    position: 'absolute',
                    bottom: '12%',
                    right: '-6%',
                    zIndex: 3
                  }}>
                    <div className="rc-hero-card-inner rc-hero-card-salary-inner" style={{
                      background: 'rgba(255, 255, 255, 0.68)',
                      backdropFilter: 'blur(26px)',
                      WebkitBackdropFilter: 'blur(26px)',
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      borderRadius: '18px',
                      padding: '18px 22px',
                      minWidth: '230px',
                      boxShadow: '0 16px 40px 0 rgba(15, 23, 42, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(236, 253, 245, 0.9)',
                          border: '1px solid #a7f3d0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <DollarSign size={13} color="#059669" />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.02em' }}>Monthly Salary</span>
                      </div>

                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginTop: '2px' }}>
                        $2,500 – $3,500
                      </div>

                      {/* Interactive Visual Salary Slider */}
                      <div style={{ marginTop: '12px', position: 'relative', height: '6px', background: 'rgba(203, 213, 225, 0.6)', borderRadius: '4px' }}>
                        <div style={{ position: 'absolute', left: '18%', right: '18%', height: '100%', background: '#B8F23A', borderRadius: '4px' }} />
                        <div style={{ position: 'absolute', left: '18%', top: '-3px', width: '12px', height: '12px', borderRadius: '50%', background: '#ffffff', border: '2.5px solid #B8F23A', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)' }} />
                        <div style={{ position: 'absolute', right: '18%', top: '-3px', width: '12px', height: '12px', borderRadius: '50%', background: '#ffffff', border: '2.5px solid #B8F23A', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)' }} />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </PageContainer>
      </Section>

      {/* 2. VERIFIED COMPANY DISCOVERY STRIP (Section E) */}
      <Section py="2">
        <PageContainer size="lg">
          <ScrollReveal variant="fade-in" delay={100}>
            <div className="rc-leader-strip">
              <span className="rc-leader-label">
                Hire &amp; Discover With Leaders:
              </span>

              {/* Company logo chips instead of text labels */}
              <div className="rc-leader-chips">
                {[
                  { id: 'google', name: 'Google' },
                  { id: 'microsoft', name: 'Microsoft' },
                  { id: 'amazon', name: 'Amazon' },
                  { id: 'adobe', name: 'Adobe' },
                  { id: 'zoho', name: 'Zoho' },
                  { id: 'freshworks', name: 'Freshworks' },
                  { id: 'razorpay', name: 'Razorpay' }
                ].map((comp, idx) => (
                  <Link
                    key={comp.id}
                    to={`/companies/${comp.id}`}
                    aria-label={comp.name}
                    title={comp.name}
                    className="rc-leader-chip"
                    style={{ '--rc-chip-i': idx }}
                  >
                    <CompanyLogoWithFallback
                      companyId={comp.id}
                      name={comp.name}
                      size="sm"
                      variant="transparent"
                      style={{ height: '26px', maxWidth: '130px' }}
                    />
                  </Link>
                ))}
              </div>

              <Link to="/companies" className="rc-leader-browse">
                Browse All Companies <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </PageContainer>
      </Section>

      {/* 3. JOB CATEGORIES DISCOVERY (Section C) */}
      <Section py="8">
        <PageContainer size="lg">
          <Stack gap="8">
            <ScrollReveal variant="slide-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#059669', display: 'inline-block', marginBottom: '6px' }}>
                    EXPLORE BY DISCIPLINE
                  </span>
                  <h2 className="rc-h2" style={{ fontSize: '2.15rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em' }}>
                    Browse In-Demand Job Categories
                  </h2>
                  <p className="rc-body" style={{ color: '#475569', fontSize: '1rem', marginTop: '4px', maxWidth: '580px' }}>
                    Find opportunities mapped directly to your technical domain, verified skills, and career interests.
                  </p>
                </div>
                <Link
                  to="/jobs"
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    color: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  View All Openings <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {[
                {
                  id: 'tech',
                  title: 'Technology & Engineering',
                  categoryParam: 'technology',
                  description: 'Frontend, Backend, Full Stack & Cloud Infrastructure',
                  icon: <Code2 size={22} color="#059669" />,
                  bgLight: '#ecfdf5',
                  countKeyword: 'tech'
                },
                {
                  id: 'data',
                  title: 'Data & Artificial Intelligence',
                  categoryParam: 'data',
                  description: 'Machine Learning, Data Engineering & Analytics',
                  icon: <Cpu size={22} color="#0284c7" />,
                  bgLight: '#f0f9ff',
                  countKeyword: 'data'
                },
                {
                  id: 'product',
                  title: 'Product Management',
                  categoryParam: 'product',
                  description: 'Product Strategy, Agile Delivery & User Experience',
                  icon: <Target size={22} color="#7b2cbf" />,
                  bgLight: '#f3e8ff',
                  countKeyword: 'product'
                },
                {
                  id: 'design',
                  title: 'UI/UX & Product Design',
                  categoryParam: 'design',
                  description: 'Design Systems, User Research, Wireframing & Prototyping',
                  icon: <Palette size={22} color="#d97706" />,
                  bgLight: '#fffbeb',
                  countKeyword: 'design'
                },
                {
                  id: 'marketing',
                  title: 'Growth & Marketing',
                  categoryParam: 'marketing',
                  description: 'Performance Marketing, Brand, SEO & Content Strategy',
                  icon: <TrendingUp size={22} color="#0d9488" />,
                  bgLight: '#f0fdfa',
                  countKeyword: 'market'
                },
                {
                  id: 'finance',
                  title: 'Finance & Operations',
                  categoryParam: 'finance',
                  description: 'Financial Modeling, Risk Analysis & Business Operations',
                  icon: <DollarSign size={22} color="#4f46e5" />,
                  bgLight: '#eef2ff',
                  countKeyword: 'finance'
                }
              ].map((cat, idx) => (
                <ScrollReveal key={cat.id} variant="slide-up" delay={idx * 60}>
                  <Link
                    to={`/jobs?category=${encodeURIComponent(cat.categoryParam)}`}
                    style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.48)',
                        backdropFilter: 'blur(22px)',
                        WebkitBackdropFilter: 'blur(22px)',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.75)',
                        boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        boxSizing: 'border-box',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), boxShadow 0.2s ease, borderColor 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.35)';
                        e.currentTarget.style.boxShadow = '0 16px 36px 0 rgba(15, 23, 42, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.95)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.75)';
                        e.currentTarget.style.boxShadow = '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: cat.bgLight,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.8)'
                        }}>
                          {cat.icon}
                        </div>
                        <div style={{
                          color: '#64748b',
                          background: 'rgba(241, 245, 249, 0.8)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ArrowUpRight size={15} />
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.08rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                          {cat.title}
                        </h3>
                        <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                          {cat.description}
                        </p>
                      </div>

                      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(226, 232, 240, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669' }}>
                          Explore Roles
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                          {getCategoryCount(cat.countKeyword)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </Stack>
        </PageContainer>
      </Section>

      {/* 4. FEATURED JOBS OPPORTUNITY DISCOVERY (Section B) */}
      <Section py="8">
        <PageContainer size="lg">
          <Stack gap="8">
            <ScrollReveal variant="slide-up">
              <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#059669', display: 'inline-block', marginBottom: '6px' }}>
                  FEATURED OPENINGS
                </span>
                <h2 className="rc-h1" style={{ fontSize: '2.35rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#0f172a' }}>
                  Latest Verified Opportunities
                </h2>
                <p className="rc-body" style={{ color: '#475569', marginTop: '8px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Explore openings from verified hiring teams with transparent compensation and clear role requirements.
                </p>
              </div>
            </ScrollReveal>

            {/* REFINED FILTER CHIPS WITH CLEAR ACTIVE STATES */}
            <ScrollReveal variant="fade-in" delay={100}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                margin: '8px 0 16px'
              }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        background: isSelected ? '#059669' : 'rgba(255, 255, 255, 0.75)',
                        color: isSelected ? '#ffffff' : '#334155',
                        border: isSelected ? '1px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
                        padding: '8px 18px',
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? '700' : '600',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        boxShadow: isSelected ? '0 4px 14px rgba(5, 150, 105, 0.25)' : '0 2px 6px rgba(15, 23, 42, 0.02)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.35)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.75)';
                          e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                        }
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Jobs Discovery Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredJobs.slice(0, 6).map((j, idx) => (
                <ScrollReveal key={j.id} variant="slide-up" delay={(idx % 3) * 100}>
                  <JobCard
                    job={j}
                    onApply={(jobToApply) => setSelectedJobToApply(jobToApply)}
                  />
                </ScrollReveal>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '16px',
                border: '1px dashed rgba(203, 213, 225, 0.8)',
                color: '#64748b'
              }}>
                <Briefcase size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>No openings found</div>
                <p style={{ fontSize: '0.92rem', marginTop: '4px' }}>
                  No roles match the selected filter. Try selecting another category or clear your search.
                </p>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  style={{
                    marginTop: '12px',
                    color: '#059669',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* EXPLORE ALL JOBS LINK BUTTON */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link to="/jobs" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#059669';
                    e.currentTarget.style.color = '#059669';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.8)';
                    e.currentTarget.style.color = '#0f172a';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.05)';
                  }}
                >
                  Explore All Jobs ({jobs.length} open positions) <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </Stack>
        </PageContainer>
      </Section>

      {/* 5. THE CORE FOUR-STAGE JOURNEY: HOW ROLECOMPASS WORKS (Section D) */}
      <div id="how-it-works" style={{ scrollMarginTop: '96px' }}>
        <Section py="10">
          <PageContainer size="lg">
            <Stack gap="10">
              <ScrollReveal variant="slide-up">
                <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#059669', display: 'inline-block', marginBottom: '6px' }}>
                    THE ROLECOMPASS ADVANTAGE
                  </span>
                  <h2 className="rc-h1" style={{ fontSize: '2.35rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#0f172a' }}>
                    How RoleCompass Works
                  </h2>
                  <p className="rc-body" style={{ color: '#475569', marginTop: '8px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Unlike conventional job boards that rely on keyword searches, RoleCompass provides an objective framework to assess role suitability, bridge skill gaps, and apply with confidence.
                  </p>
                </div>
              </ScrollReveal>

              {/* 4-STAGE COHERENT SEQUENTIAL PROGRESSION */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                position: 'relative'
              }}>
                {[
                  {
                    step: '01',
                    title: 'Discover Relevant Roles',
                    tag: 'Market Intelligence',
                    icon: <Compass size={24} color="#059669" />,
                    accentColor: '#059669',
                    bgBadge: '#ecfdf5',
                    description: 'Explore positions matched to verified industry demand and transparent salary benchmarks instead of generic title searches.',
                    benefit: 'Transparent salary & role demand'
                  },
                  {
                    step: '02',
                    title: 'Understand Your Suitability',
                    tag: 'Objective Matching',
                    icon: <Target size={24} color="#0284c7" />,
                    accentColor: '#0284c7',
                    bgBadge: '#f0f9ff',
                    description: 'Evaluate candidate strengths against role requirements with deterministic fit scoring that eliminates guesswork.',
                    benefit: 'Algorithm-verified fit score'
                  },
                  {
                    step: '03',
                    title: 'Identify Skill Gaps',
                    tag: 'Gap Detection',
                    icon: <Layers size={24} color="#7b2cbf" />,
                    accentColor: '#7b2cbf',
                    bgBadge: '#f3e8ff',
                    description: 'Pinpoint exact missing technical tools and core competencies required by the hiring team before you submit.',
                    benefit: 'Zero blind-spot applications'
                  },
                  {
                    step: '04',
                    title: 'Prepare & Apply',
                    tag: 'Targeted Readiness',
                    icon: <Send size={24} color="#d97706" />,
                    accentColor: '#d97706',
                    bgBadge: '#fffbeb',
                    description: 'Bridge gaps with targeted learning modules, build an ATS-optimized resume, and track live pipeline progress.',
                    benefit: 'Verified candidate progression'
                  }
                ].map((item, idx) => (
                  <ScrollReveal key={item.step} variant="slide-up" delay={idx * 120}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.48)',
                      backdropFilter: 'blur(22px)',
                      WebkitBackdropFilter: 'blur(22px)',
                      borderRadius: '16px',
                      padding: '28px 24px',
                      border: '1px solid rgba(255, 255, 255, 0.75)',
                      boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                      height: '100%',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), boxShadow 0.2s ease, borderColor 0.2s ease'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 16px 36px 0 rgba(15, 23, 42, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.95)';
                        e.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.75)';
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <span style={{
                            fontSize: '1.75rem',
                            fontWeight: '900',
                            fontFamily: 'Outfit, sans-serif',
                            color: item.accentColor,
                            letterSpacing: '-0.03em'
                          }}>
                            {item.step}
                          </span>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: item.bgBadge,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.8)'
                          }}>
                            {item.icon}
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: item.accentColor,
                          display: 'block',
                          marginBottom: '6px'
                        }}>
                          {item.tag}
                        </span>

                        <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px', lineHeight: '1.3' }}>
                          {item.title}
                        </h3>

                        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                          {item.description}
                        </p>
                      </div>

                      <div style={{
                        marginTop: '20px',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        color: '#334155'
                      }}>
                        <CheckCircle2 size={14} color={item.accentColor} />
                        {item.benefit}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* HOW IT WORKS DEEP-DIVE BANNER LINK */}
              <div style={{ textAlign: 'center' }}>
                <Link to="/how-it-works" style={{ textDecoration: 'none' }}>
                  <span style={{
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    color: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(236, 253, 245, 0.8)',
                    border: '1px solid rgba(167, 243, 208, 0.8)'
                  }}>
                    Explore Interactive Role Matching & Simulator on How It Works <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            </Stack>
          </PageContainer>
        </Section>
      </div>

      {/* 6. CAREER PREPARATION & EXPERIENCE PATHWAYS (Section F) */}
      <Section py="10">
        <PageContainer size="lg">
          <Stack gap="10">
            <ScrollReveal variant="slide-up">
              <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#059669', display: 'inline-block', marginBottom: '6px' }}>
                  SKILL DEVELOPMENT & PATHWAYS
                </span>
                <h2 className="rc-h1" style={{ fontSize: '2.35rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#0f172a' }}>
                  Prepare for Opportunities & Close Skill Gaps
                </h2>
                <p className="rc-body" style={{ color: '#475569', marginTop: '8px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Develop the exact competencies hiring managers evaluate. Choose your pathway and access role benchmarks tailored to your experience.
                </p>
              </div>
            </ScrollReveal>

            {/* FEATURE ACCESS DISTINCTION BAR (GUEST VS ACCOUNT) */}
            <ScrollReveal variant="fade-in" delay={100}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(18px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.04em' }}>
                    GUEST ACCESS
                  </div>
                  <span style={{ fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                    Browse role descriptions, required skills & market compensation freely without creating an account.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#f0f9ff', color: '#0284c7', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.04em' }}>
                    FREE ACCOUNT
                  </div>
                  <span style={{ fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                    Unlocks resume ATS parsing, custom fit scores, and application tracking.
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* 3 TAILORED PATHWAY CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px'
            }}>
              {/* STUDENT PATHWAY */}
              <ScrollReveal variant="slide-left" delay={100}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.48)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  borderTop: '4px solid #059669',
                  borderRight: '1px solid rgba(255, 255, 255, 0.75)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.75)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div>
                    <div style={{ color: '#059669', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <GraduationCap size={32} />
                      <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: '6px' }}>
                        EARLY CAREER
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Students</h3>
                    <p style={{ fontSize: '0.92rem', color: '#475569', margin: '12px 0 18px', lineHeight: '1.6' }}>
                      Explore career trajectories early, understand foundational requirements, and build project showcases tailored to industry expectations.
                    </p>
                    <ul style={{ paddingLeft: '18px', margin: '0 0 20px', fontSize: '0.86rem', color: '#334155', lineHeight: '1.7' }}>
                      <li>Curated foundational skill roadmaps</li>
                      <li>Academic project presentation guides</li>
                      <li>Internship & entry role discovery</li>
                    </ul>
                  </div>
                  <Link
                    to="/signup?type=student"
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: '#059669',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(226, 232, 240, 0.7)'
                    }}
                  >
                    Start Student Pathway <ArrowRight size={16} />
                  </Link>
                </div>
              </ScrollReveal>

              {/* FRESHER PATHWAY */}
              <ScrollReveal variant="scale-up" delay={200}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.48)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  borderTop: '4px solid #0284c7',
                  borderRight: '1px solid rgba(255, 255, 255, 0.75)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.75)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div>
                    <div style={{ color: '#0284c7', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Sparkles size={32} />
                      <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#0284c7', background: '#f0f9ff', padding: '3px 10px', borderRadius: '6px' }}>
                        GRADUATES
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Freshers</h3>
                    <p style={{ fontSize: '0.92rem', color: '#475569', margin: '12px 0 18px', lineHeight: '1.6' }}>
                      Bridge campus-to-career gaps, parse your resume to reveal verified competencies, and apply for junior roles with verified suitability.
                    </p>
                    <ul style={{ paddingLeft: '18px', margin: '0 0 20px', fontSize: '0.86rem', color: '#334155', lineHeight: '1.7' }}>
                      <li>Automatic resume parsing & skill extraction</li>
                      <li>Entry-level role fit calculations</li>
                      <li>Screening question preparation</li>
                    </ul>
                  </div>
                  <Link
                    to="/signup?type=fresher"
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: '#0284c7',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(226, 232, 240, 0.7)'
                    }}
                  >
                    Start Fresher Pathway <ArrowRight size={16} />
                  </Link>
                </div>
              </ScrollReveal>

              {/* EXPERIENCED PATHWAY */}
              <ScrollReveal variant="slide-right" delay={300}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.48)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  borderTop: '4px solid #7b2cbf',
                  borderRight: '1px solid rgba(255, 255, 255, 0.75)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.75)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div>
                    <div style={{ color: '#7b2cbf', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Briefcase size={32} />
                      <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#7b2cbf', background: '#f3e8ff', padding: '3px 10px', borderRadius: '6px' }}>
                        PROFESSIONALS
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Experienced Professionals</h3>
                    <p style={{ fontSize: '0.92rem', color: '#475569', margin: '12px 0 18px', lineHeight: '1.6' }}>
                      Evaluate mid-to-senior role readiness, navigate career transitions, benchmark compensation alignments, and access hiring pipelines.
                    </p>
                    <ul style={{ paddingLeft: '18px', margin: '0 0 20px', fontSize: '0.86rem', color: '#334155', lineHeight: '1.7' }}>
                      <li>Advanced competency gap diagnosis</li>
                      <li>Market salary compensation percentiles</li>
                      <li>Confidential application tracking</li>
                    </ul>
                  </div>
                  <Link
                    to="/signup?type=experienced"
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: '#7b2cbf',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(226, 232, 240, 0.7)'
                    }}
                  >
                    Start Professional Pathway <ArrowRight size={16} />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </Stack>
        </PageContainer>
      </Section>

      {/* 7. FINAL CALL TO ACTION (FROSTED GLASS CONTAINER) */}
      <Section py="10">
        <PageContainer size="md">
          <ScrollReveal variant="scale-up" delay={100}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 20px 50px 0 rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
              padding: 'clamp(36px, 5vw, 56px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle Ambient Glow inside Card */}
              <div style={{
                position: 'absolute',
                top: '-30%',
                left: '25%',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(167, 243, 208, 0.45) 0%, rgba(186, 230, 253, 0.2) 50%, rgba(255, 255, 255, 0) 75%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                zIndex: 0
              }} />

              <Stack gap="4" align="center" style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: '800',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#059669',
                  background: 'rgba(236, 253, 245, 0.9)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(167, 243, 208, 0.8)'
                }}>
                  GET STARTED TODAY
                </span>

                <h2 className="rc-h1" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', lineHeight: '1.2' }}>
                  Ready to Navigate Your Next Career Move?
                </h2>

                <p className="rc-body" style={{ color: '#475569', maxWidth: '540px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Join candidates and hiring managers using RoleCompass for structured skill discovery, verified role matching, and transparent hiring.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                  <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <button
                      type="button"
                      style={{
                        background: '#059669',
                        color: '#ffffff',
                        fontWeight: '700',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.3)';
                      }}
                    >
                      Create Free Candidate Profile <ArrowRight size={18} />
                    </button>
                  </Link>

                  <Link to="/jobs" style={{ textDecoration: 'none' }}>
                    <button
                      type="button"
                      style={{
                        background: '#ffffff',
                        color: '#0f172a',
                        fontWeight: '700',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: '1px solid rgba(203, 213, 225, 0.9)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = '#059669';
                        e.currentTarget.style.color = '#059669';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.9)';
                        e.currentTarget.style.color = '#0f172a';
                      }}
                    >
                      Explore All Openings
                    </button>
                  </Link>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '24px',
                  marginTop: '16px',
                  fontSize: '0.82rem',
                  color: '#64748b'
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#059669" /> Free to explore
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#059669" /> Zero spam
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#059669" /> Verified hiring teams
                  </span>
                </div>
              </Stack>
            </div>
          </ScrollReveal>
        </PageContainer>
      </Section>

      {/* Application Modal */}
      {selectedJobToApply && (
        <ApplicationModal
          job={selectedJobToApply}
          isOpen={!!selectedJobToApply}
          onClose={() => setSelectedJobToApply(null)}
        />
      )}
    </div>
  );
}
