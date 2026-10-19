import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Stack } from '../components/layout/Stack.jsx';
import { Grid } from '../components/layout/Grid.jsx';
import { Cluster } from '../components/layout/Cluster.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Tag } from '../components/ui/Tag.jsx';
import { Button } from '../components/ui/Button.jsx';
import { CompanyLogoWithFallback } from '../components/ui/CompanyLogoWithFallback.jsx';
import { Avatar } from '../components/ui/Avatar.jsx';
import { assets } from '../data/assets/assets.js';
import { COMPANY_ASSET_MANIFEST } from '../data/companies/companyAssets.js';
import { Image, ShieldCheck, AlertTriangle } from 'lucide-react';

export function AssetPreviewPage() {
  const [testBrokenLogo, setTestBrokenLogo] = useState(false);

  const companyList = Object.values(COMPANY_ASSET_MANIFEST);

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="8">
          {/* Header Banner */}
          <Card variant="strongGlass" padding="8">
            <Cluster justify="between" align="center">
              <div className="rc-flex rc-items-center rc-gap-4">
                <img src={assets.brand.mark} alt="RoleCompass Mark" style={{ width: '48px', height: '48px' }} />
                <div>
                  <h1 className="rc-h1">RoleCompass Authentic Logo & Asset Preview</h1>
                  <p className="rc-small">Authentic vector brand logos matching design reference (No embedded rounded boxes)</p>
                </div>
              </div>
              <Badge variant="success" icon={<ShieldCheck size={14} />}>
                Authentic Vector Logos Wired
              </Badge>
            </Cluster>
          </Card>

          {/* DESIGN REFERENCE RECREATION - DARK LOGO STRIP (Stripe, Adobe, Google, Microsoft) */}
          <Card variant="solid" style={{ background: '#1e293b', color: '#ffffff', borderRadius: 'var(--rc-radius-xl)' }} padding="8">
            <span className="rc-caption" style={{ color: 'var(--rc-color-muted-gray-400)', marginBottom: 'var(--rc-space-4)', display: 'block' }}>
              Design Match Demo — Dark Logo Bar Surface (Transparent SVG Logos)
            </span>
            <Cluster justify="around" align="center" gap="8">
              <div className="rc-flex rc-items-center rc-gap-3" style={{ opacity: 0.9 }}>
                <CompanyLogoWithFallback companyId="stripe" variant="transparent" size="lg" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="rc-flex rc-items-center rc-gap-3" style={{ opacity: 0.9 }}>
                <CompanyLogoWithFallback companyId="adobe" variant="transparent" size="lg" style={{ filter: 'brightness(0) invert(1)' }} />
                <span className="rc-h2" style={{ color: '#fff', fontSize: '1.5rem' }}>Adobe</span>
              </div>
              <div className="rc-flex rc-items-center rc-gap-3" style={{ opacity: 0.9 }}>
                <span className="rc-h2" style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 600 }}>Google</span>
              </div>
              <div className="rc-flex rc-items-center rc-gap-3" style={{ opacity: 0.9 }}>
                <CompanyLogoWithFallback companyId="microsoft" variant="transparent" size="md" />
                <span className="rc-h2" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>Microsoft</span>
              </div>
            </Cluster>
          </Card>

          {/* DESIGN REFERENCE RECREATION - CIRCULAR WHITE LOGO BADGES FOR CARDS */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>Design Match Demo — Circular White Badges for Job Cards</h2>
            <Grid cols="responsive-3" gap="6">
              <Card variant="glass" padding="6" className="rc-flex rc-flex-col rc-items-center" style={{ textAlign: 'center' }}>
                <CompanyLogoWithFallback companyId="google" variant="circle" size="lg" style={{ marginBottom: '12px' }} />
                <h3 className="rc-h3">Product Design Lead</h3>
                <span className="rc-small">Google • Bengaluru</span>
              </Card>

              <Card variant="glass" padding="6" className="rc-flex rc-flex-col rc-items-center" style={{ textAlign: 'center' }}>
                <CompanyLogoWithFallback companyId="amazon" variant="circle" size="lg" style={{ marginBottom: '12px' }} />
                <h3 className="rc-h3">Product Designer</h3>
                <span className="rc-small">Amazon • Hybrid</span>
              </Card>

              <Card variant="glass" padding="6" className="rc-flex rc-flex-col rc-items-center" style={{ textAlign: 'center' }}>
                <CompanyLogoWithFallback companyId="adobe" variant="circle" size="lg" style={{ marginBottom: '12px' }} />
                <h3 className="rc-h3">UI/UX Designer</h3>
                <span className="rc-small">Adobe • Noida</span>
              </Card>
            </Grid>
          </Card>

          {/* 1. BRAND ASSETS */}
          <Card variant="solid">
            <h2 className="rc-h2" style={{ marginBottom: 'var(--rc-space-4)' }}>1. Brand Identity Assets</h2>
            <Grid cols="responsive-3" gap="6">
              <Card variant="glass" padding="4" className="rc-flex rc-flex-col rc-items-center">
                <span className="rc-caption" style={{ marginBottom: '12px' }}>RoleCompass Logo</span>
                <img src={assets.brand.logo} alt="RoleCompass Full Logo" style={{ height: '48px', maxWidth: '100%' }} />
                <span className="rc-small" style={{ marginTop: '12px', fontSize: '0.75rem' }}>src/assets/logos/brand/rolecompass-logo.svg</span>
              </Card>

              <Card variant="glass" padding="4" className="rc-flex rc-flex-col rc-items-center">
                <span className="rc-caption" style={{ marginBottom: '12px' }}>RoleCompass Mark</span>
                <img src={assets.brand.mark} alt="RoleCompass Mark" style={{ width: '60px', height: '60px' }} />
                <span className="rc-small" style={{ marginTop: '12px', fontSize: '0.75rem' }}>src/assets/logos/brand/rolecompass-mark.svg</span>
              </Card>

              <Card variant="glass" padding="4" className="rc-flex rc-flex-col rc-items-center">
                <span className="rc-caption" style={{ marginBottom: '12px' }}>Favicon Preview</span>
                <img src={assets.brand.favicon} alt="RoleCompass Favicon" style={{ width: '32px', height: '32px' }} />
                <span className="rc-small" style={{ marginTop: '12px', fontSize: '0.75rem' }}>public/favicon.svg</span>
              </Card>
            </Grid>
          </Card>

          {/* 2. ALL AUTHENTIC COMPANY LOGOS REGISTRY */}
          <Card variant="solid">
            <Cluster justify="between" align="center" style={{ marginBottom: 'var(--rc-space-4)' }}>
              <div>
                <h2 className="rc-h2">2. Authentic Company Logos Registry (18 Companies)</h2>
                <p className="rc-small">Original Vector SVGs on transparent background (without rounded box outlines)</p>
              </div>
              <Tag icon={<Image size={14} />}>18 Logos Verified</Tag>
            </Cluster>
            <Grid cols="responsive-4" gap="4">
              {companyList.map((comp) => (
                <div
                  key={comp.id}
                  className="rc-flex rc-items-center rc-gap-3"
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--rc-color-soft-slate-200)',
                    borderRadius: 'var(--rc-radius-md)',
                    background: 'var(--rc-color-white)'
                  }}
                >
                  <CompanyLogoWithFallback companyId={comp.id} name={comp.name} logo={comp.logo} size="md" variant="circle" />
                  <div>
                    <h4 className="rc-label" style={{ fontSize: '0.875rem' }}>{comp.name}</h4>
                    <span className="rc-small" style={{ fontSize: '0.75rem', color: comp.brandColor, fontWeight: 600 }}>{comp.brandColor}</span>
                  </div>
                </div>
              ))}
            </Grid>
          </Card>

          {/* 3. AVATARS & RECOVERY TESTING */}
          <Card variant="solid" style={{ borderLeft: '4px solid var(--rc-color-warm-yellow)' }}>
            <Cluster justify="between" align="center" style={{ marginBottom: 'var(--rc-space-3)' }}>
              <div className="rc-flex rc-items-center rc-gap-2">
                <AlertTriangle color="var(--rc-color-warm-yellow)" size={22} />
                <h3 className="rc-h3">3. Asset Error Recovery & Fallback Test</h3>
              </div>
              <Button
                variant={testBrokenLogo ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => setTestBrokenLogo(!testBrokenLogo)}
              >
                {testBrokenLogo ? 'Restore Valid Logos' : 'Simulate Broken Logo URLs'}
              </Button>
            </Cluster>

            <Grid cols="responsive-3" gap="4">
              <Card variant="glass" padding="4" className="rc-flex rc-items-center rc-gap-3">
                <CompanyLogoWithFallback
                  companyId="google"
                  name="Google"
                  logo={testBrokenLogo ? 'https://invalid-domain.com/broken.png' : assets.companies.google}
                />
                <div>
                  <h4 className="rc-label">Google</h4>
                  <span className="rc-small">{testBrokenLogo ? 'Fallback Initials: G' : 'Authentic Google SVG'}</span>
                </div>
              </Card>

              <Card variant="glass" padding="4" className="rc-flex rc-items-center rc-gap-3">
                <CompanyLogoWithFallback
                  companyId="microsoft"
                  name="Microsoft"
                  logo={testBrokenLogo ? 'https://invalid-domain.com/broken.png' : assets.companies.microsoft}
                />
                <div>
                  <h4 className="rc-label">Microsoft</h4>
                  <span className="rc-small">{testBrokenLogo ? 'Fallback Initials: MS' : 'Authentic Microsoft SVG'}</span>
                </div>
              </Card>

              <Card variant="glass" padding="4" className="rc-flex rc-items-center rc-gap-3">
                <Avatar
                  src={testBrokenLogo ? 'https://invalid-domain.com/avatar.png' : assets.avatars.professional}
                  name="Arjun Verma"
                />
                <div>
                  <h4 className="rc-label">Arjun Verma</h4>
                  <span className="rc-small">{testBrokenLogo ? 'Fallback Initials: AV' : 'Local Avatar SVG'}</span>
                </div>
              </Card>
            </Grid>
          </Card>
        </Stack>
      </PageContainer>
    </Section>
  );
}
