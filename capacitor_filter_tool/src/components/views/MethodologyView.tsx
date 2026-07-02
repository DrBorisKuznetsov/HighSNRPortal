import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, BookOpen, CircleHelp, Database, Download, Home, RadioTower, RotateCcw, SlidersHorizontal, Waves } from "lucide-react";
import { ChartPanel } from "../ChartPanel";
import { NumericField } from "../NumericField";
import { buildCapacitanceCurve, capacitorPresetGroups, capacitorPresets, defaultCapacitorPresetId, estimatePolynomialCoefficients, getCapacitorPreset, type CapacitorPresetId } from "../../data/capacitorLibrary";
import { calculateCutoffFrequency, calculateFrequencyResponse, defaultFrequencyRange, type FrequencyRange, type RcTopology } from "../../solver/acResponse";
import { formatDb, formatEngineering, formatHz, formatPhase } from "../../solver/format";
import { defaultNonlinearSettings, defaultNonlinearSignal, simulateNonlinearDistortion, sweepNonlinearDistortionByFrequency, type DistortionSweepPoint, type NonlinearSimulationSettings, type NonlinearSignal } from "../../solver/nonlinearDistortion";
import { isPowerOfTwo, formatVoltsPeak, formatVolts, formatDbc, formatPercent, formatNumber, formatCompactUnit, positiveAmplitude } from "../../utils/formatters";
import { buildLinearCsv, buildNonlinearCsv, validateLinearInputs, validateNonlinearInputs, validateComponentInputs, modeLabel } from "../../utils/helpers";
import { type OpenMethodology, type AnalysisMode, topologyLabels } from "../../app/App";
import { MethodText } from "../ui/MethodText";
import { Readout } from "../ui/Readout";
import { Metric } from "../ui/Metric";
import { FilterSchematic } from "../ui/FilterSchematic";
import { HarmonicAmplitudeChart } from "../ui/HarmonicAmplitudeChart";

export function MethodologyView() {
  return (
    <section className="methodology-view" aria-label="Calculated parameters and units">
      <header className="method-header">
        <div>
          <span className="method-eyebrow">Metric reference</span>
          <h1>Calculated Parameters and Units</h1>
          <p>
            Definitions, formulas and units used in result cards, tables and
            charts. The sections are linked from the small info icons near each
            calculated parameter.
          </p>
        </div>
      </header>

      <div className="method-layout">
        <nav className="method-toc" aria-label="Methodology contents">
          <a href="#method-units">Units and notation</a>
          <a href="#method-signal">Signal parameters</a>
          <a href="#method-linear">AC response metrics</a>
          <a href="#method-capacitance">Capacitance metrics</a>
          <a href="#method-harmonics">Harmonics</a>
          <a href="#method-thd">THD and dBc</a>
          <a href="#method-sweep">Sweep charts</a>
          <a href="#method-solver">Solver record</a>
          <a href="#method-limits">Interpretation limits</a>
        </nav>

        <div className="method-content">
          <section id="method-units" className="method-section">
            <span className="method-section-index">01</span>
            <div>
              <h2>Units and notation</h2>
              <p>
                Numeric values use engineering units in the interface and SI units in
                calculations. Logarithmic values are amplitude ratios unless the
                formula explicitly uses power.
              </p>
              <table className="definition-table">
                <tbody>
                  <tr><th>Hz</th><td>Frequency in cycles per second. kHz and MHz are compact display forms.</td></tr>
                  <tr><th>V</th><td>Voltage. DC bias is shown in volts.</td></tr>
                  <tr><th>Vpk</th><td>Peak sinusoidal amplitude measured from zero to the waveform peak.</td></tr>
                  <tr><th>F</th><td>Capacitance in farads. nF, uF and pF are engineering display forms.</td></tr>
                  <tr><th>ohm</th><td>Resistance. kohm is used when the number is large enough.</td></tr>
                  <tr><th>R1 / R2</th><td>First and second filter-stage resistances, both shown in ohm.</td></tr>
                  <tr><th>C1 / C2</th><td>First and second filter-stage capacitances, both shown in F.</td></tr>
                  <tr><th>dB</th><td>Amplitude ratio: 20*log10(value/reference).</td></tr>
                  <tr><th>dBc</th><td>Level relative to the carrier or fundamental amplitude.</td></tr>
                  <tr><th>%</th><td>Percent ratio. For C/C0, 100% means nominal capacitance.</td></tr>
                  <tr><th>deg</th><td>Phase angle in degrees.</td></tr>
                  <tr><th>samples</th><td>Number of time samples in one FFT record.</td></tr>
                  <tr><th>cycles</th><td>Number of signal periods used for settling or FFT analysis.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="method-signal" className="method-section">
            <span className="method-section-index">02</span>
            <div>
              <h2>Signal parameters</h2>
              <p>
                These inputs define the driven sine wave and the frequency sweep used
                to build distortion curves.
              </p>
              <table className="definition-table">
                <tbody>
                  <tr><th>Amplitude</th><td>Input sine peak amplitude, shown in Vpk.</td></tr>
                  <tr><th>Frequency</th><td>Single operating frequency for the current-point result, shown in Hz.</td></tr>
                  <tr><th>DC bias</th><td>Constant voltage offset added to the sine wave, shown in V.</td></tr>
                  <tr><th>Start / Stop</th><td>Lower and upper frequency limits for the sweep, shown in Hz.</td></tr>
                  <tr><th>Points</th><td>Number of logarithmically spaced sweep frequencies. It is dimensionless.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="method-linear" className="method-section">
            <span className="method-section-index">03</span>
            <div>
              <h2>AC response metrics</h2>
              <p>
                AC response values are calculated from the nominal component values.
                They provide the reference magnitude and phase at each signal
                frequency.
              </p>
              <div className="formula-grid">
                <div className="formula-block"><code>fc[Hz] = 1 / (2*pi*R*C0)</code></div>
                <div className="formula-block"><code>2-stage fc: solve |H(f)| = 1/sqrt(2)</code></div>
                <div className="formula-block"><code>Magnitude[dB] = 20*log10(|H(f)|)</code></div>
                <div className="formula-block"><code>Phase[deg] = angle(H(f))*180/pi</code></div>
              </div>
              <table className="definition-table">
                <tbody>
                  <tr><th>Cutoff</th><td>Frequency where nominal magnitude reaches -3 dB. First-order RC uses the closed form; two-stage RC is solved numerically.</td></tr>
                  <tr><th>AC gain @ fin</th><td>Magnitude at the current signal frequency, shown in dB.</td></tr>
                  <tr><th>AC magnitude</th><td>Magnitude curve over the sweep frequency axis, shown in dB.</td></tr>
                  <tr><th>AC phase</th><td>Phase at the current signal frequency or over the AC curve, shown in deg.</td></tr>
                  <tr><th>2-stage H(s)</th><td>Loaded RC cascade denominator: 1 + s*(R1*C1 + R1*C2 + R2*C2) + s^2*R1*R2*C1*C2.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="method-capacitance" className="method-section">
            <span className="method-section-index">04</span>
            <div>
              <h2>Capacitance metrics</h2>
              <p>
                C0 is the nominal value. The displayed C(V) curve shows how the
                effective capacitance changes with voltage.
              </p>
              <div className="formula-block">
                <code>C(V) = C0 * (1 + alpha*V + beta*V^2 + gamma*V^3)</code>
              </div>
              <table className="definition-table">
                <tbody>
                  <tr><th>C0 / Nominal</th><td>Nominal capacitance, shown in F with engineering prefixes.</td></tr>
                  <tr><th>C1 / C2</th><td>Nominal capacitance values used by the first and second RC stages.</td></tr>
                  <tr><th>Bias C</th><td>Capacitance evaluated at the selected DC bias, shown in F.</td></tr>
                  <tr><th>C / C0</th><td>Normalized capacitance, shown in %. 100% equals nominal C0.</td></tr>
                  <tr><th>alpha</th><td>Linear voltage coefficient, unit 1/V.</td></tr>
                  <tr><th>beta</th><td>Quadratic voltage coefficient, unit 1/V^2.</td></tr>
                  <tr><th>gamma</th><td>Cubic voltage coefficient, unit 1/V^3.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="method-harmonics" className="method-section">
            <span className="method-section-index">05</span>
            <div>
              <h2>Fundamental and harmonics</h2>
              <p>
                After the transient part is skipped, a coherent FFT record is used to
                read amplitudes at the fundamental and harmonic frequencies.
              </p>
              <table className="definition-table">
                <tbody>
                  <tr><th>Fundamental / H1</th><td>Output amplitude at the driven signal frequency, shown in Vpk.</td></tr>
                  <tr><th>H2</th><td>Second harmonic amplitude at 2*fin. Absolute chart value is Vpk; relative value is dBc.</td></tr>
                  <tr><th>H3</th><td>Third harmonic amplitude at 3*fin. Absolute chart value is Vpk; relative value is dBc.</td></tr>
                  <tr><th>H4</th><td>Fourth harmonic amplitude at 4*fin. Absolute chart value is Vpk; relative value is dBc.</td></tr>
                  <tr><th>H5</th><td>Fifth harmonic amplitude at 5*fin. Absolute chart value is Vpk; relative value is dBc.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="method-thd" className="method-section">
            <span className="method-section-index">06</span>
            <div>
              <h2>THD and dBc</h2>
              <p>
                dBc values are relative to the fundamental amplitude. More negative
                dBc means lower distortion. THD combines H2 through H5 in this tool.
              </p>
              <div className="formula-grid">
                <div className="formula-block"><code>HDk[dBc] = 20*log10(Ak / A1), k = 2..5</code></div>
                <div className="formula-block"><code>THD = sqrt(A2^2 + A3^2 + A4^2 + A5^2) / A1</code></div>
                <div className="formula-block"><code>THD[dBc] = 20*log10(THD)</code></div>
                <div className="formula-block"><code>THD[%] = 100*THD</code></div>
              </div>
              <div className="method-note">
                A value of -60 dBc means the distortion amplitude ratio is 0.001
                relative to the fundamental.
              </div>
            </div>
          </section>

          <section id="method-sweep" className="method-section">
            <span className="method-section-index">07</span>
            <div>
              <h2>Sweep charts</h2>
              <p>
                Each sweep point is a separate calculation at one signal frequency.
                The x-axis is signal frequency in Hz.
              </p>
              <table className="definition-table">
                <tbody>
                  <tr><th>AC Magnitude + THD</th><td>Left axis: AC magnitude in dB. Right axis: THD in dBc.</td></tr>
                  <tr><th>Harmonic Amplitude</th><td>H2-H5 absolute amplitudes versus signal frequency, shown in Vpk.</td></tr>
                  <tr><th>Capacitance Profile</th><td>Normalized C/C0 versus capacitor voltage, shown in %.</td></tr>
                  <tr><th>Signal sweep</th><td>Start...stop frequency range plus the number of calculated points.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="method-solver" className="method-section">
            <span className="method-section-index">08</span>
            <div>
              <h2>Solver record</h2>
              <p>
                These parameters control the time record used for harmonic extraction.
                They are not electrical units; they define numerical resolution.
              </p>
              <table className="definition-table">
                <tbody>
                  <tr><th>FFT size</th><td>Number of samples in the analyzed record. Must be a power of two.</td></tr>
                  <tr><th>Settle cycles</th><td>Signal periods simulated before the analyzed record begins.</td></tr>
                  <tr><th>Window cycles</th><td>Signal periods included in the coherent FFT record.</td></tr>
                  <tr><th>Solver record</th><td>Displayed as samples and cycles in the result table.</td></tr>
                  <tr><th>2-stage state</th><td>For RC 2-Stage Low-pass, RK4 integrates Q1 and Q2 for the two capacitor nodes.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="method-limits" className="method-section">
            <span className="method-section-index">09</span>
            <div>
              <h2>Interpretation limits</h2>
              <ul className="method-list">
                <li>The source waveform is ideal and has no noise or intrinsic harmonic content.</li>
                <li>The C(V) polynomial is a local engineering approximation.</li>
                <li>Very small harmonic amplitudes are limited by FFT length and numerical precision.</li>
                <li>Low-frequency sweeps require enough simulated periods to make harmonic bins reliable.</li>
                <li>Use the values for comparison and diagnosis, then confirm final conclusions with measurement data.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

