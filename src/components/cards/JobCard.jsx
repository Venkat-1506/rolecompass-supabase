import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CompanyLogoWithFallback } from '../ui/CompanyLogoWithFallback.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { MapPin, Briefcase, Bookmark, ArrowRight, Sparkles, Clock } from 'lucide-react';

export function JobCard({ job, onApply, showFit = true, className = '' }) {
  const {
    companies,
    savedJobs,
    toggleSaveJob,
    getJobFit,
    applications,
    candidateUser,
    isAuthenticated,
  } = useApp();
  const navigate = useNavigate();

  if (!job) return null;

  const company = companies.find((c) => c.id === job.companyId) || {
    name: job.companyId || 'Company',
  };
  const isSaved = savedJobs.includes(job.id);
  const fit = getJobFit(job.id);
  const hasApplied =
    isAuthenticated &&
    applications.some((a) => a.jobId === job.id && a.candidateId === candidateUser?.id);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      const targetPath = `/jobs/${job.id}?apply=true`;
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    } else if (onApply) {
      onApply(job);
    } else {
      navigate(`/jobs/${job.id}?apply=true`);
    }
  };

  return (
    <div
      className={className}
      style={{
        background: 'rgba(255, 255, 255, 0.48)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderRadius: '16px',
        padding: '22px',
        border: '1px solid rgba(255, 255, 255, 0.75)',
        boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        transition:
          'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), boxShadow 0.2s ease, borderColor 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow =
          '0 16px 36px 0 rgba(15, 23, 42, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.95)';
        e.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.75)';
      }}
    >
      {/* Header: Company Logo Glass Container, Name, Title & Save Bookmark */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          <div
            style={{
              padding: '2px',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CompanyLogoWithFallback
              companyId={job.companyId}
              name={company.name}
              logo={company.logo}
              size="md"
              variant="square"
            />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Link
              to={`/companies/${job.companyId}`}
              style={{
                fontSize: '0.74rem',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              {company.name}
            </Link>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#0f172a',
                marginTop: '2px',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.6em',
              }}
            >
              <Link to={`/jobs/${job.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {job.title}
              </Link>
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveJob(job.id);
          }}
          aria-label={isSaved ? 'Saved Job' : 'Save Job'}
          title={isSaved ? 'Saved Job' : 'Save Job'}
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            borderRadius: '10px',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isSaved ? '#059669' : '#94a3b8',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
        >
          <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Metadata Chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: '#475569',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={13} color="#059669" />
          {job.location}
        </span>
        <span
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '3px 9px',
            borderRadius: '8px',
            fontSize: '0.76rem',
            fontWeight: '600',
            color: '#334155',
            border: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          {job.workMode}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Briefcase size={13} color="#64748b" />
          {job.experience}
        </span>
      </div>

      {/* Salary / Stipend */}
      {job.salary && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '1.05rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.01em',
            }}
          >
            {job.salary}
          </span>
          {job.employmentType === 'Internship' && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(238, 242, 255, 0.9)',
                color: '#4338ca',
                border: '1px solid rgba(199, 210, 254, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Stipend
            </span>
          )}
        </div>
      )}

      {/* Key Skills Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {(job.skills || []).slice(0, 3).map((sk) => (
          <span
            key={sk}
            style={{
              fontSize: '0.76rem',
              color: '#334155',
              background: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.70)',
              padding: '4px 10px',
              borderRadius: '8px',
              fontWeight: '500',
            }}
          >
            {sk}
          </span>
        ))}
      </div>

      {/* Footer: Fit Badge & Apply CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(226, 232, 240, 0.7)',
          marginTop: 'auto',
        }}
      >
        {showFit && isAuthenticated ? (
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(236, 253, 245, 0.85)',
              color: '#059669',
              border: '1px solid rgba(167, 243, 208, 0.8)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={13} color="#059669" />
            {fit.fitScore}% Fit
          </span>
        ) : (
          <span
            style={{
              fontSize: '0.78rem',
              color: '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Clock size={12} color="#64748b" />
            {job.postedDate ? `Posted ${job.postedDate}` : 'Actively Hiring'}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to={`/jobs/${job.id}`}
            style={{
              fontSize: '0.84rem',
              fontWeight: '600',
              color: '#475569',
              textDecoration: 'none',
            }}
          >
            Details
          </Link>
          {hasApplied ? (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#0284c7',
                background: 'rgba(224, 242, 254, 0.85)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(186, 230, 253, 0.8)',
              }}
            >
              Applied
            </span>
          ) : (
            <button
              onClick={handleApplyClick}
              style={{
                background: '#059669',
                color: '#ffffff',
                fontWeight: '700',
                padding: '7px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Apply <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
