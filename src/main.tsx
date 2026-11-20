import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import LangProvider from './i18n/LangProvider.tsx'
import App from './App.tsx'
import Projects from './pages/Projects.tsx'
import Overview from './pages/Overview.tsx'
import PageTransitionProvider from './transition/PageTransitionProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
    <BrowserRouter>
      <PageTransitionProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        {/* Student Activity is "Under restoration" on /projects until its new case study is built */}
        <Route path="/projects/student-activity" element={<Navigate to="/projects" replace />} />
        <Route path="/projects/:projectId" element={<Overview />} />
      </Routes>
      </PageTransitionProvider>
    </BrowserRouter>
    </LangProvider>
  </StrictMode>,
)
