import React from 'react';
import { GlassCard } from '../glass/GlassCard.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Tag } from '../ui/Tag.jsx';
import { Progress } from '../ui/Progress.jsx';
import { Cluster } from '../layout/Cluster.jsx';
import { Stack } from '../layout/Stack.jsx';
import { Check, AlertCircle, Compass, MapPin, Briefcase, GraduationCap } from 'lucide-react';

export function RoleCompassFit({ fit, title = "RoleCompass Fit Breakdown", className = "" }) {
  if (!fit) return null;

  const {
    fitScore = 0,
    matchedSkills = [],
    missingRequiredSkills = [],
    experienceAlignment = "Matched",
    educationAlignment = "Matched",
    locationAlignment = "Matched",
    workModeAlignment = "Matched"
  } = fit;

  let badgeVariant = "success";
  if (fitScore < 60) badgeVariant = "warning";
  if (fitScore < 40) badgeVariant = "danger";

  return (
    <GlassCard level={2} className={className}>
      <Stack gap="4">
        {/* Header with Compass Icon & Fit Score */}
        <Cluster justify="between" align="center">
          <div className="rc-flex rc-items-center rc-gap-2">
            <div style={{ color: 'var(--rc-color-green-accent)' }}>
              <Compass size={22} />
            </div>
            <h3 className="rc-h3" style={{ fontSize: '1.125rem' }}>{title}</h3>
          </div>
          <Badge variant={badgeVariant} style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem' }}>
            {fitScore}% Fit Match
          </Badge>
        </Cluster>

        <Progress value={fitScore} showLabel />

        {/* Alignment Matrix Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.75)' }}>
          <div className="rc-flex rc-items-center rc-gap-2 rc-small" style={{ fontSize: '0.75rem' }}>
            <Briefcase size={14} color="var(--rc-color-green-accent)" />
            <span>Exp: <strong>{experienceAlignment}</strong></span>
          </div>
          <div className="rc-flex rc-items-center rc-gap-2 rc-small" style={{ fontSize: '0.75rem' }}>
            <GraduationCap size={14} color="var(--rc-color-green-accent)" />
            <span>Edu: <strong>{educationAlignment}</strong></span>
          </div>
          <div className="rc-flex rc-items-center rc-gap-2 rc-small" style={{ fontSize: '0.75rem' }}>
            <MapPin size={14} color="var(--rc-color-green-accent)" />
            <span>Location: <strong>{locationAlignment}</strong></span>
          </div>
        </div>

        {/* Matched Skills */}
        <div>
          <span className="rc-label" style={{ fontSize: '0.8125rem', marginBottom: '6px', display: 'block' }}>
            Matched Skills ({matchedSkills.length})
          </span>
          <Cluster gap="2">
            {matchedSkills.length > 0 ? (
              matchedSkills.map(sk => (
                <Tag key={sk} icon={<Check size={14} color="var(--rc-color-green-accent)" />}>{sk}</Tag>
              ))
            ) : (
              <span className="rc-small" style={{ fontStyle: 'italic' }}>No exact skill matches yet</span>
            )}
          </Cluster>
        </div>

        {/* Skill Gaps */}
        {missingRequiredSkills.length > 0 && (
          <div>
            <span className="rc-label" style={{ fontSize: '0.8125rem', marginBottom: '6px', display: 'block', color: 'var(--rc-color-warm-yellow)' }}>
              Skills to Learn ({missingRequiredSkills.length})
            </span>
            <Cluster gap="2">
              {missingRequiredSkills.map(sk => (
                <Badge key={sk} variant="warning" icon={<AlertCircle size={12} />}>{sk}</Badge>
              ))}
            </Cluster>
          </div>
        )}
      </Stack>
    </GlassCard>
  );
}
