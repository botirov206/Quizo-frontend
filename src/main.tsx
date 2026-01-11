import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { QueryProvider } from './lib/query-provider'
import { Toaster } from 'sonner'

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '120374159777-33ajrnj0pt50sdifvg3lgr63h4a1mdat.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
  </React.StrictMode>,
)