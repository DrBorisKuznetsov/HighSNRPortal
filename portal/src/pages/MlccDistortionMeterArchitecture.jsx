import React from 'react';
import { ArrowLeft, ArrowRight, Mail, Download } from 'lucide-react';
import { Link } from '../router';
import './MlccDistortionMeterArchitecture.css';

const assetRoot = '/lab-notes/mlcc-distortion-meter-functional-architecture';

function Equation({ children }) {
  return <div className="mlcc-architecture-equation">{children}</div>;
}

function Figure({ src, alt, caption }) {
  return (
    <figure className="mlcc-architecture-figure">
      <img src={`${assetRoot}/${src}`} alt={alt} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function MlccDistortionMeterArchitecture() {
  return (
    <article className="mlcc-architecture-page">
      <header className="mlcc-architecture-hero">
        <div className="container mlcc-architecture-hero-inner">
          <Link className="mlcc-architecture-back" to="/lab-notes">
            <ArrowLeft size={15} /> Research Log
          </Link>
          <p className="mlcc-architecture-kicker">MLCC Distortion Meter · Engineering Note 001</p>
          <h1>Measuring MLCC Distortion Under DC Bias</h1>
          <p className="mlcc-architecture-subtitle">A two-channel system architecture</p>
          <p className="mlcc-architecture-lede">
            Distortion in the measured capacitor current can originate in the generator, output stage,
            bias network, or measurement path. The architecture therefore records the actual MLCC
            voltage and current simultaneously while applying DC bias.
          </p>
          <div className="mlcc-architecture-meta">
            <span>Boris Kuznetsov</span>
            <span>August 2, 2026</span>
            <span>Design-stage note</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <a 
              href={`${assetRoot}/high-snr-lab-en-001-mlcc-distortion-meter-v4.pdf`}
              target="_blank" 
              rel="noopener noreferrer" 
              download
              className="mlcc-architecture-back"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-base)', padding: '0.5rem 0.8rem', borderRadius: '4px', textDecoration: 'none' }}
            >
              <Download size={15} /> Download PDF
            </a>
          </div>
        </div>
      </header>

      <div className="container mlcc-architecture-layout">
        <aside className="mlcc-architecture-toc" aria-label="Article contents">
          <span>Contents</span>
          <a href="#two-signals">Voltage and current</a>
          <a href="#dc-bias">DC bias injection</a>
          <a href="#voltage-channel">Voltage channel</a>
          <a href="#current-channel">Current channel</a>
          <a href="#qa403">QA403 acquisition</a>
          <a href="#driver-limits">Driver limits</a>
          <a href="#error-budget">Error budget</a>
        </aside>

        <div className="mlcc-architecture-body">
          <div className="mlcc-architecture-status">
            <strong>Current project stage</strong>
            <p>
              The signal paths and the purpose of each major block are defined. Circuit implementation,
              component values, calibration, and the final analysis algorithm remain subjects of later
              engineering notes.
            </p>
          </div>

          <p>
            The measurement path starts with a series circuit: a signal source, the MLCC under test, and
            a current-sense resistor. Testing a Class 2 MLCC adds three constraints. The capacitor must
            operate under DC bias, its voltage must be measured directly across its terminals, and the
            test setup must contribute less distortion than the device under test.
          </p>

          <section id="two-signals">
            <h2>Why measure voltage and current at the same time?</h2>
            <p>
              An MLCC is a two-terminal device. The generator setting <code>U_G</code> is not necessarily
              the voltage that appears across those terminals. Some of the applied voltage drops across
              the series impedances, and the output stage can introduce gain error, phase shift, and
              distortion. The instrument therefore records both the actual capacitor voltage
              <code> U_C</code> and the capacitor current <code>I_C</code>.
            </p>
            <p>For an ideal linear capacitor, current is given by</p>
            <Equation>i(t) = C · du(t)/dt</Equation>
            <p>
              If the voltage is sinusoidal and the capacitance is constant, the current is sinusoidal as
              well. In a nonlinear dielectric, charge is no longer proportional to voltage, so the more
              useful relationship is <code>i(t) = dq(u)/dt</code>. The current can then contain additional
              harmonics even when the voltage remains close to a sine wave.
            </p>
            <p>
              Source and driver harmonics appear first in <code>U_C</code> and then in <code>I_C</code>. A
              current-only measurement could incorrectly attribute them to the MLCC. Capturing both
              signals gives the analysis the actual amplitude, phase, and waveform applied to the DUT.
            </p>
            <Figure
              src="01-basic-capacitor-test-circuit.png"
              alt="Basic test circuit with a signal source, capacitor under test, and current-sense resistor"
              caption="Figure 1. The starting circuit applies an AC test voltage and provides separate voltage and current measurements."
            />
          </section>

          <section id="dc-bias">
            <h2>Adding DC bias without back-driving the source</h2>
            <p>
              The effective capacitance of a Class 2 ceramic capacitor depends on both DC and AC voltage.
              DC bias sets the operating point on the nonlinear charge-voltage curve; sine-wave amplitude
              determines how far the device moves around that point during each cycle.
            </p>
            <p>
              The external bias voltage cannot simply be tied to the QA403 output. The source must be
              isolated from DC, while the test circuit still needs enough AC drive current. The output
              buffer, coupling capacitor <code>C_D</code>, and bias-injection network perform those jobs.
            </p>
            <p>
              The buffer presents a light load to the QA403 and supplies the required test current.
              <code> C_D</code> passes the AC stimulus while blocking DC from the buffer and generator.
              The bias supply <code>U_DCB</code> feeds the test node through <code>R_DCB</code>, which provides
              a charging path and limits AC current into the bias supply.
            </p>
            <Figure
              src="02-ac-excitation-with-dc-bias.png"
              alt="AC excitation and DC-bias injection for the capacitor under test"
              caption="Figure 2. The buffer and C_D deliver the AC stimulus, while R_DCB injects DC bias at the test node."
            />
            <p>
              The impedance of the <code>R_DCB</code> branch, including the bias supply output impedance,
              must remain high enough across the measurement band. Otherwise, some AC current will be
              diverted into the bias supply instead of flowing through the DUT.
            </p>
            <p>
              The coupling capacitor is part of the measurement path. Its capacitance, dielectric,
              voltage rating, frequency response, and residual nonlinearity all affect measurement accuracy.
            </p>
          </section>

          <section id="voltage-channel">
            <h2>Measuring the capacitor voltage differentially</h2>
            <p>
              The lower DUT terminal connects to <code>R_L</code>, not directly to ground. The MLCC voltage is
            </p>
            <Equation>U_C = V_TOP − V_BOTTOM</Equation>
            <p>
              A single-ended measurement of the upper terminal would include the voltage across the
              current-sense resistor. The voltage channel must measure the difference between the two
              capacitor terminals.
            </p>
            <p>
              Figure 3 shows <code>C_1</code>, <code>C_2</code>, and a differential buffer ahead of the
              voltage channel. Channel accuracy depends on matching the full complex impedance of both
              legs across the measurement band—not just nominal capacitance. Input resistance, phase
              shift, leakage, and voltage-dependent capacitance all matter.
            </p>
            <p>
              The triangle represents the function of the voltage channel, not a committed circuit
              implementation. The detailed input-stage design will determine the required DC-fault
              protection, scaling, input impedance, and isolation.
            </p>
          </section>

          <section id="current-channel">
            <h2>Converting capacitor current into a voltage</h2>
            <p>
              If the voltage channel has sufficiently high input impedance, essentially all capacitor
              current flows through <code>R_L</code>. The shunt voltage is
            </p>
            <Equation>U_RL = I_C · R_L</Equation>
            <p>With current-channel amplifier gain <code>A_I</code>, the output becomes</p>
            <Equation>U_I = A_I · R_L · I_C</Equation>
            <p>
              Figure 3 labels this output as <code>K × I_C</code>, where <code>K</code> is the overall
              transimpedance in volts per ampere. It includes <code>R_L</code>, analog gain, and any later
              calibration factor.
            </p>
            <p>
              Increasing <code>R_L</code> improves sensitivity but also raises the shunt voltage and reduces
              the voltage left across the MLCC. A smaller shunt interferes less with the test condition,
              at the cost of a lower signal and a more demanding low-noise amplifier.
            </p>
          </section>

          <section id="qa403">
            <h2>Using the QA403 as source and acquisition engine</h2>
            <p>
              The QA403 generates the stimulus and records both measurement channels. One input receives
              the signal proportional to the actual capacitor voltage <code>U_C</code>; the other receives
              <code> K × I_C</code>. Both waveforms and spectra are available from the same acquisition.
            </p>
            <p>
              These labels refer to calibrated representations of the physical quantities. Coupling
              capacitors, input impedances, the current shunt, and amplifiers all sit between the DUT and
              the acquired data. Calibration must account for their amplitude and phase response.
            </p>
            <Figure
              src="03-meter-functional-architecture.png"
              alt="Functional architecture with separate voltage and current channels connected to the QA403"
              caption="Figure 3. The QA403 provides the stimulus and records two calibrated signals: MLCC voltage and MLCC current."
            />
          </section>

          <section id="driver-limits">
            <h2>Higher frequency demands more from the driver</h2>
            <p>
              Capacitive reactance falls as frequency rises. For a fixed sinusoidal voltage, current
              through a linear capacitor increases approximately as
            </p>
            <Equation>I_C,RMS ≈ 2πf · C_EFF · U_C,RMS</Equation>
            <p>
              The driver will hold the requested MLCC voltage only while it can supply that current.
              Near its limits, voltage drop across the output impedance, <code>R_G</code>, and <code>R_L</code>
              becomes more significant. Current limiting or insufficient slew rate can reduce
              <code> U_C</code> and distort its waveform.
            </p>
            <p>
              At the low end of the band, <code>C_D</code>, <code>C_1</code>, and <code>C_2</code> form
              high-pass networks with surrounding resistances. At the high end, usable bandwidth is
              limited by output current, active-stage speed, and measurement-channel response.
            </p>
          </section>

          <section id="error-budget">
            <h2>The test setup must be more linear than the DUT</h2>
            <p>
              The output buffer, coupling capacitor, bias network, shunt, differential voltage channel,
              and current amplifier can all generate distortion. If their contribution is comparable to
              the MLCC contribution, the analyzer measures the combined test setup rather than the
              capacitor alone.
            </p>
            <p>
              Before comparing MLCCs, the setup needs a baseline: noise and residual-distortion
              measurements, a suitably linear reference device, and amplitude-and-phase characterization
              of both channels. These measurements will form a separate calibration procedure.
            </p>
            <p>
              DC bias also introduces safety requirements. Coupling and protection components need
              adequate voltage ratings, stored charge must be discharged in a controlled way, and faults
              in the output buffer or bias supply must not reach the analyzer or DUT.
            </p>
            <div className="mlcc-architecture-conclusion">
              <p className="mlcc-architecture-kicker">Architecture outcome</p>
              <h2>Four functions now have separate error budgets</h2>
              <p>
                The design separates AC generation, DC-bias injection, differential DUT-voltage
                measurement, and current-to-voltage conversion. Each path can now receive its own level
                range, bandwidth, error budget, and residual-distortion target.
              </p>
            </div>
          </section>

          <section className="mlcc-architecture-references" aria-labelledby="references-title">
            <h2 id="references-title">References</h2>
            <ul>
              <li>
                <a href="https://article.murata.com/en-eu/article/voltage-characteristics-of-electrostatic-capacitance" target="_blank" rel="noopener noreferrer">
                  Murata: The voltage characteristics of electrostatic capacitance
                </a>
              </li>
              <li>
                <a href="https://article.murata.com/en-global/article/heat-generation-characteristics-capacitors-measurement" target="_blank" rel="noopener noreferrer">
                  Murata: Heat-generation characteristics of capacitors and measurement methods
                </a>
              </li>
              <li>
                <a href="https://quantasylum.com/products/qa403-audio-analyzer" target="_blank" rel="noopener noreferrer">
                  QuantAsylum: QA403 Audio Analyzer
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <footer className="mlcc-architecture-cta">
        <div className="container mlcc-architecture-cta-inner">
          <div>
            <p className="mlcc-architecture-kicker">Next engineering note</p>
            <h2>Input stages, matching, protection, and simulation</h2>
            <p>Technical comments on this architecture and its error sources are welcome.</p>
          </div>
          <div className="mlcc-architecture-cta-actions">
            <a className="btn btn-primary" href="mailto:info@highsnr.org?subject=MLCC%20distortion%20meter%20architecture">
              <Mail size={17} /> Send technical feedback
            </a>
            <Link className="btn btn-secondary" to="/research">
              Capacitor research <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
