// ErrorBoundary.jsx

import * as Sentry from '@sentry/react';
import React from 'react';

// Fallback component to display when an error occurs
const FallbackComponent = () => <h1>Something went wrong.</h1>;

const ErrorBoundary = ({ children }) => (
  <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
    {children}
  </Sentry.ErrorBoundary>
);

export default ErrorBoundary;

