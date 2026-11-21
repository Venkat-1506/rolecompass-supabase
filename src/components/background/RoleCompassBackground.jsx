import React from 'react';
import '../../styles/motion.css';

export function RoleCompassBackground({
  intensity = 'medium', // low | medium | high
  className = '',
}) {
  let opacityMult = 0.85;
  if (intensity === 'low') opacityMult = 0.5;
  if (intensity === 'high') opacityMult = 1.0;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 'var(--rc-z-behind)',
        overflow: 'hidden',
        /* RICH ATMOSPHERIC GRADIENT BASE MATCHING VISUAL DIRECTION */
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 30%, #94a3b8 65%, #64748b 100%)',
      }}
    >
      {/* LAYER 1 — RICH VIBRANT SAGE / MINT LIGHT FIELD (TOP LEFT) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '65vw',
          height: '65vw',
          maxWidth: '950px',
          maxHeight: '950px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(134, 239, 172, 0.75) 0%, rgba(167, 243, 208, 0.45) 45%, rgba(226, 232, 240, 0) 75%)',
          filter: 'blur(80px)',
          opacity: opacityMult,
        }}
        className="rc-animate-orb-1"
      />

      {/* LAYER 2 — SOFT TEAL / SLATE BLUE FIELD (TOP RIGHT) */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-12%',
          width: '60vw',
          height: '60vw',
          maxWidth: '900px',
          maxHeight: '900px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(147, 197, 253, 0.6) 0%, rgba(186, 230, 253, 0.35) 50%, rgba(203, 213, 225, 0) 75%)',
          filter: 'blur(90px)',
          opacity: opacityMult,
        }}
        className="rc-animate-orb-2"
      />

      {/* LAYER 3 — WARM GOLD / LIME ACCENT FIELD (CENTER HERO) */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '30%',
          width: '45vw',
          height: '45vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(190, 242, 100, 0.45) 0%, rgba(167, 243, 208, 0.25) 55%, rgba(250, 249, 245, 0) 80%)',
          filter: 'blur(95px)',
          opacity: opacityMult * 0.9,
        }}
        className="rc-animate-pulse"
      />

      {/* LAYER 4 — AMBIENT DEEP SLATE FIELD (BOTTOM) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '70vw',
          height: '45vw',
          maxWidth: '1000px',
          maxHeight: '650px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(167, 243, 208, 0.5) 0%, rgba(147, 197, 253, 0.3) 50%, rgba(203, 213, 225, 0) 75%)',
          filter: 'blur(110px)',
          opacity: opacityMult * 0.8,
        }}
        className="rc-animate-orb-1"
      />
    </div>
  );
}
