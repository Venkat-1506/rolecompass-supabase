import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { Save, Building2, Globe, Upload, Trash2 } from 'lucide-react';

export function CompanySetupPage() {
  const { employerUser, updateEmployer, companies } = useApp();

  const currentComp = companies.find(c => c.id === employerUser.companyId) || {
    name: "Zoho Corporation",
    industry: "SaaS & Cloud Software",
    location: "Chennai / Tenkasi, India",
    size: "15,000+ Employees",
    website: "https://zoho.com",
    logo: "",
    description: "Operating system for businesses with over 55+ privacy-first SaaS apps."
  };

  const [form, setForm] = useState(currentComp);
  const [toastMsg, setToastMsg] = useState(null);
  const [logoError, setLogoError] = useState('');

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose a PNG, JPG, SVG or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Image is too large. Please upload an icon under 2 MB.');
      return;
    }
    setLogoError('');
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateEmployer({
      company: {
        ...employerUser.company,
        name: form.name,
        industry: form.industry,
        location: form.location,
        size: form.size,
        website: form.website,
        description: form.description,
        logo: form.logo
      }
    });
    setToastMsg("Company profile updated successfully!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          <Cluster justify="between" align="center">
            <div>
              <span className="rc-caption">Employer Setup</span>
              <h1 className="rc-h1">Company Profile Setup</h1>
              <p className="rc-small">Manage your organization's brand presence on RoleCompass.</p>
            </div>
            <Button variant="primary" onClick={handleSave} leftIcon={<Save size={16} />}>
              Save Company Info
            </Button>
          </Cluster>

          {toastMsg && <Toast type="success" message={toastMsg} onClose={() => setToastMsg(null)} />}

          <Grid cols="responsive-3" gap="6">
            <div style={{ gridColumn: 'span 2' }}>
              <Card variant="solid" padding="6">
                <Stack gap="4">
                  <h3 className="rc-h3">Company Overview</h3>
                  <Grid cols="responsive-2" gap="4">
                    <Input
                      label="Company Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      isRequired
                    />
                    <Input
                      label="Industry Sector"
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      isRequired
                    />
                    <Input
                      label="Headquarters Location"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <Input
                      label="Company Size"
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                    />
                  </Grid>

                  <Input
                    label="Official Website URL"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />

                  <Textarea
                    label="Company Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                  />
                </Stack>
              </Card>
            </div>

            <Stack gap="6">
              <Card variant="solid" padding="6" className="rc-flex rc-flex-col rc-items-center" style={{ textAlign: 'center' }}>
                <CompanyLogoWithFallback companyId={employerUser.companyId} name={form.name} logo={form.logo} size="lg" variant="circle" style={{ width: '80px', height: '80px', marginBottom: '12px' }} />
                <h3 className="rc-h3">{form.name}</h3>
                <span className="rc-small">{form.industry}</span>

                <Cluster gap="2" style={{ marginTop: '14px', justifyContent: 'center' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(5, 150, 105, 0.45)',
                      background: 'rgba(236, 253, 245, 0.9)',
                      color: 'var(--rc-color-green-accent)',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={15} /> Upload Icon
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {form.logo && (
                    <Button variant="ghost" size="sm" onClick={() => { setLogoError(''); setForm(prev => ({ ...prev, logo: '' })); }} leftIcon={<Trash2 size={15} />}>
                      Remove
                    </Button>
                  )}
                </Cluster>
                <span className="rc-small" style={{ marginTop: '8px', color: logoError ? 'var(--rc-color-danger)' : undefined }}>
                  {logoError || 'This icon appears on all your job listings.'}
                </span>
              </Card>
            </Stack>
          </Grid>
        </Stack>
      </PageContainer>
    </Section>
  );
}
