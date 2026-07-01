import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ToolsCatalog from './pages/ToolsCatalog';
import {
  About,
  AdcToolPage,
  CapacitorToolPage,
  Consulting,
  Courses,
  EducationTools,
  LabNotes,
  NotFound,
  Projects,
  Publications,
  Research,
  Subscribe,
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
          <Route path="/tools/adc-enob-loss-calculator" element={<AdcToolPage />} />
          <Route path="/tools/capacitor-distortion-analyzer" element={<CapacitorToolPage />} />
          <Route path="/tools/capacitor-distortion" element={<Navigate to="/tools/capacitor-distortion-analyzer" replace />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/lab-notes" element={<LabNotes />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/education-tools" element={<EducationTools />} />
          <Route path="/education-tools/highsnr-circuit-builder" element={<Navigate to="/education-tools" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>HighSNR Lab · 2026</p>
      </footer>
    </div>
  );
}

export default App;
