import React from 'react';
import horizontalLogo from '../../RoleCompass_SVG_Logo_Pack/rolecompass-horizontal.svg';
import horizontalLightLogo from '../../RoleCompass_SVG_Logo_Pack/rolecompass-horizontal-light.svg';
import horizontalDarkLogo from '../../RoleCompass_SVG_Logo_Pack/rolecompass-horizontal-dark.svg';
import horizontalMonoLogo from '../../RoleCompass_SVG_Logo_Pack/rolecompass-horizontal-monochrome.svg';
import markLogo from '../../RoleCompass_SVG_Logo_Pack/rolecompass-mark.svg';
import markMonoLogo from '../../RoleCompass_SVG_Logo_Pack/rolecompass-mark-monochrome.svg';
import appIconDark from '../../RoleCompass_SVG_Logo_Pack/rolecompass-app-icon-dark.svg';

/**
 * BrandLogo — Canonical RoleCompass SVG Logo Component
 * Renders the official brand variants from src/RoleCompass_SVG_Logo_Pack
 *
 * Variants:
 * - 'horizontal' (default): Full logo for light backgrounds (navbar, footer)
 * - 'horizontal-light': Compact horizontal logo
 * - 'dark': Full logo on dark background
 * - 'monochrome': Single-color full logo
 * - 'mark': Standalone icon mark (mobile headers, compact navigation)
 * - 'mark-mono': Monochrome standalone mark
 * - 'app-icon': Dark rounded app icon
 */
export function BrandLogo({
  variant = 'horizontal',
  height = '34px',
  className = '',
  style = {},
  alt = 'RoleCompass'
}) {
  let src = horizontalLogo;

  switch (variant) {
    case 'horizontal-light':
      src = horizontalLightLogo;
      break;
    case 'dark':
      src = horizontalDarkLogo;
      break;
    case 'monochrome':
      src = horizontalMonoLogo;
      break;
    case 'mark':
      src = markLogo;
      break;
    case 'mark-mono':
      src = markMonoLogo;
      break;
    case 'app-icon':
      src = appIconDark;
      break;
    case 'horizontal':
    default:
      src = horizontalLogo;
      break;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rc-brand-logo rc-brand-logo-${variant} ${className}`}
      style={{
        height,
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
    />
  );
}

export default BrandLogo;
