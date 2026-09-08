import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '../router';
import './MlccDistortionMeterArchitecture.css';

const assetRoot = '/lab-notes/qa403-research-instrument';

export default function Qa403ResearchInstrument() {
  return (
    <article className="mlcc-architecture-page">
      <header className="mlcc-architecture-hero">
        <div className="container mlcc-architecture-hero-inner">
          <Link className="mlcc-architecture-back" to="/lab-notes">
            <ArrowLeft size={15} /> Research Log
          </Link>
          <p className="mlcc-architecture-kicker">Research Note · Measurement Infrastructure</p>
          <h1>From Budget Constraint to Measurement Platform</h1>
          <p className="mlcc-architecture-subtitle">Why the QuantAsylum QA403 changed the experimental plan</p>
          <p className="mlcc-architecture-lede">
            The QA403 is not being treated as a universal replacement for a high-end laboratory analyzer.
            It is being used as a practical, programmable measurement engine for the next stage of the
            HighSNR Lab MLCC research program.
          </p>
          <div className="mlcc-architecture-meta">
            <span>Boris Kuznetsov</span>
            <span>September 8, 2026</span>
            <span>Research note</span>
          </div>
        </div>
      </header>

      <div className="container mlcc-architecture-layout">
        <aside className="mlcc-architecture-toc" aria-label="Article contents">
          <span>Contents</span>
          <a href="#equipment-problem">The equipment problem</a>
          <a href="#requirements">Measurement requirements</a>
          <a href="#why-qa403">Why the QA403 fit</a>
          <a href="#programmability">The programming interface</a>
          <a href="#matt-quantasylum">The conversation with Matt</a>
          <a href="#received">The project is now moving</a>
          <a href="#disclosure">Disclosure and independence</a>
        </aside>

        <div className="mlcc-architecture-body">
          <div className="mlcc-architecture-status">
            <strong>Current project stage</strong>
            <p>
              The QA403 and the custom MLCC measurement PCB are now in hand. The next step is to establish
              a loopback baseline and validate the measurement procedure before starting the component
              comparison campaign.
            </p>
          </div>

          <figure className="mlcc-architecture-figure qa403-research-figure">
            <img
              src={`${assetRoot}/qa403-and-mlcc-test-board.png`}
              alt="QuantAsylum QA403 audio analyzer and the custom MLCC measurement PCB on a laboratory bench"
            />
            <figcaption>
              The QA403 analyzer and the custom MLCC measurement PCB now form the hardware foundation for
              the next stage of the research program.
            </figcaption>
          </figure>

          <section id="equipment-problem">
            <h2>The equipment problem</h2>
            <p>
              In an engineering research project, the availability of suitable test equipment can become
              the main constraint. For some time, I had been looking for an analyzer that would allow me
              to move from simulations to measurements of real ceramic capacitors in passive RC filters.
            </p>
            <p>
              Professional instruments capable of covering this class of work can cost several thousand
              dollars. For an independent research project, that creates a practical barrier: the
              experimental part of the program has to wait until the equipment budget becomes available.
            </p>
            <p>
              The goal was therefore not to find the most capable analyzer on the market. The goal was to
              find an instrument whose measured performance and workflow were sufficient for the specific
              research questions at the current stage.
            </p>
          </section>

          <section id="requirements">
            <h2>What the measurement system needed to do</h2>
            <p>
              The instrument had to support a repeatable workflow for studying voltage-dependent
              nonlinearity in Class II MLCCs. The practical requirements were:
            </p>
            <ul className="mlcc-architecture-list">
              <li>Measure small nonlinear distortion components with a sufficiently low noise and distortion floor.</li>
              <li>Generate and acquire controlled analog signals through a real passive filter and capacitor under test.</li>
              <li>Support measurements across frequency, signal level, and DC-bias conditions.</li>
              <li>Provide enough input flexibility for the voltage and current channels of the test fixture.</li>
              <li>Allow the measurement process and data analysis to be automated in Python.</li>
            </ul>
            <p>
              These requirements are narrower than the specification of a general-purpose metrology
              instrument. They are also more useful for deciding whether a particular instrument can answer
              a particular research question.
            </p>
          </section>

          <section id="why-qa403">
            <h2>Why the QA403 was a practical fit</h2>
            <p>
              The QuantAsylum QA403 matched the key requirements of the current measurement plan. It
              supports THD, THD+N, noise, and frequency-response measurements, as well as automated sweeps
              such as distortion versus frequency or signal level.
            </p>
            <p>
              Its differential inputs, multiple input ranges, and isolated architecture are useful for
              analog test circuits where signal integrity and ground-loop problems can affect the result.
              The analyzer can provide the stimulus and acquire the response from the same measurement
              setup, which is important when the test is intended to compare small distortion components.
            </p>
            <p>
              The conclusion was not that the QA403 would solve every measurement problem. The conclusion
              was that its capabilities were adequate for the next experiment: comparing real X7R capacitors
              under controlled DC bias and connecting the measurements to the models developed in AN-001.
            </p>
          </section>

          <section id="programmability">
            <h2>The programming interface changes the workflow</h2>
            <p>
              The feature that mattered most was not a single number in the specification sheet. It was
              the software interface.
            </p>
            <p>
              The QA403 exposes a local HTTP API based on GET and PUT requests. External software can use
              the interface to control measurements and retrieve both processed results and raw time- and
              frequency-domain data. The connection is local to the QA403 application; it is not a claim
              that the instrument is controlled by a generic network protocol directly over the Internet.
            </p>
            <p>
              This makes it possible to treat the analyzer as part of a reproducible research workflow
              rather than as a device operated only from a graphical interface. Measurement setup, sweep
              control, data capture, FFT processing, and result storage can be connected in one versioned
              Python workflow.
            </p>
            <p>
              That changes the structure of the research program. Until now, much of the work had focused
              on vendor C–V data, charge-based Q(V) models, simulations, and analytical estimates of
              distortion. The QA403 makes it possible to compare those predictions with the behavior of
              real components in a real circuit.
            </p>
          </section>

          <section id="matt-quantasylum">
            <h2>The conversation with Matt</h2>
            <p>
              The communication with Matt from QuantAsylum was an important part of the decision. After I
              described the project, Matt did not simply suggest a product. He proposed a concrete
              experiment: compare 6.3 V and 50 V X7R capacitors at different DC-bias levels.
            </p>
            <p>
              He also pointed out that C0G/NP0 capacitors might be below the QA403 measurement floor. That
              observation is useful because it defines the role of the control measurement. A result below
              the instrument floor is not automatically a failed experiment; it can establish the practical
              sensitivity limit of the complete measurement path.
            </p>
            <p>
              This moved the discussion from a general request for equipment to a specific research
              question that both sides could understand and evaluate.
            </p>
          </section>

          <section id="received">
            <h2>The project is now moving</h2>
            <p>
              In early August, QuantAsylum provided a QA403 as a promotional unit at no cost. The analyzer
              arrived in late August, and the custom measurement PCB has now arrived as well.
            </p>
            <p>
              The project has therefore moved from simulation and measurement-system design to physical
              validation. The first measurement sequence will include a loopback baseline, a check of the
              residual distortion and noise floor, and a controlled comparison of X7R parts rated for 6.3 V
              and 50 V. C0G/NP0 parts will serve as a control where their signal remains measurable above the
              system floor.
            </p>
            <p>
              The measurement results will then be compared with the predictions from the existing MLCC
              models and used to define the next revision of the test procedure.
            </p>
          </section>

          <section id="disclosure">
            <h2>Disclosure and independence</h2>
            <p>
              QuantAsylum provided the instrument in support of this research. The measurement methods,
              data processing, and technical conclusions remain independent. This support will be disclosed
              in every publication that uses the QA403.
            </p>
            <p>
              The purpose of this note is not to present a product endorsement or a complete product review.
              It documents an equipment decision and explains why a programmable, accessible instrument can
              change the structure of an independent research program.
            </p>
            <div className="mlcc-architecture-conclusion">
              <p className="mlcc-architecture-kicker">Research transition</p>
              <h2>From predicted behavior to measured behavior</h2>
              <p>
                The QA403 does not replace the models, the test fixture, or the need for calibration. It
                makes the next question possible: how closely does the behavior of a real MLCC in a real
                filter match the behavior predicted by the model?
              </p>
            </div>
          </section>

          <section className="mlcc-architecture-references" aria-labelledby="references-title">
            <h2 id="references-title">References</h2>
            <ul>
              <li>
                <a href="https://quantasylum.com/products/qa403-audio-analyzer" target="_blank" rel="noopener noreferrer">
                  QuantAsylum: QA403 Audio Analyzer
                </a>
              </li>
              <li>
                <Link to="/application-notes/an-001">HighSNR Lab: AN-001 — Frequency-Dependent Distortion in Class II Ceramic Capacitors</Link>
              </li>
              <li>
                <Link to="/lab-notes/mlcc-distortion-meter-functional-architecture">HighSNR Lab: Measuring MLCC Distortion Under DC Bias</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <footer className="mlcc-architecture-cta">
        <div className="container mlcc-architecture-cta-inner">
          <div>
            <p className="mlcc-architecture-kicker">Related research</p>
            <h2>Follow the measurement campaign</h2>
            <p>The next note will document the baseline, fixture, and first comparison measurements.</p>
          </div>
          <div className="mlcc-architecture-cta-actions">
            <Link className="btn btn-primary" to="/research">
              Capacitor research <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-secondary" to="/lab-notes">
              Research Log <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
