import React from 'react';
import { Link, Navigate, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ToolsCatalog from './pages/ToolsCatalog';
import {
  About,
  Consulting,
  Courses,
  EducationTools,
  LabNotes,
  NotFound,
  Projects,
  Publications,
  Research,
} from './pages/ContentPages';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/adc-front-end-modeling" element={<Navigate to="/research" replace />} />
          <Route path="/research/nonlinear-passive-components" element={<Navigate to="/research" replace />} />
          <Route path="/tools" element={<ToolsCatalog />} />
          <Route path="/tools/adc-enob-loss-calculator" element={<Navigate to="/tools" replace />} />
          <Route path="/tools/capacitor-distortion-analyzer" element={<Navigate to="/tools" replace />} />
          <Route path="/tools/capacitor-distortion" element={<Navigate to="/tools" replace />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/lab-notes" element={<LabNotes />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/education-tools" element={<EducationTools />} />
          <Route path="/education-tools/highsnr-circuit-builder" element={<Navigate to="/education-tools" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscribe" element={<Navigate to="/lab-notes" replace />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>HighSNR Lab / 2026</p>
          <nav className="footer-links" aria-label="Footer links">
            <a href="mailto:info@highsnr.org">info@highsnr.org</a>
            <Link to="/about">About & Contact</Link>
            <a href="https://github.com/DrBorisKuznetsov" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.youtube.com/@High_SNR_Channel" target="_blank" rel="noopener noreferrer">YouTube</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
