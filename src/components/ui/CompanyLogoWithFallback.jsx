import React, { useState } from 'react';
import { getInitials, cn } from '../../utils/helpers.js';
import { getCompanyAsset } from '../../data/companyAssets.js';

export function CompanyLogoWithFallback({
  companyId,
  name,
  logo,
  size = 'md', // sm (32px) | md (46px) | lg (60px)
  variant = 'circle', // circle | square | transparent
  className = '',
  style = {},
}) {
  const [hasError, setHasError] = useState(false);

  const assetInfo = getCompanyAsset(companyId);
  const companyName = name || assetInfo?.name || 'Company';
  // An explicitly supplied logo (incl. employer-uploaded icons) takes precedence over the bundled asset
  const resolvedLogo = logo || assetInfo?.logo || null;
  // Canonical asset logo takes precedence to prevent stale localStorage string references
  const logoSrc = resolvedLogo;
  const initials = assetInfo?.fallbackInitials || getInitials(companyName);

  // Identify wide wordmark logos that need dedicated scaling & aspect compensation
  const isWideLogo = ['samsung', 'mahindra', 'freshworks', 'zomato', 'oracle', 'deloitte'].includes(
    String(companyId).toLowerCase(),
  );

  // Card Icon Dimensions
  const cardHeight = size === 'sm' ? 32 : size === 'lg' ? 60 : 46;
  const cardWidth =
    isWideLogo && variant === 'square'
      ? Math.round(cardHeight * 1.25) // e.g. 58px for md, 40px for sm, 75px for lg
      : cardHeight;

  // Running bar / transparent dimensions
  const transparentHeight = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const fontSize = size === 'sm' ? '0.75rem' : size === 'lg' ? '1.125rem' : '0.875rem';

  // For header/ecosystem strip transparent logos
  if (variant === 'transparent') {
    if (logoSrc && !hasError) {
      return (
        <div
          className={cn('rc-marquee-logo-wrapper', className)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${transparentHeight}px`,
            maxWidth: size === 'sm' ? '140px' : '220px',
            flexShrink: 0,
            ...style,
          }}
        >
          <img
            src={logoSrc}
            alt={`${companyName} logo`}
            onError={() => setHasError(true)}
            style={{
              height: '100%',
              maxHeight: `${transparentHeight}px`,
              maxWidth: '100%',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              transform: isWideLogo ? 'scale(1.05)' : 'none',
            }}
          />
        </div>
      );
    }

    return (
      <div
        className={cn('rc-marquee-logo-fallback', className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: `${transparentHeight}px`,
          minWidth: `${transparentHeight}px`,
          padding: '2px 10px',
          borderRadius: '8px',
          background: 'rgba(241, 245, 249, 0.95)',
          color: assetInfo?.brandColor || '#475569',
          fontWeight: 800,
          fontSize: '0.8rem',
          letterSpacing: '0.02em',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          flexShrink: 0,
          ...style,
        }}
      >
        <span>{initials}</span>
      </div>
    );
  }

  // Standard Container Box for Card Icons
  return (
    <div
      className={cn('rc-flex', 'rc-items-center', 'rc-justify-center', className)}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        borderRadius: variant === 'circle' ? '50%' : 'var(--rc-radius-md)',
        background: '#ffffff',
        color: assetInfo?.brandColor || '#0f172a',
        fontWeight: 700,
        fontSize: fontSize,
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
        padding: isWideLogo ? '3px 5px' : '5px',
        ...style,
      }}
      title={companyName}
    >
      {logoSrc && !hasError ? (
        <img
          src={logoSrc}
          alt={`${companyName} logo`}
          onError={() => setHasError(true)}
          style={{
            width: isWideLogo ? '95%' : '100%',
            height: isWideLogo ? '85%' : '100%',
            objectFit: 'contain',
            transform: isWideLogo ? 'scale(1.15)' : 'none',
            transformOrigin: 'center center',
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
