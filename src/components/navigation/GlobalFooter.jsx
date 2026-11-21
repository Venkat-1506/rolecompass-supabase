import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../layout/PageContainer.jsx';
import { Modal } from '../ui/Modal.jsx';
import { ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo.jsx';
import '../../styles/footer.css';

export function GlobalFooter() {
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

  return (
    <>
      <footer className="rc-footer">
        <PageContainer size="lg">
          <div className="rc-footer-grid">
            {/* BRAND */}
            <div className="rc-footer-brand">
              <Link to="/" aria-label="RoleCompass home">
                <BrandLogo height="32px" />
              </Link>
              <p className="rc-footer-desc">
                Career discovery and role matching that connects candidate skills with role
                requirements.
              </p>
              <span className="rc-footer-badge">
                <ShieldCheck size={14} /> Candidate Demo Experience
              </span>
            </div>

            {/* PLATFORM */}
            <nav className="rc-footer-col" aria-label="Platform">
              <h4 className="rc-footer-heading">Platform</h4>
              <Link className="rc-footer-link" to="/jobs">
                Explore Jobs
              </Link>
              <Link className="rc-footer-link" to="/companies">
                Companies
              </Link>
              <Link className="rc-footer-link" to="/roles">
                Role Benchmarks
              </Link>
              <Link className="rc-footer-link" to="/how-it-works">
                How It Works
              </Link>
            </nav>

            {/* COMPANY */}
            <nav className="rc-footer-col" aria-label="Company">
              <h4 className="rc-footer-heading">Company</h4>
              <Link className="rc-footer-link" to="/about">
                About Us
              </Link>
              <Link className="rc-footer-link" to="/contact">
                Contact Support
              </Link>
              <Link className="rc-footer-link" to="/how-it-works">
                How It Works
              </Link>
            </nav>

            {/* ACCOUNT */}
            <nav className="rc-footer-col" aria-label="Get Started">
              <h4 className="rc-footer-heading">Get Started</h4>
              <Link className="rc-footer-link rc-footer-link-accent" to="/signup">
                Create Account
              </Link>
              <Link className="rc-footer-link" to="/login">
                Sign In
              </Link>
            </nav>
          </div>

          <div className="rc-footer-bottom">
            <span>© 2026 RoleCompass. All rights reserved.</span>
            <div className="rc-footer-legal">
              <button type="button" onClick={() => setLegalModal('privacy')}>
                Privacy
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={() => setLegalModal('terms')}>
                Terms
              </button>
            </div>
          </div>
        </PageContainer>
      </footer>

      {/* PRIVACY POLICY MODAL */}
      <Modal
        isOpen={legalModal === 'privacy'}
        onClose={() => setLegalModal(null)}
        title="RoleCompass Privacy Policy"
        size="md"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontSize: '0.92rem',
            color: '#334155',
            lineHeight: '1.65',
          }}
        >
          <p>
            RoleCompass is committed to safeguarding candidate privacy. This policy outlines how
            your professional data, resumes, and career preferences are processed.
          </p>
          <div
            style={{
              background: '#f8fafc',
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Data Protection Principles
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>
                Your uploaded resumes and parsed profiles are exclusively used for role matching and
                application delivery.
              </li>
              <li>
                We never sell candidate personally identifiable information (PII) to third-party
                data brokers.
              </li>
              <li>
                You retain full ownership and may delete your stored credentials and profile records
                at any time.
              </li>
            </ul>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            For privacy inquiries or data requests, contact our compliance team via our{' '}
            <Link
              to="/contact"
              onClick={() => setLegalModal(null)}
              style={{ color: '#059669', fontWeight: '600' }}
            >
              Contact Form
            </Link>
            .
          </p>
        </div>
      </Modal>

      {/* TERMS OF SERVICE MODAL */}
      <Modal
        isOpen={legalModal === 'terms'}
        onClose={() => setLegalModal(null)}
        title="RoleCompass Terms of Service"
        size="md"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontSize: '0.92rem',
            color: '#334155',
            lineHeight: '1.65',
          }}
        >
          <p>
            By accessing or using RoleCompass, you agree to comply with our community and
            professional standards.
          </p>
          <div
            style={{
              background: '#f8fafc',
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Platform Guidelines
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>
                Candidates agree to provide accurate, honest educational background, experience, and
                skill representations.
              </li>
              <li>
                Sample role data is for local exploration and does not represent live openings or
                employer commitments.
              </li>
              <li>
                Local fit metrics are transparent heuristics and are not used for real hiring
                decisions.
              </li>
            </ul>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Questions regarding terms? Reach our platform team at{' '}
            <Link
              to="/contact"
              onClick={() => setLegalModal(null)}
              style={{ color: '#059669', fontWeight: '600' }}
            >
              Support &amp; Enquiries
            </Link>
            .
          </p>
        </div>
      </Modal>
    </>
  );
}
