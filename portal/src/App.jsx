import React, { useEffect, useLayoutEffect } from 'react';
import { Link, Navigate, Routes, Route } from './router';
import { trackEvent } from './utils/analytics';
import { getRouteMetadata, normalizeRoutePath } from './routeMetadata';
import { usePortalLocation } from './usePortalLocation';
import Header from './components/Header';
import Home from './pages/Home';
import ToolsCatalog from './pages/ToolsCatalog';
import ApplicationNote001 from './pages/ApplicationNote001';
import MlccDistortionMeterArchitecture from './pages/MlccDistortionMeterArchitecture';
import {
  About,
  Courses,
  DesignReview,
  EducationTools,
  LabNotes,
  NotFound,
  Publications,
  Research,
} from './pages/ContentPages';

function App() {
  const location = usePortalLocation();

  useLayoutEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
      return;
    }

    window.scrollTo(0, 0);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    const metadata = getRouteMetadata(location.pathname);
    const normalizedPathname = normalizeRoutePath(location.pathname);
    const pageTitle = metadata.title === 'HighSNR Lab' ? metadata.title : `${metadata.title} | HighSNR Lab`;
    const canonicalUrl = `https://highsnr.org${normalizedPathname}`;
    const socialImageUrl = `https://highsnr.org${metadata.image ?? '/social-preview.png'}`;

    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', metadata.ogType ?? 'website');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', socialImageUrl);
    document.querySelector('meta[property="og:image:width"]')?.setAttribute('content', String(metadata.imageWidth ?? 1200));
    document.querySelector('meta[property="og:image:height"]')?.setAttribute('content', String(metadata.imageHeight ?? 627));
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', metadata.imageAlt ?? 'HighSNR Lab portal preview with research, tools, publications, and videos.');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', pageTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', socialImageUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', metadata.noIndex ? 'noindex, nofollow' : 'index, follow');

    trackEvent('page_view', {
      page_path: normalizedPathname,
      page_search: location.search,
    });
  }, [location.pathname, location.search]);

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
          <Route path="/application-notes/an-001" element={<ApplicationNote001 />} />
          <Route path="/lab-notes" element={<LabNotes />} />
          <Route path="/lab-notes/mlcc-distortion-meter-functional-architecture" element={<MlccDistortionMeterArchitecture />} />

          <Route path="/courses" element={<Courses />} />
          <Route path="/education-tools" element={<EducationTools />} />
          <Route path="/education-tools/highsnr-circuit-builder" element={<Navigate to="/education-tools" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscribe" element={<Navigate to="/lab-notes" replace />} />
          <Route path="/design-review" element={<DesignReview />} />
          <Route path="/projects" element={<Navigate to="/research" replace />} />
          <Route path="/consulting" element={<Navigate to="/design-review" replace />} />
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
