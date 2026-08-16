import React from 'react';
import { Link } from '../router';
import { Activity, ArrowRight, ExternalLink, Zap, Calculator, Cpu } from 'lucide-react';
import adcScreenshot from '../assets/adc-screenshot.png';
import capacitorScreenshot from '../assets/capacitor-screenshot.png';
import editorScreenshot from '../assets/editor-screenshot.png';
import './ToolsCatalog.css';

export default function ToolsCatalog() {
  return (
    <div className="tools-page container section" style={{ padding: '4rem 0' }}>
      {/* Page Header */}
      <div className="tools-header" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Engineering Tools</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Interactive calculators and simulation models designed to assist hardware engineers in analyzing non-linearities, noise, and signal degradation.
        </p>
      </div>

      {/* Feature: ADC Input Stage Simulator */}
      <div className="featured-tool-card glass-card">
        <div className="featured-tool-info">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Zap size={12} />
            <span>Active Simulator</span>
          </div>
          
          <h2 className="tool-title">ADC Input Stage Simulator</h2>
          <p className="tool-desc">
            An interactive simulator and design space explorer for analog-to-digital converter frontends. Simulates the physical impact of non-linear capacitor DC bias (MLCC Class II) and sampling switch settling dynamics on dynamic performance metrics (THD, SNR, SINAD, ENOB).
          </p>

          <div className="tool-features-list">
            <div className="tool-feature-item">
              <span className="bullet-indicator"></span>
              <strong>Stiff ODE Solver Support:</strong> Integrates coupled RC networks using implicit Radau and fast semi-implicit linearization algorithms.
            </div>
            <div className="tool-feature-item">
              <span className="bullet-indicator"></span>
              <strong>Unified Component Library:</strong> Dynamically loads real capacitor parameters to model voltage-dependent capacitance drops.
            </div>
            <div className="tool-feature-item">
              <span className="bullet-indicator"></span>
              <strong>Dynamic Loss Decomposition:</strong> Performs ablation analysis to isolate baseline floor, C(V) non-linearity, and settling errors.
            </div>
            <div className="tool-feature-item">
              <span className="bullet-indicator"></span>
              <strong>Design Space Exploration:</strong> Sweeps parameters in N-dimensional space to output interactive Plotly heatmaps.
            </div>
          </div>

          <div className="tool-actions mt-4">
            <a 
              href={import.meta.env.DEV ? "http://localhost:8000/" : "https://adc.highsnr.org"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Launch Simulator
              <ExternalLink size={18} />
            </a>
            <Link
              to="/research"
              analyticsContext="tool_related_research"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Read Research
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Real Screenshot of the tool */}
        <div className="featured-tool-preview">
          <div className="editor-mockup screenshot-mockup">
            <div className="mockup-header">
              <span>adc-input-simulator v1.0</span>
              <span style={{ color: 'var(--accent-color)' }}>LIVE</span>
            </div>
            <div className="mockup-image-container">
              <img 
                src={adcScreenshot} 
                alt="ADC Input Simulator Interface" 
                className="tool-screenshot"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature: Passive Filter Distortion Analyzer */}
      <div className="featured-tool-card glass-card" style={{ marginTop: '3rem' }}>
        <div className="featured-tool-info">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Activity size={12} />
            <span>Active Analyzer</span>
          </div>
          
          <h2 className="tool-title">Passive Filter Distortion Analyzer</h2>
          <p className="tool-desc">
            Analyze passive filters with real capacitors: ideal response, ESR/ESL/leakage, and nonlinear MLCC distortion.
          </p>

          <div className="tool-features-list">
            <div className="tool-feature-item">
              <span className="bullet-indicator"></span>
              <strong>Linear AC analysis:</strong> RC and RLC passive filter topologies.
            </div>
            <div className="tool-feature-item">
              <span className="bullet-indicator"></span>
              <strong>Non-ideal component effects:</strong> ESR, ESL, leakage, source resistance, load resistance.
            </div>
            <div className="tool-feature-item">
              <span className="bullet-indicator"></span>
              <strong>Charge-conserving models:</strong> Harmonic distortion and THD estimates for MLCC Class II.
            </div>
          </div>

          <div className="tool-actions mt-4">
            <a 
              href={import.meta.env.DEV ? "http://localhost:5175/" : "https://filters.highsnr.org"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Launch Analyzer
              <ExternalLink size={18} />
            </a>
            <Link
              to="/application-notes/an-001"
              analyticsContext="tool_related_publication"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Read Application Note
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="featured-tool-preview">
          <div className="editor-mockup screenshot-mockup">
            <div className="mockup-header">
              <span>passive-filter-analyzer v0.1</span>
              <span style={{ color: 'var(--accent-color)' }}>LIVE</span>
            </div>
            <div className="mockup-image-container">
              <img 
                src={capacitorScreenshot} 
                alt="Passive Filter Analyzer Interface" 
                className="tool-screenshot"
              />
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '5rem' }}>Education & Visualization Tools</h3>

      <div className="tools-support-grid">
        <div className="dev-tool-card card">
          <div className="dev-tool-header">
            <Cpu className="text-secondary" size={24} />
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-light)', padding: '0.1rem 0.5rem', borderRadius: '1rem', color: 'var(--accent-color)' }}>Web Editor</span>
          </div>
          <div className="support-tool-thumb">
            <img src={editorScreenshot} alt="HighSNR Circuit Builder editor interface" />
          </div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>HighSNR Circuit Builder</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Draw circuits in the browser and export Manim-ready Python code for videos, courses, and technical explanations.
          </p>
          <Link to="/education-tools" className="link-arrow">
            Open launch page <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* In-development Utilities (Coming Soon Grid) */}
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '5rem' }}>Utilities Under Development</h3>
      
      <div className="tools-dev-grid">

        {/* SNR & ENOB Converter */}
        <div className="dev-tool-card card" style={{ borderStyle: 'dashed' }}>
          <div className="dev-tool-header">
            <Calculator className="text-secondary" size={24} />
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--border-base)', padding: '0.1rem 0.5rem', borderRadius: '1rem', color: 'var(--text-secondary)' }}>Coming Soon</span>
          </div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>SNR & ENOB Converter</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Convert between Signal-to-Noise Ratio (dB) and Effective Number of Bits (ENOB) using standard quantization noise formulas.
          </p>
        </div>

        {/* RC Filter Calculator */}
        <div className="dev-tool-card card" style={{ borderStyle: 'dashed' }}>
          <div className="dev-tool-header">
            <Zap className="text-secondary" size={24} />
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--border-base)', padding: '0.1rem 0.5rem', borderRadius: '1rem', color: 'var(--text-secondary)' }}>Coming Soon</span>
          </div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>RC Filter Calculator</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Calculate the 3dB cutoff frequency of resistor-capacitor (RC) low-pass and high-pass filters with interactive sliders.
          </p>
        </div>
      </div>
    </div>
  );
}
