import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import App from './App.tsx';
import { AppErrorFallback } from './components/AppErrorFallback';
import { AuthProvider } from './context/AuthContext';
import { QueryProvider } from './lib/query-provider';
import { initSentry } from './lib/sentry';
import './index.css';

initSentry();

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '120374159777-33ajrnj0pt50sdifvg3lgr63h4a1mdat.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<AppErrorFallback />}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryProvider>
          <AuthProvider>
            <App />
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              duration={4000}
            />
          </AuthProvider>
        </QueryProvider>
      </GoogleOAuthProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
