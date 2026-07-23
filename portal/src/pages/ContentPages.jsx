import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Cpu, ExternalLink, Globe2, Mail } from 'lucide-react';
import editorScreenshot from '../assets/editor-screenshot.png';
import authorPortrait from '../assets/boris-kuznetsov-portrait.jpg';
import './EducationTools.css';
import './Publications.css';

const adcToolHref = import.meta.env.DEV ? 'http://localhost:8000/' : 'https://adc.highsnr.org';
const circuitBuilderHref = '/education-tools/highsnr-circuit-builder/app/index.html';
const mlccResearchPlanHref = '/research/mlcc-research-directions-2026-07-16.md';
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
    'HighSNR Lab focuses on real capacitor behavior in precision electronics: MLCC bias, charge nonlinearity, distortion, settling, measurement methods, and practical design rules.',
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
  program: [
    {
      title: 'Physics and Q(V) formalism',
      status: 'Most developed',
      text: 'Charge-based nonlinear capacitor models, analytical harmonic estimates, and validation against real DC-bias curves from vendor data.',
      output: 'Flagship theory article for signal-integrity readers.',
    },
    {
      title: 'THD methodology for passive filters',
      status: 'Tool-backed',
      text: 'Simulation methods for passive RC/filter networks with voltage-dependent Class II capacitors, supported by open engineering tools.',
      output: 'Practical article and reusable simulator workflow.',
    },
    {
      title: 'Circuit-level distortion compensation',
      status: 'High novelty',
      text: 'Anti-parallel capacitor arrangements, bias-point selection, value splitting, and residual-distortion estimates for practical mitigation.',
      output: 'Application-oriented article for analog design engineers.',
    },
    {
      title: 'Behavioral SPICE and system models',
      status: 'Vendor-facing',
      text: 'Limits of C(Vdc)-interpolation models and a path toward charge-based Q(V) formulations for predicting distortion.',
      output: 'Targeted material for application engineers at component vendors.',
    },
    {
      title: 'Measurement stand and experimental validation',
      status: 'In progress',
      text: 'A dedicated measurement board, QA403-based THD workflow, NPR-style wideband tests, and temperature-dependent characterization.',
      output: 'Experimental validation articles planned for winter 2026/27.',
    },
  ],
  roadmap: [
    'Publish the Q(V) formalism and physical distortion mechanism as the flagship theory piece.',
    'Turn the passive-filter simulator workflow into a practical engineering article.',
    'Develop compensation methods for reducing MLCC distortion in real circuits.',
    'Document the limits of common vendor SPICE models and propose charge-based improvements.',
    'Build the measurement stand and validate theory with measured THD, NPR, bias, and temperature data.',
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

      <Section title="Research Program Plan">
        <div className="research-plan">
          <p className="research-plan-lede">
            The active program remains one research area - real capacitor behavior - but it is now organized as a practical publication and measurement roadmap.
          </p>
          <div className="research-plan-list">
            {capacitorResearch.program.map((item) => (
              <article className="research-plan-item" key={item.title}>
                <div className="research-plan-heading">
                  <h3>{item.title}</h3>
                  <span>{item.status}</span>
                </div>
                <p>{item.text}</p>
                <small>{item.output}</small>
              </article>
            ))}
          </div>
          <a className="research-plan-link" href={mlccResearchPlanHref} target="_blank" rel="noopener noreferrer">
            Open full working plan <ExternalLink size={14} />
          </a>
        </div>
      </Section>

      <Section title="Publication Roadmap">
        <div className="detail-list">
          {capacitorResearch.roadmap.map((item) => (
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

export function DesignReview() {
  return (
    <PageShell
      title="Design Review"
      summary="Independent engineering assessment of precision analog and mixed-signal hardware."
    >
      <Section title="Overview & Scope">
        <div className="publication-list">
          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Who This Service Is For</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Target Audience & Projects</h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
                <li>Hardware teams approaching a first or second prototype without a dedicated precision analog specialist.</li>
                <li>Developers of scientific instrumentation, DAQ systems, laboratory equipment, and precision sensor interfaces.</li>
                <li>Engineering teams dealing with excess noise, thermal drift, unstable ADC codes, slow settling, or discrepancies between simulation and measurement.</li>
                <li>Projects where the cost of a board spin or missed specification is significantly higher than the cost of an independent review.</li>
              </ul>
            </div>
            <aside className="publication-actions">
              <a href="mailto:info@highsnr.org?subject=Design Review Evaluation">Contact Us <ArrowRight size={14} /></a>
            </aside>
          </article>

          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>What We Review</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Technical Coverage</h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
                <li>Sensor front-ends for thermocouples, RTDs, strain gauges, photodiodes, piezo sensors, and high-impedance sources.</li>
                <li>Drivers and buffers for high-resolution ADCs.</li>
                <li>Active and passive anti-aliasing, notch, low-pass, and high-pass filters.</li>
                <li>Voltage-reference circuitry: filtering, buffering, distribution, and dynamic load handling.</li>
                <li>Precision current sources, instrumentation amplifiers, and transimpedance amplifiers.</li>
                <li>PCB regions that directly affect analog noise, stability, reference integrity, return paths, and measurement accuracy.</li>
              </ul>
            </div>
          </article>
          
          <article className="publication-item" style={{ borderBottom: 'none' }}>
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Typical Problems</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Common Issues Identified</h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
                <li>MLCC nonlinearities, DC-bias derating, and shifts in filter characteristics.</li>
                <li>Insufficient phase margin, ringing, and incomplete settling in ADC drivers.</li>
                <li>Noise sources that limit effective resolution and dynamic range.</li>
                <li>Incorrect SPICE assumptions, incomplete component models, and unmodeled parasitics.</li>
                <li>Layout risks in voltage references, power delivery, return-current paths, and sensitive analog nodes.</li>
                <li>Thermal drift, tolerance accumulation, common-mode violations, and operating-limit problems.</li>
              </ul>
            </div>
          </article>
        </div>
      </Section>

      <Section title="Service Packages & Deliverables">
        <div className="publication-list">
          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Deliverables</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>What You Receive</h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
                <li>A concise executive summary for project leads.</li>
                <li>Critical / Major / Minor findings linked to specific circuits and design decisions.</li>
                <li>Annotated schematic fragments and quantitative calculations where required.</li>
                <li>Concrete recommendations for components, values, topology, and test conditions.</li>
                <li>A validation plan identifying the measurements needed to confirm the revised design.</li>
                <li>One written clarification round within the agreed review scope.</li>
              </ul>
            </div>
          </article>

          <article className="publication-item" style={{ borderBottom: 'none' }}>
            <div className="publication-main" style={{ gridColumn: '1 / -1' }}>
              <div className="publication-meta-row">
                <span>Packages & Pricing</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Service Packages</h3>
              <div className="packages-table-wrapper" style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                <table className="packages-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-base)' }}>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Package</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Pricing & timeline</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Best suited for</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Deliverables</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>Expert Audit</td>
                      <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>From $2,000<br/>7-10 days</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>One well-defined signal chain and one primary operating mode.</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>8-12 page report, prioritized risks, high-level noise budget, actionable recommendations.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>Comprehensive Audit</td>
                      <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>From $5,000<br/>10-15 days</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>One highly complex chain or two interconnected chains.</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>Detailed noise, stability, and settling analysis; agreed critical PCB areas; 15-25 page report.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>System-Level Review</td>
                      <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>From $8,000<br/>15-30 days</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>Multi-mode or multi-channel precision systems.</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>Advanced calculations, in-depth simulation, review of the agreed precision-analog PCB scope, and a laboratory validation plan.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>Custom Project</td>
                      <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>Upon request</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>Three or more independent chains, complete DAQ systems, or complex instrumentation.</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>Custom scope, price, milestones, and schedule after initial material review.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.9rem' }}><strong>Why prices are listed as "From".</strong> Analog design complexity is driven by the number of gain stages, operating modes, performance targets, model availability, and PCB-analysis depth—not simply by component count. After reviewing your materials, we provide a fixed-price Scope of Work. There are no hourly overages within the agreed scope.</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>What we mean by one signal chain.</strong> One continuous functional path from a sensor or input connector to the ADC input or another agreed output node. Shared references, supplies, multiplexers, and multiple operating modes may increase the project scope.</p>
            </div>
          </article>
        </div>
      </Section>

      <Section title="Process & Requirements">
        <div className="publication-list">
          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Workflow</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>How the Process Works</h3>
              <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
                <li>Submit your schematic, requirements, and a short description of the design challenge.</li>
                <li>We confirm technical fit and, when needed, execute an NDA before full documentation is transferred.</li>
                <li>Within 1-2 business days after receiving sufficient material, we issue a fixed-price Scope of Work and delivery schedule.</li>
                <li>After payment according to the proposal, we review the identified design revision.</li>
                <li>You receive the PDF report and may submit one written clarification round within 10 business days.</li>
              </ol>
            </div>
          </article>

          <article className="publication-item" style={{ borderBottom: 'none' }}>
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Requirements</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>What We Need to Start</h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', marginBottom: '1rem' }}>
                <li>Searchable vector PDF of the schematic.</li>
                <li>Input signal range, source type, and source impedance.</li>
                <li>Target bandwidth, sampling rate, and ADC operating mode.</li>
                <li>Required accuracy, noise performance, dynamic range, and settling time.</li>
                <li>Temperature range, supply limits, and component constraints.</li>
                <li>PCB data when layout review is included.</li>
              </ul>
              <p style={{ fontSize: '0.95rem', margin: 0 }}><strong>EDA-neutral workflow.</strong> Native EDA project files are useful supplementary material but are not required for initial qualification. For PCB analysis, IPC-2581 or ODB++ is preferred; an extended Gerber package may also be accepted. File conversion, schematic reconstruction, and recovery of missing engineering data are quoted separately when required.</p>
            </div>
          </article>
        </div>
      </Section>

      <Section title="Additional Information">
        <div className="publication-list">
          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Sample Report</span>
              </div>
              <h3>See the Review Before You Commit</h3>
              <p className="publication-summary" style={{ margin: 0 }}>A demonstration report based on a HighSNR reference design shows the structure, analytical depth, risk classification, and style of recommendations you can expect. It is not derived from client materials.</p>
            </div>
            <aside className="publication-actions">
              <a href="#" target="_blank" rel="noopener noreferrer">View Sample <ExternalLink size={14} /></a>
            </aside>
          </article>

          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Expertise</span>
              </div>
              <h3>Review Led by Principal Engineer</h3>
              <p className="publication-summary" style={{ margin: 0 }}>Each review is conducted or directly supervised by Boris Kuznetsov. Core engineering analysis is not delegated to anonymous junior reviewers or outsourced without the client's prior written approval.</p>
            </div>
            <aside className="publication-actions">
              <Link to="/about">About the Author <ArrowRight size={14} /></Link>
              <Link to="/publications">Research & Papers <ArrowRight size={14} /></Link>
              <a href={import.meta.env.DEV ? 'http://localhost:5174/videos_project/' : '/videos_project/'}>Videos <ArrowRight size={14} /></a>
            </aside>
          </article>

          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Terms</span>
              </div>
              <h3>Confidentiality</h3>
              <p className="publication-summary" style={{ margin: 0 }}>We can execute a Non-Disclosure Agreement before you transfer complete documentation. Project materials are accessible only to personnel explicitly assigned to the review. They are not shared with third parties, used for model training, or included in publications, demonstrations, or benchmarks without your written permission. Retention and deletion requirements can be specified in the NDA or Scope of Work.</p>
            </div>
          </article>

          <article className="publication-item">
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>Terms</span>
              </div>
              <h3>Scope and Limitations</h3>
              <p className="publication-summary">The service focuses on precision analog and mixed-signal performance. High-current power electronics, RF and microwave design above 100 MHz, antenna design, standalone digital-logic auditing, firmware, FPGA development, and formal metrological certification are outside the primary scope. These areas are considered only when they directly affect the agreed analog signal chain.</p>
              <p className="publication-summary" style={{ margin: 0 }}>The review applies only to the submitted and identified schematic and PCB revision. It is an independent engineering assessment based on the information provided and does not replace prototype testing, formal certification, or laboratory validation. Review of a modified revision is quoted separately unless explicitly included in the Scope of Work.</p>
            </div>
          </article>

          <article className="publication-item" style={{ borderBottom: 'none' }}>
            <div className="publication-main">
              <div className="publication-meta-row">
                <span>FAQ</span>
              </div>
              <h3 style={{ marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
              <div className="faq-item" style={{ marginBottom: '1.25rem' }}>
                <p><strong>Do I need to send native EDA files?</strong><br/>No. A searchable vector PDF is sufficient for initial qualification. Native project files can be supplied as supplementary material.</p>
              </div>
              <div className="faq-item" style={{ marginBottom: '1.25rem' }}>
                <p><strong>Can I submit an incomplete project package?</strong><br/>Yes, for preliminary qualification. A fixed-price proposal and engineering work can begin after the minimum technical information has been provided.</p>
              </div>
              <div className="faq-item" style={{ marginBottom: '1.25rem' }}>
                <p><strong>Is the preliminary evaluation free?</strong><br/>The initial fit and scope assessment is normally provided without charge. It confirms required inputs, price, and schedule; it does not include engineering findings or design recommendations.</p>
              </div>
              <div className="faq-item" style={{ marginBottom: '1.25rem' }}>
                <p><strong>Does the review guarantee final hardware performance?</strong><br/>No. The review reduces engineering risk and identifies likely performance limitations, but final performance must be confirmed on physical hardware.</p>
              </div>
              <div className="faq-item" style={{ marginBottom: '1.25rem' }}>
                <p><strong>Can you check the corrected revision?</strong><br/>Yes. A focused Revision Check can verify whether agreed Critical and Major findings were addressed. It is quoted separately or included in selected scopes.</p>
              </div>
            </div>
          </article>
        </div>
      </Section>

      <Section title="Ready to proceed?">
        <div className="publication-list" style={{ borderTop: 'none' }}>
          <article className="publication-item" style={{ borderBottom: 'none' }}>
            <div className="publication-main">
              <p style={{ margin: 0 }}>Initial qualification response within 1-2 business days after sufficient material is received.</p>
            </div>
            <aside className="publication-actions">
              <a href="mailto:info@highsnr.org?subject=Design Review Evaluation">Submit Design <ArrowRight size={14} /></a>
            </aside>
          </article>
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
