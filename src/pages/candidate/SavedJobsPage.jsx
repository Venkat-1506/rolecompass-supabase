import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Briefcase } from 'lucide-react';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { JobCard } from '../../components/cards/JobCard.jsx';

export function SavedJobsPage() {
  const { jobs = [], savedJobs = [] } = useApp();
  const saved = jobs.filter((j) => savedJobs.includes(j.id));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#059669',
            background: 'rgba(236, 253, 245, 0.9)',
            padding: '6px 12px',
            borderRadius: '999px',
            border: '1px solid rgba(167, 243, 208, 0.8)',
            marginBottom: '10px',
          }}
        >
          <Bookmark size={14} /> Saved Jobs
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Your saved opportunities
        </h1>
        <p style={{ color: '#475569', marginTop: '6px', maxWidth: '640px' }}>
          Jobs you save are stored locally in this browser for your account. Use them to compare
          roles and apply when ready.
        </p>
      </div>

      {saved.length === 0 ? (
        <div
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(226,232,240,0.9)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <Briefcase size={28} color="#94a3b8" style={{ marginBottom: '10px' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
            No saved jobs yet
          </h2>
          <p style={{ color: '#64748b', margin: '0 0 16px' }}>
            Browse opportunities and tap Save on roles you want to revisit.
          </p>
          <Link
            to="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#059669',
              color: '#fff',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
            }}
          >
            Find Jobs
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '16px',
          }}
        >
          {saved.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
