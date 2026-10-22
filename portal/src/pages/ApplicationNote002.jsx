import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Database, Download, Mail } from 'lucide-react';
import { Link } from '../router';
import './ApplicationNote001.css';

const assetRoot = '/application-notes/an-002';
const pdfHref = `${assetRoot}/AN-002_RevA_en.pdf`;
const dataHref = 'https://doi.org/10.5281/zenodo.23528005';

const takeaways = [
  {
    number: '01',
    title: 'Zero applied DC bias does not ensure low distortion',
    text: 'A symmetric AC signal still exercises the nonlinear response of an X7R capacitor. Check the actual AC voltage across the part before accepting it in a precision signal path.',
  },
  {
    number: '02',
    title: 'The circuit sets the output harmonic ratio',
    text: 'The measured current H3 is −49.8 dBc. With the surrounding impedances included, the calculated voltage H3 across the capacitor is −44.6 dBc, or 0.59%.',
  },
  {
    number: '03',
    title: 'Measurement time is part of the result',
    text: 'H3 falls by roughly 3 dB during the record. Specify the off interval and analysis interval when comparing parts; the late-record metric is not a demonstrated steady-state value.',
  },
];

export default function ApplicationNote002() {
  return (
    <div className="an001-page">
      <section className="an001-hero">
        <div className="container an001-hero-grid">
          <div>
            <p className="an001-kicker">HighSNR Lab · Application Note AN-002 · Rev A</p>
            <h1>Third Harmonic Distortion in a 10 µF X7R RC Filter at Zero Applied DC Bias</h1>
            <p className="an001-subtitle">No intentional DC bias. Approximately 0.43 V RMS across the capacitor. Calculated voltage H3: 0.59%.</p>
            <p className="an001-lede">A measured example for analog designers using Class II ceramic capacitors in RC filters and AC-coupling networks, with a circuit model and a procedure for testing another component.</p>
            <div className="an001-actions">
              <a className="btn btn-primary" href={pdfHref} download><Download size={17} /> Download AN-002</a>
              <a className="btn btn-secondary" href={dataHref} target="_blank" rel="noopener noreferrer"><Database size={17} /> Inspect the measurement data</a>
            </div>
            <div className="an001-meta"><span>Boris Kuznetsov</span><span>October 22, 2026</span><span>HighSNR Lab AN-002 · Rev A</span></div>
          </div>
          <aside className="an001-hero-panel" aria-label="What this note establishes">
            <span className="an001-panel-label">What this note establishes</span>
            <strong>DC-bias checks alone do not establish AC linearity.</strong>
            <p>Ten 10 µF X7R capacitors from one tape show substantial third-harmonic current at 19.8 Hz. AN-002 connects that measurement to the distortion at a circuit output.</p>
          </aside>
        </div>
      </section>

      <section className="an001-section">
        <div className="container">
          <div className="an001-section-heading"><p>Engineering takeaways</p><h2>Three checks before putting X7R in the signal path</h2></div>
          <div className="an001-takeaway-grid">
            {takeaways.map((item) => (
              <article key={item.number} className="an001-takeaway"><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="an001-section an001-figure-section">
        <div className="container an001-figure-grid">
          <div>
            <p className="an001-eyebrow">Measured distortion</p>
            <h2>The third harmonic stands well above the controls</h2>
            <p>The QA403 drives the capacitor and a sense resistor in series. The voltage across the resistor measures current. Across 29 complete capacitor runs, the mean current H3/H1 is −49.75 dBc.</p>
            <ul className="an001-checks">
              <li><CheckCircle2 size={17} /> Fenghua 1206B106K100NT · 10 µF · 10 V · X7R</li>
              <li><CheckCircle2 size={17} /> 19.775390625 Hz excitation</li>
              <li><CheckCircle2 size={17} /> Short-circuit and resistor controls</li>
              <li><CheckCircle2 size={17} /> Raw streams, calibration, and analysis code archived</li>
            </ul>
          </div>
          <figure className="an001-figure-card">
            <img src={`${assetRoot}/fig1_spectrum.png`} alt="Measured shunt-voltage spectra comparing a 10 µF X7R capacitor and an 820 ohm resistor control" />
            <figcaption>Representative traces from the same fixture: capacitor C10, pass 3, window 30; resistor, window 8 of the final control pair. Absolute H3 is approximately 70 dB higher with the capacitor than in this resistor trace.</figcaption>
          </figure>
        </div>
      </section>

      <section className="an001-section">
        <div className="container an001-real-grid">
          <figure className="an001-figure-card">
            <img loading="lazy" src={`${assetRoot}/fig3_specimens.png`} alt="Third-harmonic current ratios for ten X7R capacitors across repeated mountings, before and after time correction" />
            <figcaption>Filled circles are runs corrected to the mean measurement time using the fitted +0.27 dB/h slope; open circles show uncorrected results. C04 has two complete runs; the other parts have three.</figcaption>
          </figure>
          <div>
            <p className="an001-eyebrow">Repeated parts and mountings</p>
            <h2>All ten parts reveal the same basic design issue</h2>
            <p>Individual capacitor means range from −50.1 to −49.3 dBc. Each part was removed and reinstalled between passes, with randomized order and bracketing controls.</p>
            <p className="an001-caveat">These measurements cover one tape and one operating point. The observed spread is not a production limit. One incomplete ADC record is preserved in the archive and excluded from the primary statistics.</p>
          </div>
        </div>
      </section>

      <section className="an001-section an001-figure-section">
        <div className="container an001-figure-grid">
          <div>
            <p className="an001-eyebrow">Excitation history</p>
            <h2>A few seconds after turn-on is a different measurement</h2>
            <p>The first valid windows have a median current H3/H1 of approximately −46.6 dBc. The late-record metric is approximately −49.8 dBc, and H3 is still decreasing near the end of the record.</p>
            <p>Each run follows 180 s with excitation off. The reported comparison interval is approximately 35–51 s after excitation begins.</p>
            <p className="an001-caveat">The decay mechanism was not established. The main series did not include amplitude or frequency sweeps, and absolute DC voltage was not independently verified after the acquisition method changed.</p>
          </div>
          <figure className="an001-figure-card">
            <img loading="lazy" src={`${assetRoot}/fig5_time.png`} alt="Third-harmonic current ratio decreasing over time across 29 complete capacitor runs, with the late analysis interval shaded" />
            <figcaption>The first-window median uses 26 valid values after three acquisition anomalies are excluded. Later windows from those runs remain in the primary statistics. The shaded interval is a defined observation window, not an established steady state.</figcaption>
          </figure>
        </div>
      </section>

      <section className="an001-section">
        <div className="container an001-real-grid">
          <figure className="an001-figure-card">
            <img loading="lazy" src={`${assetRoot}/fig2_circuit.png`} alt="QA403 test circuit with a series X7R capacitor and a nominal 1.2 kilohm current-sense resistor" />
            <figcaption>The sense-resistor fundamental voltage is measured; capacitor voltage is calculated. The circuit calculation uses 26 runs with a usable phase reference and a total series resistance of approximately 1593 Ω.</figcaption>
          </figure>
          <div>
            <p className="an001-eyebrow">From measurement to design</p>
            <h2>Budget the harmonic at the output you actually use</h2>
            <p>At this operating point, the ratio of total series resistance to capacitive reactance is approximately 1.80. The calculated capacitor-voltage H3/H1 is therefore about 5.1 dB higher than the measured current ratio: −44.6 dBc, or 0.59%.</p>
            <p>The full note develops an equivalent harmonic-source model and applies it to a low-pass filter and an AC-coupling network.</p>
            <p className="an001-caveat">The circuit examples are model-based estimates. Transfer to another circuit was not experimentally validated; use comparable capacitor voltage, frequency, bias, temperature, and excitation history.</p>
          </div>
        </div>
      </section>

      <section className="an001-section an001-resources">
        <div className="container">
          <div className="an001-section-heading"><p>Open release package</p><h2>Read, inspect, and reproduce</h2></div>
          <div className="an001-resource-grid">
            <a href={pdfHref} className="an001-resource-card" download><Download size={20} /><strong>Application Note PDF</strong><span>AN-002 Rev A: full English release with circuit calculations, measurement method, limitations, and a component test procedure.</span><em>Download PDF <ArrowRight size={15} /></em></a>
            <a href={dataHref} className="an001-resource-card" target="_blank" rel="noopener noreferrer"><Database size={20} /><strong>Data and reproducibility package</strong><span>Zenodo record with processed data, selected raw streams, analysis code, calibration, integrity records, and the full measurement report.</span><em>Open Zenodo <ArrowRight size={15} /></em></a>
            <Link to="/application-notes/an-001" className="an001-resource-card" analyticsContext="application_note_related"><BookOpen size={20} /><strong>Related Application Note AN-001</strong><span>The physical mechanism behind MLCC distortion near an RC transition band, and the simulation errors that can create false harmonics.</span><em>Read AN-001 <ArrowRight size={15} /></em></Link>
          </div>
        </div>
      </section>

      <section className="an001-cta">
        <div className="container an001-cta-inner">
          <div><p className="an001-eyebrow">Independent engineering review</p><h2>Does the capacitor meet your distortion budget?</h2><p>HighSNR Lab reviews component operating points, measurement assumptions, and distortion risk in precision analog signal paths.</p></div>
          <div className="an001-actions">
            <a className="btn btn-primary" href="mailto:info@highsnr.org?subject=X7R%20distortion%20or%20signal-path%20review"><Mail size={17} /> Discuss a measurement or circuit</a>
            <Link className="btn btn-secondary" to="/design-review" analyticsContext="application_note_related">Review service <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
