import React from 'react';
import { ArrowRight, Calculator, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      {/* Premium Minimal Hero Section */}
      <section style={{ padding: '7rem 0', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'var(--border-subtle)', border: '1px solid var(--border-base)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            v1.0 Portal Initialization
          </div>
          
          <h1 style={{ marginBottom: '1.5rem' }}>HighSNR Engineering Lab</h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            Independent research, precise tools, and education for real-world electronic signal chains. We investigate physical constraints to build better hardware.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/tools" className="btn btn-primary">
              Launch Tools
            </Link>
            <Link to="/research" className="btn btn-secondary">
              Read Research
            </Link>
            <Link to="/subscribe" className="btn btn-secondary">
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Engineering Tools</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Calculators for nonlinearities, noise, and signal degradation.</p>
            </div>
            <Link to="/tools" className="link-arrow" style={{ color: 'var(--text-secondary)' }}>
              View all tools <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            <div className="card">
              <div className="card-icon-wrapper">
                <Calculator size={20} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>ADC ENOB Loss Calculator</h3>
              <p style={{ marginBottom: '2rem' }}>
                Estimate effective resolution loss in SAR ADC front ends caused by source impedance, acquisition time, and filtering.
              </p>
              <Link to="/tools/adc-enob-loss-calculator" className="link-arrow">
                View Tool Page <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card">
              <div className="card-icon-wrapper">
                <Activity size={20} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Capacitor Distortion Analyzer</h3>
              <p style={{ marginBottom: '2rem' }}>
                Model voltage-dependent capacitance and calculate harmonic distortion in RC filters using MLCC X7R/X5R capacitors.
              </p>
              <Link to="/tools/capacitor-distortion-analyzer" className="link-arrow">
                View Tool Brief <ArrowRight size={16} />
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
