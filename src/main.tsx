import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Detail from './pages/Detail.tsx'
import Overview from './pages/Overview.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Detail />} />
        <Route path="/projects/:projectId" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
