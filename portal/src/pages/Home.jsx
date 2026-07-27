import React from 'react';
import { ArrowRight, Calculator, Activity, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/highsnr-lab-hero.jpg';

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero" style={{ '--hero-image': `url(${heroImage})` }}>
        <div className="container home-hero-inner">
          <h1>HighSNR Engineering Lab</h1>
          
          <p>
            Independent research, precise tools, and education for real-world electronic signal chains. We investigate physical constraints to build better hardware.
          </p>
          
          <div className="home-hero-actions">
            <Link to="/tools" className="btn btn-primary">
              Launch Tools
            </Link>
            <Link to="/education-tools" className="btn btn-secondary">
              Circuit Builder
            </Link>
            <Link to="/research" className="btn btn-secondary">
              Read Research
            </Link>
            <Link to="/lab-notes" className="btn btn-secondary">
              Research Log
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '1.1rem 0', backgroundColor: '#1a365d', color: 'white' }}>
        <div className="container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>New public release · Application Note AN-001</strong>
            <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.86rem' }}>Why MLCC distortion can peak near an RC transition band.</span>
          </div>
          <Link to="/application-notes/an-001" className="link-arrow" style={{ color: 'white' }}>
            Read the note <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Engineering Tools</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Calculators for nonlinearities, noise, and signal degradation.</p>
            </div>
            <Link to="/tools" className="link-arrow home-section-link">
              View all tools <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            <div className="card">
              <div className="card-icon-wrapper">
                <Calculator size={20} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>ADC Input Stage Simulator</h3>
              <p style={{ marginBottom: '2rem' }}>
                Simulate SAR ADC front-end settling, nonlinear MLCC behavior, and dynamic performance metrics.
              </p>
              <Link to="/tools" className="link-arrow">
                Open Tools Catalog <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card">
              <div className="card-icon-wrapper">
                <Activity size={20} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Passive Filter Distortion Analyzer</h3>
              <p style={{ marginBottom: '2rem' }}>
                Analyze passive filters with real capacitor behavior: AC response, C(V), harmonic distortion, and THD.
              </p>
              <Link to="/tools" className="link-arrow">
                Open Tools Catalog <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card">
              <div className="card-icon-wrapper">
                <Cpu size={20} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>HighSNR Circuit Builder</h3>
              <p style={{ marginBottom: '2rem' }}>
                Open the visual web editor for drawing circuits and exporting Manim-ready Python code.
              </p>
              <Link to="/education-tools" className="link-arrow">
                Open Web Editor <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Minimalist Research Program */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '2rem' }}>Research</h2>
          <Link to="/research" style={{ maxWidth: '760px', margin: '0 auto', padding: '1.35rem 0', borderTop: '1px solid var(--border-base)', borderBottom: '1px solid var(--border-base)', display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) 20px', gap: '1rem', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <span style={{ color: 'var(--text-tertiary)' }}><Activity size={18} /></span>
            <span>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Capacitor Research</strong>
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.45 }}>MLCC behavior, voltage-dependent capacitance, dielectric memory, distortion, and precision signal-chain errors.</small>
            </span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
