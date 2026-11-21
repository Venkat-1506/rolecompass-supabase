import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Progress } from '../ui/Progress.jsx';
import { atsService } from '../../services/atsService.js';
import { AtsAnalysisModal } from '../forms/AtsAnalysisModal.jsx';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Cpu } from 'lucide-react';

export function AtsTesterCard({ candidateUser, className = '' }) {
  const [report, setReport] = useState(() => atsService.evaluateReadiness(candidateUser));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (candidateUser) {
      setReport(atsService.evaluateReadiness(candidateUser));
    }
  }, [candidateUser]);

  const handleRunCheck = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const freshReport = atsService.evaluateReadiness(candidateUser);
      setReport(freshReport);
      setIsAnalyzing(false);
      setIsModalOpen(true);
    }, 400);
  };

  if (!candidateUser) return null;

  // Dynamic Theme Colors based on score
  const isDanger = report.score < 60;
  const isWarning = report.score >= 60 && report.score < 80;

  const scoreCardBg = isDanger
    ? 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(255, 237, 213, 0.85) 100%)'
    : isWarning
      ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(254, 249, 195, 0.85) 100%)'
      : 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(209, 250, 229, 0.85) 100%)';

  const scoreCardBorder = isDanger
    ? 'rgba(248, 113, 113, 0.6)'
    : isWarning
      ? 'rgba(251, 191, 36, 0.6)'
      : 'rgba(52, 211, 153, 0.6)';

  const scoreTextColor = isDanger ? '#991b1b' : isWarning ? '#92400e' : '#065f46';
  const badgeVariant = isDanger ? 'danger' : isWarning ? 'warning' : 'success';

  return (
    <>
      <Card
        variant="solid"
        padding="6"
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.48)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255, 255, 255, 0.75)',
          boxShadow:
            '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
          borderRadius: '16px',
        }}
      >
        {/* Soft Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: isDanger
              ? 'radial-gradient(circle, rgba(248, 113, 113, 0.2) 0%, rgba(255, 255, 255, 0) 70%)'
              : isWarning
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(255, 255, 255, 0) 70%)'
                : 'radial-gradient(circle, rgba(184, 242, 58, 0.3) 0%, rgba(5, 150, 105, 0.1) 70%)',
            filter: 'blur(25px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Eyebrow & Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#059669',
                    background: 'rgba(236, 253, 245, 0.9)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(167, 243, 208, 0.8)',
                  }}
                >
                  LOCAL RESUME READINESS CHECK
                </span>
              </div>
              <h3
                className="rc-h3"
                style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}
              >
                Resume Readiness Check
              </h3>
              <p
                className="rc-small"
                style={{ color: '#64748b', marginTop: '2px', fontSize: '0.82rem' }}
              >
                Local rule-based format & section completeness evaluation
              </p>
            </div>

            <div
              style={{
                padding: '8px',
                background: 'rgba(241, 245, 249, 0.8)',
                borderRadius: '10px',
                color: '#059669',
              }}
            >
              <Cpu size={20} />
            </div>
          </div>

          {/* Score Badge Hero Card */}
          <div
            style={{
              background: scoreCardBg,
              border: `1px solid ${scoreCardBorder}`,
              borderRadius: '16px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: scoreTextColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Local Readiness Score
              </div>
              <div
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: scoreTextColor,
                  lineHeight: '1.1',
                  marginTop: '2px',
                }}
              >
                {report.score}{' '}
                <span style={{ fontSize: '1.1rem', opacity: 0.7, fontWeight: 700 }}>/ 100</span>
              </div>
            </div>

            <Badge
              variant={badgeVariant}
              style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '10px' }}
            >
              {report.statusLabel}
            </Badge>
          </div>

          {/* Progress Indicator Track */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Progress value={report.score} showLabel={false} />
          </div>

          {/* Key Checks Checklist Preview */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'rgba(248, 250, 252, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid rgba(226, 232, 240, 0.95)',
            }}
          >
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '2px',
              }}
            >
              SECTION COMPLETENESS CHECKS
            </div>

            {(report.checks || []).map((check) => {
              const isPass = check.status === 'pass';
              const isWarn = check.status === 'warning';
              const statusColor = isPass ? '#059669' : isWarn ? '#d97706' : '#dc2626';
              const statusBg = isPass
                ? 'rgba(236, 253, 245, 0.9)'
                : isWarn
                  ? 'rgba(254, 243, 199, 0.9)'
                  : 'rgba(254, 242, 242, 0.9)';

              return (
                <div
                  key={check.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '8px 12px',
                    background: statusBg,
                    borderRadius: '10px',
                    border: `1px solid ${statusColor}33`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    {isPass ? (
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                    ) : isWarn ? (
                      <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0 }} />
                    ) : (
                      <XCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {check.label}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: statusColor,
                      flexShrink: 0,
                    }}
                  >
                    {isPass ? 'Passed' : 'Attention'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              paddingTop: '4px',
            }}
          >
            <span
              style={{
                fontSize: '0.76rem',
                color: '#94a3b8',
                fontStyle: 'italic',
                fontWeight: 600,
              }}
            >
              Local heuristic demo
            </span>

            <Button
              variant="primary"
              size="sm"
              isLoading={isAnalyzing}
              onClick={handleRunCheck}
              rightIcon={<ArrowRight size={14} />}
            >
              Run Local Readiness Check
            </Button>
          </div>
        </div>
      </Card>

      {/* Full Modal Analysis Breakdown */}
      {isModalOpen && (
        <AtsAnalysisModal
          report={report}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReRun={handleRunCheck}
        />
      )}
    </>
  );
}
