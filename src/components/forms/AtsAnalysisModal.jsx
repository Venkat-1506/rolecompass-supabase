import React from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Progress } from '../ui/Progress.jsx';
import { Stack } from '../layout/Stack.jsx';
import { Cluster } from '../layout/Cluster.jsx';
import { CheckCircle2, AlertTriangle, Sparkles, ArrowRight, ShieldCheck, FileText, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AtsAnalysisModal({ report, isOpen, onClose, onReRun }) {
  const navigate = useNavigate();
  if (!report) return null;

  let badgeVariant = 'success';
  if (report.score < 60) badgeVariant = 'danger';
  else if (report.score < 80) badgeVariant = 'warning';

  const renderFooter = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Button variant="ghost" onClick={onReRun}>
        Re-Run Check
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          onClose();
          navigate('/candidate/profile');
        }}
        rightIcon={<ArrowRight size={14} />}
      >
        Improve Profile Data
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ATS Resume Readiness Analysis"
      size="lg"
      footer={renderFooter()}
    >
      <Stack gap="5">
        {/* Banner Disclaimer */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.95), rgba(209, 250, 229, 0.85))',
          border: '1px solid rgba(167, 243, 208, 0.95)',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: '0 4px 14px rgba(5, 150, 105, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={20} color="#059669" />
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Simulated ATS Readiness Check</h4>
              <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>Deterministic frontend format & section check</span>
            </div>
          </div>
          <Badge variant="info" style={{ padding: '6px 12px' }}>Demo Mode</Badge>
        </div>

        {/* Score Header */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          borderRadius: '18px',
          padding: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>OVERALL ATS SCORE</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0', lineHeight: 1 }}>
              {report.score} <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 600 }}>/ 100</span>
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge variant={badgeVariant} style={{ fontSize: '0.88rem', padding: '8px 16px', fontWeight: 800 }}>
              {report.statusLabel}
            </Badge>
          </div>
        </div>

        <Progress value={report.score} showLabel />

        {/* Detailed Checks Grid */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Section & Format Evaluation Checklist
          </h4>
          <Stack gap="3">
            {(report.checks || []).map((chk) => (
              <div
                key={chk.id}
                style={{
                  background: chk.status === 'pass' ? '#f0fdf4' : '#fffbeb',
                  border: `1px solid ${chk.status === 'pass' ? '#bbf7d0' : '#fde68a'}`,
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {chk.status === 'pass' ? (
                    <CheckCircle2 size={20} color="#059669" />
                  ) : (
                    <AlertTriangle size={20} color="#d97706" />
                  )}
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{chk.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>{chk.message}</div>
                  </div>
                </div>
                <Badge variant={chk.status === 'pass' ? 'success' : 'warning'} style={{ padding: '5px 10px', fontSize: '0.75rem' }}>
                  {chk.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </Stack>
        </div>

        {/* Strengths & Actionable Improvements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '18px', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              PROFILE STRENGTHS
            </h4>
            <Stack gap="2">
              {(report.strengths || []).map((str, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <Check size={15} color="#059669" /> {str}
                </div>
              ))}
            </Stack>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '18px', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              RECOMMENDED IMPROVEMENTS
            </h4>
            <Stack gap="2">
              {(report.improvements || []).map((imp, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  • {imp}
                </div>
              ))}
            </Stack>
          </div>
        </div>
      </Stack>
    </Modal>
  );
}
