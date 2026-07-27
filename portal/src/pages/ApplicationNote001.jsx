import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Download,
  Mail,
} from 'lucide-react';
import './ApplicationNote001.css';

const pdfHref = '/application-notes/an-001/AN-001.pdf';
const codeHref = 'https://github.com/DrBorisKuznetsov/cvfreq-distortion-study';
const doiHref = 'https://doi.org/10.31224/7436';

const takeaways = [
  {
    number: '01',
    title: 'The transition band is the critical region',
    text: 'In a nonlinear RC low-pass network, capacitor voltage swing and circuit current are simultaneously significant near cutoff. That is where output THD can peak.',
  },
  {
    number: '02',
    title: 'C(V) is not enough for transient simulation',
    text: 'A locally frozen capacitance update can violate the charge relation. A credible nonlinear model should be formulated and checked through Q(V).',
  },
  {
    number: '03',
    title: 'Convergence is part of the model',
    text: 'If a simulated harmonic result moves when the time step is reduced, it is a numerical diagnostic—not yet a dielectric prediction.',
  },
];

export default function ApplicationNote001() {
  return (
    <div className="an001-page">
      <section className="an001-hero">
        <div className="container an001-hero-grid">
          <div>
            <p className="an001-kicker">HighSNR Lab · Application Note AN-001 · Public Release</p>
            <h1>Frequency-Dependent Distortion in Class II Ceramic Capacitors</h1>
            <p className="an001-subtitle">
              Why THD peaks near the RC transition band—and how an incorrect C(V) update can create false harmonics.
            </p>
            <p className="an001-lede">
              A concise engineering note for analog designers, signal-chain engineers, and model developers working with X7R and X5R MLCCs.
            </p>
            <div className="an001-actions">
              <a className="btn btn-primary" href={pdfHref} download>
                <Download size={17} /> Download AN-001
              </a>
              <a className="btn btn-secondary" href={codeHref} target="_blank" rel="noopener noreferrer">
                <Code2 size={17} /> Reproduce the simulation
              </a>
            </div>
            <div className="an001-meta">
              <span>Boris Kuznetsov</span>
              <span>July 27, 2026</span>
              <span>HighSNR Lab AN-001</span>
            </div>
          </div>

          <aside className="an001-hero-panel" aria-label="What this note establishes">
            <span className="an001-panel-label">What this note establishes</span>
            <strong>Physical distortion and numerical distortion are different problems.</strong>
            <p>
              The same broad THD trend can contain both a real circuit mechanism and a time-step-dependent modeling error. AN-001 separates them.
            </p>
          </aside>
        </div>
      </section>

      <section className="an001-section">
        <div className="container">
          <div className="an001-section-heading">
            <p>Engineering takeaways</p>
            <h2>Three checks before trusting an MLCC distortion result</h2>
          </div>
          <div className="an001-takeaway-grid">
            {takeaways.map((item) => (
              <article key={item.number} className="an001-takeaway">
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="an001-section an001-figure-section">
        <div className="container an001-figure-grid">
          <div>
            <p className="an001-eyebrow">Controlled simulation</p>
            <h2>THD rises toward the RC transition region, then falls</h2>
            <p>
              The charge-consistent model captures the physical interaction between nonlinear capacitor current, resistor voltage drop, and output attenuation. The comparison model is deliberately coarse and is included as a numerical counterexample.
            </p>
            <ul className="an001-checks">
              <li><CheckCircle2 size={17} /> Controlled symmetric Cdiff(V) model</li>
              <li><CheckCircle2 size={17} /> Explicit Q(V) formulation</li>
              <li><CheckCircle2 size={17} /> FFT-based harmonic extraction</li>
              <li><CheckCircle2 size={17} /> Reproducible Python source</li>
            </ul>
          </div>
          <figure className="an001-figure-card">
            <img src="/application-notes/an-001/thd-vs-frequency.png" alt="THD versus frequency for charge-consistent and naive nonlinear capacitor models" />
            <figcaption>
              Controlled example: R = 1 kΩ, C0 = 1 µF, reference cutoff 159.2 Hz. Numerical values are not a universal prediction for a commercial MLCC.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="an001-section">
        <div className="container an001-real-grid">
          <figure className="an001-figure-card">
            <img src="/application-notes/an-001/murata-grm155-cv.png" alt="Normalized capacitance versus DC bias for Murata GRM155R60J105KE19" />
            <figcaption>
              Real-component context from a Murata SimSurfing export: GRM155R60J105KE19, 1 µF, 6.3 V, X5R, 0402; header conditions 25 °C and 10 mV RMS.
            </figcaption>
          </figure>
          <div>
            <p className="an001-eyebrow">Real-component context</p>
            <h2>A real X5R curve shows why operating point matters</h2>
            <p>
              AN-001 keeps its main simulation deliberately controlled, then adds a separate vendor-data case to show realistic DC-bias curvature. The vendor curve is not presented as a measured large-signal THD model.
            </p>
            <p className="an001-caveat">
              Source limitations are disclosed: the export does not record measurement frequency, dwell time, sweep direction, or uncertainty.
            </p>
          </div>
        </div>
      </section>

      <section className="an001-section an001-resources">
        <div className="container">
          <div className="an001-section-heading">
            <p>Open release package</p>
            <h2>Read, inspect, and reproduce</h2>
          </div>
          <div className="an001-resource-grid">
            <a href={pdfHref} className="an001-resource-card" download>
              <Download size={20} />
              <strong>Application Note PDF</strong>
              <span>Five-page public release with references, limitations, and design checklist.</span>
              <em>Download PDF <ArrowRight size={15} /></em>
            </a>
            <a href={codeHref} className="an001-resource-card" target="_blank" rel="noopener noreferrer">
              <Code2 size={20} />
              <strong>Simulation code</strong>
              <span>Python implementation, interactive app, expected outputs, and reproduction notes.</span>
              <em>Open GitHub <ArrowRight size={15} /></em>
            </a>
            <a href={doiHref} className="an001-resource-card" target="_blank" rel="noopener noreferrer">
              <BookOpen size={20} />
              <strong>Related research preprint</strong>
              <span>The scholarly paper underlying this application note has its own engrXiv record and DOI.</span>
              <em>Open related paper <ArrowRight size={15} /></em>
            </a>
          </div>
        </div>
      </section>

      <section className="an001-cta">
        <div className="container an001-cta-inner">
          <div>
            <p className="an001-eyebrow">Independent engineering review</p>
            <h2>Need to trust a nonlinear model before the board is built?</h2>
            <p>
              HighSNR Lab reviews component models, operating assumptions, convergence, and distortion risk in precision analog signal paths.
            </p>
          </div>
          <div className="an001-actions">
            <a className="btn btn-primary" href="mailto:info@highsnr.org?subject=Nonlinear%20model%20or%20distortion%20review">
              <Mail size={17} /> Discuss a model or circuit
            </a>
            <Link className="btn btn-secondary" to="/design-review">
              Review service <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
