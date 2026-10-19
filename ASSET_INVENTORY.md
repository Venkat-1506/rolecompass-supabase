# RoleCompass Asset Inventory Manifest

This document records the visual assets collected, organized, and wired in **Phase 0.5 — Asset Collection & Wiring**.

---

## 1. Brand Assets

| Asset Name | Category | File Path | Format | Source | Usage | License / Usage Note |
|---|---|---|---|---|---|---|
| RoleCompass Logo | Brand | `src/assets/logos/brand/rolecompass-logo.svg` | SVG | Internal Brand Spec | Main navigation, headers | Official product identity |
| RoleCompass Mark | Brand | `src/assets/logos/brand/rolecompass-mark.svg` | SVG | Internal Brand Spec | App icon, badges, mobile header | Official product identity |
| RoleCompass Icon | Brand | `src/assets/logos/brand/rolecompass-icon.svg` | SVG | Internal Brand Spec | Compact UI elements, notifications | Official product identity |
| Favicon | Brand | `public/favicon.svg` & `src/assets/logos/brand/favicon.svg` | SVG | Internal Brand Spec | Browser tab icon | Connected in `index.html` |

---

## 2. Company Logos

| Company | Category | File Path | Format | Source | Usage | License / Usage Note |
|---|---|---|---|---|---|---|
| Google | Company Logo | `src/assets/logos/companies/google.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Microsoft | Company Logo | `src/assets/logos/companies/microsoft.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Amazon | Company Logo | `src/assets/logos/companies/amazon.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Adobe | Company Logo | `src/assets/logos/companies/adobe.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Zoho | Company Logo | `src/assets/logos/companies/zoho.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Freshworks | Company Logo | `src/assets/logos/companies/freshworks.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Accenture | Company Logo | `src/assets/logos/companies/accenture.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| TCS | Company Logo | `src/assets/logos/companies/tcs.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Infosys | Company Logo | `src/assets/logos/companies/infosys.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Wipro | Company Logo | `src/assets/logos/companies/wipro.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Deloitte | Company Logo | `src/assets/logos/companies/deloitte.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| IBM | Company Logo | `src/assets/logos/companies/ibm.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Oracle | Company Logo | `src/assets/logos/companies/oracle.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Atlassian | Company Logo | `src/assets/logos/companies/atlassian.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Razorpay | Company Logo | `src/assets/logos/companies/razorpay.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Swiggy | Company Logo | `src/assets/logos/companies/swiggy.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |
| Zomato | Company Logo | `src/assets/logos/companies/zomato.svg` | SVG | Official Brand Resource | Job cards, company profiles | Demo/company identification |

---

## 3. Demo Avatar Assets

| Avatar Target | Category | File Path | Format | Source | Usage | License / Usage Note |
|---|---|---|---|---|---|---|
| Student Candidate | Avatar | `src/assets/images/avatars/avatar-student.svg` | SVG | Licensed/Demo Asset | Candidate profile UI, demo student | Candidate avatar |
| Fresher Candidate | Avatar | `src/assets/images/avatars/avatar-fresher.svg` | SVG | Licensed/Demo Asset | Candidate profile UI, demo fresher | Candidate avatar |
| Professional Candidate | Avatar | `src/assets/images/avatars/avatar-professional.svg` | SVG | Licensed/Demo Asset | Candidate profile UI, experienced prof | Candidate avatar |
| Employer / Recruiter | Avatar | `src/assets/images/avatars/avatar-employer.svg` | SVG | Licensed/Demo Asset | Employer portal, hiring manager UI | Employer avatar |

---

## 4. Public & Background Assets

| Asset Name | Category | File Path | Format | Source | Usage | License / Usage Note |
|---|---|---|---|---|---|---|
| Hero Discovery Graphic | Public Image | `src/assets/images/public/hero-discovery-illustration.svg` | SVG | Internal Product Graphic | Public hero / exploration | Supporting visual |
| Ambient Grid Mesh | Background | `src/assets/images/backgrounds/ambient-grid-mesh.svg` | SVG | Internal Graphic Pattern | Subtle atmospheric background | Decorative mesh |
| Compass Accent Icon | Icon | `src/assets/icons/compass-accent-icon.svg` | SVG | Internal Icon Set | Accent indicators & badges | UI icon |

---

## 5. Fallback Mechanisms
1. **Company Logo Fallback:** If a company logo is missing or fails to load, `CompanyLogoWithFallback` automatically renders a styled badge with company initials (e.g., `Google` → `G`, `Microsoft` → `MS`).
2. **Avatar Fallback:** If a candidate profile photo fails to load, `Avatar` automatically renders initials derived from the full name (e.g., `Arjun Verma` → `AV`).
