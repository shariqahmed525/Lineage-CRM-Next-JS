'use client';

/**
 * This component, InitializeTrackers, is designed to handle the initialization of various tracking and support services
 * that are used throughout the application. It is imported and used at the root layout level of the application.
 *
 * Services such as LogRocket, Sentry, Zendesk, etc., are initialized here. These services provide crucial functionality
 * for monitoring application performance, tracking user interactions, and providing user support.
 *
 * LogRocket is a frontend application monitoring solution that lets you replay problems as if they happened in your own browser.
 * It also monitors your app's performance, reporting with metrics like client CPU load, client memory usage, and more.
 *
 * Sentry provides self-hosted and cloud-based error monitoring that helps all software teams discover, triage, and prioritize errors in real-time.
 *
 * Zendesk is a service-first CRM company that builds support, sales, and customer engagement software designed to foster better customer relationships.
 *
 * By centralizing these initializations here, we ensure they are consistently applied across the entire application. This also makes it easier
 * to add, remove, or modify such services as the application evolves.
 *
 * Developers new to the project should look here to understand what third-party services are being used, how they are initialized, and how they might impact the application.
 */
'use client';

import * as Sentry from '@sentry/react';
import LogRocket from 'logrocket';
import { useEffect, useState } from 'react';
import { clarity } from 'react-microsoft-clarity';

import { createClient } from '../../../utils/supabase/client';
import ErrorBoundary from '../ErrorBoundary'; // Import ErrorBoundary

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_AUTH_TOKEN,
  environment: process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE,
  enableTracing: true,
});

const Trackers = ({ children, shouldInitTrackers = true }) => {
  'use client';

  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (shouldInitTrackers) {
      clarity.init('m41yrz5e9t');
      LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || '');
    }

    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (shouldInitTrackers) {
        LogRocket.identify(user?.id || '', {
          ...user,
        });
      }
      setUser(user);
    };

    fetchUser();
  }, [supabase.auth, shouldInitTrackers]);

  return <>{children}</>;
};

// Wrap Trackers with Sentry's Profiler
const TrackersWithProfiler = Sentry.withProfiler(Trackers);

// Export InitializeTrackers wrapped in ErrorBoundary
const InitializeTrackers = ({ children, shouldInitTrackers }) => (
  <ErrorBoundary>
    <TrackersWithProfiler shouldInitTrackers={shouldInitTrackers}>
      {children}
    </TrackersWithProfiler>
  </ErrorBoundary>
);

export default InitializeTrackers;
