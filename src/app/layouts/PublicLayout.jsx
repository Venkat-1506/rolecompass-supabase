import React from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalHeader } from '../../components/navigation/GlobalHeader.jsx';
import { GlobalFooter } from '../../components/navigation/GlobalFooter.jsx';
import { RoleCompassBackground } from '../../components/background/RoleCompassBackground.jsx';
import { PageShell } from '../../components/layout/PageShell.jsx';
import { PageTransition } from '../../components/ui/PageTransition.jsx';
import { useApp } from '../providers/AppProviders.jsx';

export function PublicLayout() {
  const { bgIntensity } = useApp();

  return (
    <PageShell
      header={<GlobalHeader />}
      footer={<GlobalFooter />}
    >
      <RoleCompassBackground intensity={bgIntensity || 'low'} />
      <PageTransition>
        <Outlet />
      </PageTransition>
    </PageShell>
  );
}
