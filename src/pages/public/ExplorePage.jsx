import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { JobCard } from '../../components/cards/JobCard.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { fuzzyMatch } from '../../utils/helpers.js';
import { Search, MapPin, RotateCcw, ChevronDown, SlidersHorizontal, X, Check } from 'lucide-react';

// Deterministic balanced company interleaving to produce a rich mixed job feed
function getMixedJobFeed(jobList) {
  if (!jobList || jobList.length <= 1) return jobList || [];

  const companyGroups = new Map();
  jobList.forEach(job => {
    const cId = job.companyId || 'other';
    if (!companyGroups.has(cId)) {
      companyGroups.set(cId, []);
    }
    companyGroups.get(cId).push(job);
  });

  const groupArrays = Array.from(companyGroups.values());
  let maxLen = 0;
  groupArrays.forEach(arr => {
    if (arr.length > maxLen) maxLen = arr.length;
  });

  const interleaved = [];
  for (let round = 0; round < maxLen; round++) {
    for (let i = 0; i < groupArrays.length; i++) {
      if (round < groupArrays[i].length) {
        interleaved.push(groupArrays[i][round]);
      }
    }
  }

  return interleaved;
}

export function ExplorePage() {
  const { jobs = [], companies = [], getJobFit } = useApp() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get('search') || '');
  const [location, setLocation] = useState(() => searchParams.get('location') || '');
  
  // Filter States
  const [workMode, setWorkMode] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [experience, setExperience] = useState('');
  const [maxSalaryLimit, setMaxSalaryLimit] = useState(50); // Slider in Lakhs
  const [sortBy, setSortBy] = useState('newest');
  
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, '...', total];
    if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  // Sync state whenever URL search params change
  useEffect(() => {
    const urlQuery = searchParams.get('search') || '';
    const urlLoc = searchParams.get('location') || '';
    const urlCat = searchParams.get('category') || '';
    setQuery(urlQuery);
    setLocation(urlLoc);
    if (urlCat) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  const handleQueryChange = (val) => {
    setQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
    setCurrentPage(1);
  };

  const handleLocationChange = (val) => {
    setLocation(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('location', val);
    } else {
      newParams.delete('location');
    }
    setSearchParams(newParams, { replace: true });
    setCurrentPage(1);
  };

  // Filter Jobs with defensive checks
  const filteredJobs = useMemo(() => {
    const safeJobs = Array.isArray(jobs) ? jobs : [];
    const safeCompanies = Array.isArray(companies) ? companies : [];

    const q = (query || '').toLowerCase().trim();
    const loc = (location || '').toLowerCase().trim();
    const wm = (workMode || '').toLowerCase().trim();
    const empType = (employmentType || '').toLowerCase().trim();
    const cat = (category || '').toLowerCase().trim();
    const exp = (experience || '').toLowerCase().trim();

    return safeJobs.filter(j => {
      if (!j) return false;
      const company = safeCompanies.find(c => c && c.id === j.companyId) || {};
      const companyName = company.name || '';

      const titleMatch = !q || fuzzyMatch(j.title, q);
      const companyMatch = !q || fuzzyMatch(companyName, q);
      const categoryMatch = !q || fuzzyMatch(j.category, q) || fuzzyMatch(j.subcategory, q);
      const skillsMatch = !q || (Array.isArray(j.skills) && j.skills.some(s => s && fuzzyMatch(s, q)));
      
      const matchQuery = !q || titleMatch || companyMatch || categoryMatch || skillsMatch;

      const matchLoc = !loc || (j.location && String(j.location).toLowerCase().includes(loc));
      const matchWM = !wm || (j.workMode && String(j.workMode).toLowerCase() === wm);
      const matchEmpType = !empType || (j.employmentType && String(j.employmentType).toLowerCase().includes(empType));
      const matchCat = !cat || (() => {
        const jc = (j.category || '').toLowerCase().trim();
        const target = cat.toLowerCase().trim();
        if (jc === target) return true;
        const sub = (j.subcategory || '').toLowerCase().trim();
        return sub === target || sub.includes(target);
      })();
      const matchExp = !exp || (j.experience && String(j.experience).toLowerCase().includes(exp)) || (j.experienceLevel && String(j.experienceLevel).toLowerCase().includes(exp)) || (j.experienceRequirement && String(j.experienceRequirement).toLowerCase().includes(exp));

      return matchQuery && matchLoc && matchWM && matchEmpType && matchCat && matchExp;
    });
  }, [jobs, companies, query, location, workMode, employmentType, category, experience]);

  // Sort and balance filtered jobs
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...filteredJobs];

    if (sortBy === 'fit' && getJobFit) {
      return jobsCopy.sort((a, b) => {
        const fitA = getJobFit(a.id)?.fitScore || 0;
        const fitB = getJobFit(b.id)?.fitScore || 0;
        return fitB - fitA;
      });
    }

    // Default / 'newest': provide a balanced mixed feed across all companies
    return getMixedJobFeed(jobsCopy);
  }, [filteredJobs, sortBy, getJobFit]);

  // Paginated Jobs
  const totalPages = Math.ceil(sortedJobs.length / pageSize) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedJobs.slice(start, start + pageSize);
  }, [sortedJobs, currentPage]);

  const resetFilters = () => {
    setQuery('');
    setLocation('');
    setWorkMode('');
    setEmploymentType('');
    setCategory('');
    setExperience('');
    setMaxSalaryLimit(50);
    setSortBy('newest');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Helper counts for filter badges
  const getWorkModeCount = (wm) => jobs.filter(j => j.workMode && j.workMode.toLowerCase() === wm).length;
  const getCategoryCount = (cat) => jobs.filter(j => {
    if (!j.category) return false;
    const jc = (j.category || '').toLowerCase().trim();
    const target = cat.toLowerCase().trim();
    return jc === target;
  }).length;

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">

          {/* 1. PAGE HEADER (CLEAN & UNCLUTTERED, NO SECONDARY NAV TABS) */}
          <div>
            <h1 className="rc-h1" style={{ fontSize: '2.35rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.025em' }}>
              Explore Career Opportunities
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '6px' }}>
              Discover jobs, career roles, and hiring organizations
            </p>
          </div>

          {/* 2. COMPACT GLASS SEARCH WORKSPACE CONTAINER */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow: '0 18px 50px rgba(40, 70, 90, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
            padding: '22px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Top Search Controls Bar */}
            <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
              {/* Search Title/Company Input */}
              <div style={{ flex: '2 1 240px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.65)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.85)' }}>
                <Search size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search by title, skill, or company..."
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    background: 'transparent',
                    color: '#0f172a',
                    fontWeight: '500'
                  }}
                />
              </div>

              {/* Location Input */}
              <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.65)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.85)' }}>
                <MapPin size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder="Filter by city or remote..."
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    background: 'transparent',
                    color: '#0f172a',
                    fontWeight: '500'
                  }}
                />
              </div>

              {/* Sort By Dropdown */}
              <div style={{ position: 'relative', minWidth: '170px', display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.65)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.85)' }}>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9rem',
                    background: 'transparent',
                    color: '#0f172a',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%',
                    appearance: 'none',
                    paddingRight: '20px'
                  }}
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="fit">Sort: RoleCompass Fit</option>
                </select>
                <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
              </div>

              {/* Lime Accent Search Button */}
              <button
                type="submit"
                style={{
                  background: '#B8F23A',
                  color: '#0f172a',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  padding: '11px 24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(184, 242, 58, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 22px rgba(184, 242, 58, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(184, 242, 58, 0.4)';
                }}
              >
                Search
              </button>
            </form>

            {/* Bottom Quick Filter Chips Row & Job Count */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', paddingTop: '12px', borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}>
              
              {/* Quick Filters */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                {[
                  { label: 'All', wm: '', emp: '' },
                  { label: 'Remote', wm: 'remote', emp: '' },
                  { label: 'Hybrid', wm: 'hybrid', emp: '' },
                  { label: 'On-Site', wm: 'on-site', emp: '' },
                  { label: 'Full Time', wm: '', emp: 'full-time' },
                  { label: 'Internship', wm: '', emp: 'internship' }
                ].map(f => {
                  const isSelected = (!f.wm && !f.emp && !workMode && !employmentType) || (f.wm && workMode === f.wm) || (f.emp && employmentType === f.emp);
                  return (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => {
                        setWorkMode(f.wm);
                        setEmploymentType(f.emp);
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? '700' : '600',
                        border: isSelected ? '1px solid #B8F23A' : '1px solid rgba(255, 255, 255, 0.7)',
                        background: isSelected ? '#B8F23A' : 'rgba(255, 255, 255, 0.5)',
                        color: '#0f172a',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}

                {/* Mobile Filter Sheet Toggle Button */}
                <button
                  type="button"
                  className="rc-show-mobile"
                  onClick={() => setMobileFilterOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: (category || experience) ? '700' : '600',
                    border: (category || experience) ? '1px solid #059669' : '1px solid rgba(255, 255, 255, 0.7)',
                    background: (category || experience) ? 'rgba(236, 253, 245, 0.95)' : 'rgba(255, 255, 255, 0.5)',
                    color: (category || experience) ? '#059669' : '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  <SlidersHorizontal size={14} /> More Filters
                  {(category || experience) && (
                    <span style={{
                      background: '#059669',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {(category ? 1 : 0) + (experience ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>

              {/* Right Side Job Count Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: '#475569', fontWeight: '600' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                  {sortedJobs.length} jobs found
                </div>

                {(query || location || workMode || employmentType || category || experience) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      color: '#059669',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginLeft: '8px'
                    }}
                  >
                    <RotateCcw size={13} /> Clear
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* 3. MAIN DISCOVERY WORKSPACE: FILTER SIDEBAR RAIL + JOBS GRID */}
          <div className="rc-explore-workspace">
            
            {/* DESKTOP GLASS FILTER RAIL (SIDEBAR) */}
            <aside className="rc-hide-mobile rc-explore-sidebar" style={{
              width: '260px',
              maxWidth: '100%',
              flexShrink: 0,
              background: 'rgba(255, 255, 255, 0.38)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: '1px solid rgba(255, 255, 255, 0.55)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 8px 32px 0 rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxSizing: 'border-box',
              height: 'fit-content'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(203, 213, 225, 0.5)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={16} color="#059669" /> Filters
                </div>
                <button onClick={resetFilters} style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Reset
                </button>
              </div>

              {/* Section 1: Work Mode */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Work Mode
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Remote', val: 'remote' },
                    { label: 'Hybrid', val: 'hybrid' },
                    { label: 'On-Site', val: 'on-site' }
                  ].map(item => (
                    <label key={item.val} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', color: '#334155', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={workMode === item.val}
                          onChange={() => {
                            setWorkMode(workMode === item.val ? '' : item.val);
                            setCurrentPage(1);
                          }}
                          style={{ accentColor: '#059669', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        {item.label}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{getWorkModeCount(item.val)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(203, 213, 225, 0.5)' }} />

              {/* Section 2: Experience */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Experience Level
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Freshers (0-1 Yrs)', val: 'fresher' },
                    { label: '1-3 Years', val: '1-3' },
                    { label: '3-5 Years', val: '3-5' },
                    { label: '5+ Years', val: '5+' }
                  ].map(item => (
                    <label key={item.val} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={experience === item.val}
                        onChange={() => {
                          setExperience(experience === item.val ? '' : item.val);
                          setCurrentPage(1);
                        }}
                        style={{ accentColor: '#059669', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(203, 213, 225, 0.5)' }} />

              {/* Section 3: Job Category */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Job Category
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Technology',
                    'Data & AI',
                    'Product',
                    'Design',
                    'Marketing',
                    'Sales',
                    'Finance',
                    'HR',
                    'Operations',
                    'Cybersecurity',
                    'Consulting',
                    'Content'
                  ].map(cat => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', color: '#334155', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={category.toLowerCase() === cat.toLowerCase()}
                          onChange={() => {
                            setCategory(category.toLowerCase() === cat.toLowerCase() ? '' : cat);
                            setCurrentPage(1);
                          }}
                          style={{ accentColor: '#059669', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        {cat}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{getCategoryCount(cat)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(203, 213, 225, 0.5)' }} />

              {/* Section 4: Salary Range Slider */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Salary Target</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#059669' }}>Up to ₹{maxSalaryLimit} LPA</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={maxSalaryLimit}
                  onChange={(e) => setMaxSalaryLimit(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#B8F23A', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  <span>₹5 LPA</span>
                  <span>₹60+ LPA</span>
                </div>
              </div>
            </aside>

            {/* RIGHT SIDE: JOB CARDS GRID */}
            <div className="rc-explore-jobs-column">
              {paginatedJobs.length > 0 ? (
                <div className="rc-explore-jobs-grid">
                  {paginatedJobs.map((j, idx) => (
                    <ScrollReveal
                      key={j.id}
                      variant="slide-up"
                      delay={(idx % 3) * 60}
                      style={{ minWidth: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <JobCard
                        job={j}
                        onApply={(jobToApply) => setSelectedJobToApply(jobToApply)}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Matching Jobs Found"
                  description="Try clearing search filters or searching for alternative job titles."
                  onAction={resetFilters}
                  actionLabel="Reset Search Filters"
                />
              )}

              {/* 4. COMPACT GLASS PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                  marginTop: '12px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: '500' }}>
                    Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedJobs.length)} of {sortedJobs.length} jobs
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.7)',
                        background: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.84rem',
                        fontWeight: '600',
                        color: currentPage === 1 ? '#cbd5e1' : '#0f172a',
                        cursor: currentPage === 1 ? 'default' : 'pointer'
                      }}
                    >
                      Previous
                    </button>

                    {getVisiblePages(currentPage, totalPages).map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            style={{
                              width: '24px',
                              textAlign: 'center',
                              color: '#64748b',
                              fontSize: '0.84rem',
                              fontWeight: '700'
                            }}
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: p === currentPage ? '1px solid #B8F23A' : '1px solid rgba(255, 255, 255, 0.7)',
                            background: p === currentPage ? '#B8F23A' : 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.84rem',
                            fontWeight: '700',
                            color: p === currentPage ? '#0f172a' : '#475569',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.7)',
                        background: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.84rem',
                        fontWeight: '600',
                        color: currentPage === totalPages ? '#cbd5e1' : '#0f172a',
                        cursor: currentPage === totalPages ? 'default' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </Stack>
      </PageContainer>

      {/* Mobile Filter Slide-Up Sheet */}
      {mobileFilterOpen && (
        <div
          onClick={() => setMobileFilterOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '80vh',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              boxShadow: '0 -10px 40px rgba(15, 23, 42, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                <SlidersHorizontal size={18} color="#059669" /> Filter Opportunities
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                style={{
                  background: 'rgba(241, 245, 249, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Category */}
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                  Job Category
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    'Technology', 'Data & AI', 'Product', 'Design',
                    'Marketing', 'Sales', 'Finance', 'HR',
                    'Operations', 'Cybersecurity', 'Consulting', 'Content'
                  ].map((cat) => {
                    const isSelected = category.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(isSelected ? '' : cat);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? '700' : '600',
                          border: isSelected ? '1px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
                          background: isSelected ? 'rgba(236, 253, 245, 0.95)' : 'rgba(248, 250, 252, 0.8)',
                          color: isSelected ? '#059669' : '#334155',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience */}
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                  Experience Level
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { label: '0–1 Yrs (Fresher)', val: '0-1' },
                    { label: '1–3 Yrs (Junior)', val: '1-3' },
                    { label: '3–5 Yrs (Mid-Level)', val: '3-5' },
                    { label: '5+ Yrs (Senior)', val: '5+' }
                  ].map((exp) => {
                    const isSelected = experience === exp.val;
                    return (
                      <button
                        key={exp.val}
                        type="button"
                        onClick={() => {
                          setExperience(isSelected ? '' : exp.val);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? '700' : '600',
                          border: isSelected ? '1px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
                          background: isSelected ? 'rgba(236, 253, 245, 0.95)' : 'rgba(248, 250, 252, 0.8)',
                          color: isSelected ? '#059669' : '#334155',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {exp.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{
              padding: '14px 20px calc(14px + env(safe-area-inset-bottom))',
              borderTop: '1px solid rgba(226, 232, 240, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: 'rgba(248, 250, 252, 0.95)'
            }}>
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(203, 213, 225, 0.9)',
                  background: '#ffffff',
                  color: '#64748b',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Reset All
              </button>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                style={{
                  flex: 1,
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                }}
              >
                Apply Filters ({sortedJobs.length} Jobs)
              </button>
            </div>
          </div>
        </div>
      )}

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
