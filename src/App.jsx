import React from 'react';
import { AppProviders } from './app/providers/AppProviders.jsx';
import { AppRouter } from './app/router/AppRouter.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import './styles/globals.css';
import './styles/glass.css';
import './styles/motion.css';
import './styles/animations.css';
import './styles/interactions.css';
import './styles/leaders.css';
import './styles/footer.css';
import './styles/responsive.css';
import './styles/onboarding.css';
import './styles/candidate.css';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}
