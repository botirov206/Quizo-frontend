import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { QueryProvider } from './lib/query-provider'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
  </React.StrictMode>,
)