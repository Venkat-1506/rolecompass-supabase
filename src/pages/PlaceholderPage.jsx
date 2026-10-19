import React from 'react';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Compass, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlaceholderPage({ title, routePath, description, workspace = 'Public' }) {
  return (
    <Section py="10">
      <PageContainer size="md">
        <Card variant="glass" padding="8" style={{ textAlign: 'center' }}>
          <div className="rc-flex rc-justify-center" style={{ marginBottom: 'var(--rc-space-4)' }}>
            <Badge variant="info">{workspace} Route Shell</Badge>
          </div>
          <div style={{ color: 'var(--rc-color-green-accent)', display: 'inline-flex', marginBottom: 'var(--rc-space-3)' }}>
            <Compass size={40} />
          </div>
          <h1 className="rc-h1" style={{ marginBottom: 'var(--rc-space-2)' }}>{title}</h1>
          <p className="rc-small" style={{ marginBottom: 'var(--rc-space-4)' }}>
            Path: <code style={{ background: 'var(--rc-color-soft-slate-100)', padding: '2px 6px', borderRadius: '4px' }}>{routePath}</code>
          </p>
          <p className="rc-body" style={{ color: 'var(--rc-color-muted-gray-600)', maxWidth: '480px', margin: '0 auto var(--rc-space-6)' }}>
            {description || 'This is a Phase 0 / Phase 0.5 foundation placeholder route shell ready for Phase 1 feature implementation.'}
          </p>
          <div className="rc-flex rc-justify-center rc-gap-3">
            <Link to="/foundation-test">
              <Button variant="secondary">
                Foundation Test Bench
              </Button>
            </Link>
            <Link to="/assets-preview">
              <Button variant="primary" leftIcon={<Image size={16} />}>
                View Asset Preview Registry
              </Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    </Section>
  );
}
