import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Cpu, ExternalLink, Globe2, Mail } from 'lucide-react';
import editorScreenshot from '../assets/editor-screenshot.png';
import authorPortrait from '../assets/boris-kuznetsov-portrait.jpg';
import './EducationTools.css';
import './Publications.css';

const adcToolHref = import.meta.env.DEV ? 'http://localhost:8000/' : 'https://adc.highsnr.org';
const circuitBuilderHref = '/education-tools/highsnr-circuit-builder/app/index.html';
const highSnrEmail = 'info@highsnr.org';

const officialLinks = [
  {
    icon: <Activity size={18} />,
    label: 'YouTube Channel',
    text: 'youtube.com/@High_SNR_Channel',
    href: 'https://www.youtube.com/@High_SNR_Channel',
  },
  {
    icon: <Cpu size={18} />,
    label: 'GitHub Profile',
    text: 'github.com/DrBorisKuznetsov',
    href: 'https://github.com/DrBorisKuznetsov',
  },
  {
    icon: <Globe2 size={18} />,
    label: 'LinkedIn Profile',
    text: 'linkedin.com/in/kuznetsovbf',
    href: 'https://kg.linkedin.com/in/kuznetsovbf',
  },
  {
    icon: <Mail size={18} />,
    label: 'Email',
    text: highSnrEmail,
    href: `mailto:${highSnrEmail}`,
  },
];

const publications = [
  {
    title: 'An Analytical Theory of Harmonic Distortion in RC Networks with Voltage-Dependent Capacitance',
    subtitle: 'A Charge-Conserving Small-Nonlinearity Analysis Through the Fifth Harmonic',
    author: 'Boris Kuznetsov',
    date: '2026-06-30',
    status: 'Preprint',
    venue: 'engrXiv / Open Engineering Inc.',
    doi: '10.31224/7464',
    doiUrl: 'https://doi.org/10.31224/7464',
    sourceUrl: 'https://engrxiv.org/preprint/view/7464/version/9651',
    summary:
      'Develops a charge-conserving small-nonlinearity theory for harmonic distortion in first-order RC networks with voltage-dependent Class II ceramic capacitors, including closed-form and recursive results through the fifth harmonic.',
    topics: ['RC networks', 'MLCC', 'Harmonic distortion', 'Charge modeling'],
    links: [
      { label: 'Research', to: '/research' },
      { label: 'Tools', to: '/tools' },
    ],
  },
  {
    title: 'Voltage-Dependent Ceramic Capacitors as a Source of Dynamic Error in SAR ADC Front Ends',
    subtitle: 'Charge-Conserving Modeling, Simulation Pitfalls, and ENOB Degradation',
    author: 'Boris Kuznetsov',
    date: '2026-06-27',
    status: 'Preprint',
    venue: 'engrXiv / Open Engineering Inc.',
    doi: '10.31224/7456',
    doiUrl: 'https://doi.org/10.31224/7456',
    sourceUrl: 'https://engrxiv.org/preprint/view/7456/version/9642',
    summary:
      'Explains how voltage-dependent Class II ceramic capacitors create dynamic error in SAR ADC input paths and why charge-conserving Q(V) models are needed for credible ENOB estimates.',
    topics: ['SAR ADC', 'MLCC', 'ENOB', 'Charge modeling'],
    links: [
      { label: 'Research', to: '/research' },
      { label: 'Tools', to: '/tools' },
    ],
  },
  {
    title: 'Frequency-Dependent Distortion in Class II Ceramic Capacitors: Physics and Simulation Traps',
    author: 'Boris Kuznetsov',
    date: '2026-06-25',
    status: 'Preprint',
    venue: 'engrXiv / Open Engineering Inc.',
    doi: '10.31224/7436',
    doiUrl: 'https://doi.org/10.31224/7436',
    sourceUrl: 'https://engrxiv.org/preprint/view/7436/version/9618',
    summary:
      'Shows why THD from X7R and X5R capacitors can peak near an RC cutoff frequency, and separates physical nonlinear behavior from artifacts caused by poor C(V) simulation models.',
    topics: ['Class II capacitors', 'THD', 'RC filters', 'Simulation traps'],
    links: [
      { label: 'Research', to: '/research' },
      { label: 'Tools', to: '/tools' },
    ],
  },
];

const capacitorResearch = {
  title: 'Capacitor Research',
  summary:
    'HighSNR Lab currently focuses on real capacitor behavior in precision electronics: MLCC bias, dielectric memory, losses, distortion, settling, and measurement reliability.',
  introTitle: 'Why MLCCs Matter',
  intro: [
    'MLCCs are everywhere in modern electronics. They are small, inexpensive, reliable, and easy to use until their real behavior starts to matter.',
    'A capacitor marked as 10 uF may deliver only a fraction of that value under DC bias. An X7R or X5R part placed in a filter, reference path, sensor front-end, or precision signal chain can change bandwidth, settling time, noise behavior, and even introduce measurable distortion. In many cases, the problem is not the capacitor itself, but the assumption that it behaves like an ideal linear component.',
    'MLCC research is one of the long-running directions at HighSNR Lab. Our goal is to understand what actually happens inside ceramic capacitors and turn that understanding into practical models, measurement methods, and design rules.',
    'We do not study MLCCs in order to avoid them. We study them because engineers use them everywhere. The practical goal is to know when these components are harmless, when they become a hidden error source, and how to reduce their impact on precision, spectral purity, settling behavior, and measurement reliability.',
  ],
  bullets: [
    'Voltage-dependent capacitance in X7R and X5R ceramics',
    'Charge-conserving capacitor models that avoid simulation artifacts',
    'Harmonic distortion in RC filters and precision signal paths',
    'Dielectric history, bias memory, losses, and long-term behavior',
    'Measurement methods and design rules for reducing MLCC-related errors',
  ],
};

const labNotes = [
  {
    date: '2026-06-30',
    type: 'Interim note',
    title: 'First interim results of the capacitor study',
    summary: 'A working note after the first cycle of MLCC and capacitor research.',
    paragraphs: [
      'The first stage of this study has already produced several useful conclusions. The subject turned out to be much deeper and much more interesting than expected.',
      'What began as an attempt to understand the physics of modern multilayer ceramic capacitors quickly expanded into a broader investigation of how real capacitors behave in real circuits. DC bias, dielectric history, voltage-dependent capacitance, losses, nonlinear behavior, and distortion are not isolated effects. In many practical cases, they interact with each other and directly affect circuit performance.',
      'One important conclusion is already clear: MLCC behavior cannot always be reduced to a simple capacitance correction factor. For many engineering problems, that may be enough. But in precision signal paths, ADC front ends, filters, references, and measurement circuits, the capacitor can become an active source of error rather than a passive component.',
      'On the practical side, the first calculator has been developed to estimate how non-ideal capacitor behavior can affect ADC performance. This is an early engineering tool, but it already helps connect the physical behavior of capacitors with measurable system-level consequences.',
      'Three technical papers have also been published as part of this work. Their purpose is to organize the knowledge, measurements, models, and conclusions that emerged during the study, and to make the results easier to use in future research and design work.',
      'This is still an interim result, not a final conclusion. The work continues.',
    ],
    links: [
      { label: 'Capacitor Research', to: '/research' },
      { label: 'Articles & Papers', to: '/publications' },
      { label: 'Tools', to: '/tools' },
    ],
  },
];

function PageShell({ title, summary, children }) {
  return (
    <div className="content-page">
      <section className="page-hero">
        <div className="container page-hero-inner">
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
      </section>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="content-section">
      <div className="container">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function LinkCard({ icon, title, text, to, href, external }) {
  const content = (
    <>
      <div className="card-icon-wrapper">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="link-arrow">
        Open <ArrowRight size={16} />
      </span>
    </>
  );

  if (href) {
    return (
      <a className="card content-card-link" href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return (
    <Link className="card content-card-link" to={to}>
      {content}
    </Link>
  );
}

function PublicationItem({ publication }) {
  return (
    <article className="publication-item">
      <div className="publication-main">
        <div className="publication-meta-row">
          <span>{publication.status}</span>
          <span>{publication.date}</span>
          <span>{publication.venue}</span>
        </div>

        <h3>{publication.title}</h3>
        {publication.subtitle && <p className="publication-subtitle">{publication.subtitle}</p>}
        <p className="publication-authors">{publication.author}</p>
        <p className="publication-summary">{publication.summary}</p>

        <div className="publication-topics" aria-label="Publication topics">
          {publication.topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
      </div>

      <aside className="publication-actions" aria-label={`Links for ${publication.title}`}>
        <a href={publication.doiUrl} target="_blank" rel="noopener noreferrer">
          DOI: {publication.doi}
        </a>
        <a href={publication.sourceUrl} target="_blank" rel="noopener noreferrer">
          engrXiv <ExternalLink size={14} />
        </a>
        {publication.links.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </aside>
    </article>
  );
}

function AboutLinkRow({ icon, label, text, to, href }) {
  const content = (
    <>
      <span className="about-link-icon">{icon}</span>
      <span>
        <strong>{label}</strong>
        <small>{text}</small>
      </span>
      <ArrowRight size={16} />
    </>
  );

  if (href) {
    return (
      <a className="about-link-row" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return (
    <Link className="about-link-row" to={to}>
      {content}
    </Link>
  );
}

export function Research() {
  return (
    <PageShell
      title={capacitorResearch.title}
      summary={capacitorResearch.summary}
    >
      <Section title={capacitorResearch.introTitle}>
        <div className="research-intro">
          {capacitorResearch.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title="Current Focus">
        <div className="detail-list">
          {capacitorResearch.bullets.map((item) => (
            <div className="detail-row" key={item}>
              <span className="bullet-indicator"></span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

export function Publications() {
  return (
    <PageShell
      title="Articles, Preprints, and Technical Notes"
      summary="Formal materials connect research programs, tools, validation data, source code, and videos into one traceable engineering knowledge system."
    >
      <Section title="Publication Index">
        <div className="publication-list">
          {publications.map((publication) => (
            <PublicationItem key={publication.doi} publication={publication} />
          ))}
        </div>
      </Section>

      <Section title="Connected Research">
        <div className="publication-related-grid">
          <Link className="publication-related-link" to="/research">
            Capacitor Research
            <ArrowRight size={16} />
          </Link>
          <Link className="publication-related-link" to="/lab-notes">
            Research Log
            <ArrowRight size={16} />
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}

export function LabNotes() {
  return (
    <PageShell
      title="Research Log"
      summary="A working log for interim thoughts, observations, model notes, and results that may later become papers, tools, videos, or project tasks."
    >
      <Section title="Log Entries">
        <div className="lab-note-list">
          {labNotes.map((note) => (
            <article className="lab-note-entry" key={note.title}>
              <div className="lab-note-meta">
                <span>{note.date}</span>
                <span>{note.type}</span>
              </div>
              <h3>{note.title}</h3>
              <p className="lab-note-summary">{note.summary}</p>
              <div className="lab-note-body">
                {note.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="lab-note-links">
                {note.links.map((link) => (
                  <Link key={link.to} to={link.to}>
                    {link.label} <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="What Goes Here">
        <div className="detail-list">
          <div className="detail-row"><span className="bullet-indicator"></span><span>Interim findings from capacitor and MLCC research.</span></div>
          <div className="detail-row"><span className="bullet-indicator"></span><span>Measurement notes, modeling traps, strange component behavior, and open questions.</span></div>
          <div className="detail-row"><span className="bullet-indicator"></span><span>Working material that may later become articles, tools, videos, or project tasks.</span></div>
        </div>
      </Section>
    </PageShell>
  );
}

export function Projects() {
  return (
    <PageShell
      title="Open Projects"
      summary="A compact register of real hardware, software, and measurement work. Sections such as Tools, Research, and Education are not listed here as projects."
    >
      <Section title="Project Register">
        <div className="detail-list">
          <div className="detail-row">
            <span className="bullet-indicator"></span>
            <span>
              <strong>ADC Model:</strong> Python mathematical core and client simulator for acquisition, settling, nonlinear capacitors, FFT metrics, SINAD, and ENOB.
              {' '}<a className="link-arrow" href={adcToolHref} target="_blank" rel="noopener noreferrer">Open simulator <ExternalLink size={14} /></a>
            </span>
          </div>
          <div className="detail-row">
            <span className="bullet-indicator"></span>
            <span>
              <strong>MLCC Distortion Fixture:</strong> planned measurement setup for validating voltage-dependent capacitance and RC-filter distortion models.
              {' '}<Link className="link-arrow" to="/research">Related research <ArrowRight size={14} /></Link>
            </span>
          </div>
          <div className="detail-row">
            <span className="bullet-indicator"></span>
            <span>
              <strong>DSP PWM/PDM Spectrum Analyzer:</strong> candidate desktop software project for MCU timer PWM, delta-sigma PDM, FFT, occupied bandwidth, and aliasing analysis.
              {' '}<Link className="link-arrow" to="/tools">Tools catalog <ArrowRight size={14} /></Link>
            </span>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

export function Courses() {
  return (
    <PageShell
      title="Engineering Education"
      summary="Course pages will connect theory, tools, measurements, and open projects for practical signal-chain engineering."
    >
      <Section title="Planned Courses">
        <div className="content-grid three-columns">
          <LinkCard icon={<Activity size={20} />} title="Capacitor Research" text="MLCC behavior, charge-based models, distortion, bias memory, and precision signal-chain errors." to="/research" />
          <LinkCard icon={<Cpu size={20} />} title="Education Tools" text="Tools for drawing, animating, and explaining technical material in courses and videos." to="/education-tools" />
        </div>
      </Section>
    </PageShell>
  );
}

export function EducationTools() {
  return (
    <div className="education-tools-page container section">
      <div className="education-tools-header">
        <h1>HighSNR Circuit Builder</h1>
        <p>
          A visual circuit editor for building clean schematics and exporting Manim-ready Python code for videos, courses, and technical explanations.
        </p>
      </div>

      <div className="education-tool-card">
        <div className="education-tool-info">
          <div className="education-tool-status">
            <Activity size={12} />
            <span>Active Education Tool</span>
          </div>

          <h2>Visual Circuit Editor for Manim</h2>
          <p className="education-tool-desc">
            Draw electronic circuits directly in the browser, arrange components visually, add labels and simple shapes, then export a reusable Manim scene scaffold without hand-calculating coordinates.
          </p>

          <div className="education-tool-features">
            <div className="education-tool-feature">
              <span className="bullet-indicator"></span>
              <span><strong>Visual Circuit Layout:</strong> place resistors, capacitors, inductors, sources, switches, grounds, wires, labels, and SVG shapes.</span>
            </div>
            <div className="education-tool-feature">
              <span className="bullet-indicator"></span>
              <span><strong>Manim Export:</strong> generate Python code that uses the bundled <code>circuit_lib.py</code> component library.</span>
            </div>
            <div className="education-tool-feature">
              <span className="bullet-indicator"></span>
              <span><strong>Project Files:</strong> save and load JSON layouts for repeatable video and course production.</span>
            </div>
            <div className="education-tool-feature">
              <span className="bullet-indicator"></span>
              <span><strong>Clear Separation:</strong> it supports education and visualization while Engineering Tools stay focused on calculations and physical models.</span>
            </div>
          </div>

          <div className="cta-row">
            <a className="btn btn-primary" href={circuitBuilderHref} target="_blank" rel="noopener noreferrer">
              Launch Editor <ExternalLink size={18} />
            </a>
            <Link className="btn btn-secondary" to="/courses">
              Related Courses
            </Link>
          </div>
        </div>

        <div className="education-tool-preview">
          <div className="education-editor-mockup">
            <div className="education-mockup-header">
              <span>highsnr-circuit-builder v1.2</span>
              <span>LIVE</span>
            </div>
            <div className="education-mockup-image">
              <img src={editorScreenshot} alt="HighSNR Circuit Builder editor interface" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <PageShell
      title="HighSNR Engineering Lab"
      summary="Independent electronics research, open engineering tools, publications, videos, and technical education focused on real signal-chain limitations."
    >
      <Section title="Author Profile">
        <div className="about-profile">
          <figure className="about-portrait">
            <img src={authorPortrait} alt="Boris Kuznetsov" />
          </figure>

          <div className="about-profile-copy">
            <p>
              Boris Kuznetsov is a Professor and Electronics Engineer specializing in precision measurement systems and embedded electronics. His work focuses on analog and mixed-signal circuit design, high-speed PCB design, digital signal processing, and instrumentation systems.
            </p>
            <p>
              He is also the creator of the YouTube channel <a href="https://www.youtube.com/@High_SNR_Channel" target="_blank" rel="noopener noreferrer">@High_SNR_Channel</a>, where he shares educational content on electronics, circuit design, and hardware development.
            </p>
          </div>

          <div className="about-facts">
            <span>Precision measurement systems</span>
            <span>Analog and mixed-signal design</span>
            <span>High-speed PCB design</span>
            <span>DSP and instrumentation</span>
          </div>
        </div>
      </Section>

      <Section title="Official Links and Contact">
        <div className="about-link-list">
          {officialLinks.map((item) => (
            <AboutLinkRow key={item.label} {...item} />
          ))}
        </div>
      </Section>

      <Section title="Methodology">
        <div className="detail-list">
          <div className="detail-row"><span className="bullet-indicator"></span><span>Physical modeling and analytical derivation before interface work.</span></div>
          <div className="detail-row"><span className="bullet-indicator"></span><span>Numerical simulation, reproducible source code, and validation checks.</span></div>
          <div className="detail-row"><span className="bullet-indicator"></span><span>Public knowledge base linking research, tools, videos, courses, and open projects.</span></div>
        </div>
      </Section>
    </PageShell>
  );
}

export function Consulting() {
  return (
    <PageShell
      title="Engineering Review and Consulting"
      summary="Future services include ADC front-end review, capacitor nonlinearity audit, filter distortion analysis, custom modeling, and corporate training."
    >
      <Section title="Service Tracks">
        <div className="detail-list">
          <div className="detail-row"><span className="bullet-indicator"></span><span>ADC front-end design review and ENOB risk analysis.</span></div>
          <div className="detail-row"><span className="bullet-indicator"></span><span>Custom signal-chain models and validation reports.</span></div>
          <div className="detail-row"><span className="bullet-indicator"></span><span>Training and tool development for engineering teams.</span></div>
        </div>
      </Section>
    </PageShell>
  );
}

export function NotFound() {
  return (
    <PageShell
      title="Page Not Found"
      summary="This page is not part of the current HighSNR Lab map."
    >
      <Section title="Available Sections">
        <div className="cta-row">
          <Link className="btn btn-primary" to="/tools">Open Tools</Link>
          <Link className="btn btn-secondary" to="/research">Open Research</Link>
        </div>
      </Section>
    </PageShell>
  );
}
