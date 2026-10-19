/**
 * RoleCompass Central Asset Registry
 * Imports and exports all canonical Vite-compatible local visual assets.
 * Consolidated from single authoritative directory: src/assets/company-logos/
 */

// Brand Assets — Official RoleCompass SVG Logo Pack
import rolecompassLogo from '../../RoleCompass_SVG_Logo_Pack/rolecompass-horizontal.svg';
import rolecompassMark from '../../RoleCompass_SVG_Logo_Pack/rolecompass-mark.svg';
import rolecompassIcon from '../../RoleCompass_SVG_Logo_Pack/rolecompass-mark.svg';
import favicon from '../../RoleCompass_SVG_Logo_Pack/rolecompass-mark.svg';
import rolecompassDark from '../../RoleCompass_SVG_Logo_Pack/rolecompass-horizontal-dark.svg';
import rolecompassAppIcon from '../../RoleCompass_SVG_Logo_Pack/rolecompass-app-icon-dark.svg';

// Centralized Company Logos (Consolidated from src/assets/company-logos/)
import { companyLogos } from '../companyLogos.js';

// Avatars
import avatarStudent from '../../assets/images/avatars/avatar-student.svg';
import avatarFresher from '../../assets/images/avatars/avatar-fresher.svg';
import avatarProfessional from '../../assets/images/avatars/avatar-professional.svg';
import avatarEmployer from '../../assets/images/avatars/avatar-employer.svg';

// Public Experience Images & Backgrounds
import heroDiscoveryIllustration from '../../assets/images/public/hero-discovery-illustration.svg';
import ambientGridMesh from '../../assets/images/backgrounds/ambient-grid-mesh.svg';
import compassAccentIcon from '../../assets/icons/compass-accent-icon.svg';

export const assets = {
  brand: {
    logo: rolecompassLogo,
    mark: rolecompassMark,
    icon: rolecompassIcon,
    favicon: favicon,
    dark: rolecompassDark,
    appIcon: rolecompassAppIcon
  },

  companies: companyLogos,

  avatars: {
    student: avatarStudent,
    fresher: avatarFresher,
    professional: avatarProfessional,
    employer: avatarEmployer
  },

  public: {
    heroIllustration: heroDiscoveryIllustration
  },

  backgrounds: {
    ambientGrid: ambientGridMesh
  },

  icons: {
    compassAccent: compassAccentIcon
  }
};

export { companyLogos };
export default assets;
