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

export function NonlinearView({
  topology,
  resistanceOhms,
  capacitanceFarads,
  resistanceOhms2,
  capacitanceFarads2,
  signal,
  setSignal,
  selectedCapacitorPreset,
  alphaPerVolt,
  betaPerVoltSquared,
  gammaPerVoltCubed,
  settings,
  setSettings,
  result,
  sweepRange,
  setSweepRange,
  sweepResult,
  onOpenMethodology,
}: {
  topology: RcTopology;
  resistanceOhms: number;
  capacitanceFarads: number;
  resistanceOhms2?: number;
  capacitanceFarads2?: number;
  signal: NonlinearSignal;
  setSignal: (value: NonlinearSignal | ((signal: NonlinearSignal) => NonlinearSignal)) => void;
  selectedCapacitorPreset: ReturnType<typeof getCapacitorPreset>;
  alphaPerVolt: number;
  betaPerVoltSquared: number;
  gammaPerVoltCubed: number;
  settings: NonlinearSimulationSettings;
  setSettings: (
    value:
      | NonlinearSimulationSettings
      | ((settings: NonlinearSimulationSettings) => NonlinearSimulationSettings),
  ) => void;
  result: ReturnType<typeof simulateNonlinearDistortion> | undefined;
  sweepRange: FrequencyRange;
  setSweepRange: (value: FrequencyRange | ((range: FrequencyRange) => FrequencyRange)) => void;
  sweepResult: DistortionSweepPoint[];
  onOpenMethodology: OpenMethodology;
}) {
  const hasValidContext =
    resistanceOhms > 0 &&
    capacitanceFarads > 0 &&
    Number.isFinite(signal.frequencyHz) &&
    signal.frequencyHz > 0;
  const cutoffFrequency = hasValidContext
    ? calculateCutoffFrequency(
        resistanceOhms,
        capacitanceFarads,
        topology,
        resistanceOhms2,
        capacitanceFarads2,
      )
    : Number.NaN;
  const signalFrequencyPoint = useMemo(() => {
    if (!hasValidContext) {
      return undefined;
    }

    const [point] = calculateFrequencyResponse({
      topology,
      resistanceOhms,
      capacitanceFarads,
      resistanceOhms2,
      capacitanceFarads2,
      frequency: {
        startHz: signal.frequencyHz,
        stopHz: signal.frequencyHz * 1.000001,
        points: 2,
      },
    });

    return point;
  }, [
    capacitanceFarads,
    capacitanceFarads2,
    hasValidContext,
    resistanceOhms,
    resistanceOhms2,
    signal.frequencyHz,
    topology,
  ]);
  const hasValidSweepRange =
    resistanceOhms > 0 &&
    capacitanceFarads > 0 &&
    Number.isFinite(sweepRange.startHz) &&
    Number.isFinite(sweepRange.stopHz) &&
    sweepRange.startHz > 0 &&
    sweepRange.stopHz > sweepRange.startHz &&
    sweepRange.points >= 2;
  const sweepFrequencyMin = hasValidSweepRange ? sweepRange.startHz : undefined;
  const sweepFrequencyMax = hasValidSweepRange ? sweepRange.stopHz : undefined;
  const sweepAcResponse = useMemo(() => {
    if (!hasValidSweepRange) {
      return [];
    }

    return calculateFrequencyResponse({
      topology,
      resistanceOhms,
      capacitanceFarads,
      resistanceOhms2,
      capacitanceFarads2,
      frequency: sweepRange,
    });
  }, [
    capacitanceFarads,
    capacitanceFarads2,
    hasValidSweepRange,
    resistanceOhms,
    resistanceOhms2,
    sweepRange,
    topology,
  ]);
  const hd2 = result?.harmonics[1];
  const hd3 = result?.harmonics[2];
  const hd4 = result?.harmonics[3];
  const hd5 = result?.harmonics[4];
  const distortionRows = result
    ? [
        {
          metric: "Fundamental",
          methodId: "method-harmonics",
          value: formatVoltsPeak(result.fundamentalAmplitudeVoltsPeak),
          equivalent: "H1",
          comment: "Output amplitude at the driven signal frequency.",
        },
        {
          metric: "Total harmonic distortion",
          methodId: "method-thd",
          value: formatDbc(result.thdDb),
          equivalent: formatPercent(result.thdPercent),
          comment: "Combined HD2-H5 energy relative to the fundamental.",
        },
        {
          metric: "Second harmonic",
          methodId: "method-harmonics",
          value: hd2 ? formatDbc(hd2.dbRelativeCarrier) : "Invalid",
          equivalent: hd2 ? formatVoltsPeak(hd2.amplitudeVoltsPeak) : "Invalid",
          comment: "Even-order distortion, usually most sensitive to bias asymmetry.",
        },
        {
          metric: "Third harmonic",
          methodId: "method-harmonics",
          value: hd3 ? formatDbc(hd3.dbRelativeCarrier) : "Invalid",
          equivalent: hd3 ? formatVoltsPeak(hd3.amplitudeVoltsPeak) : "Invalid",
          comment: "Odd-order curvature contribution from C(V).",
        },
        {
          metric: "Fourth harmonic",
          methodId: "method-harmonics",
          value: hd4 ? formatDbc(hd4.dbRelativeCarrier) : "Invalid",
          equivalent: hd4 ? formatVoltsPeak(hd4.amplitudeVoltsPeak) : "Invalid",
          comment: "Higher even-order contribution at four times the signal frequency.",
        },
        {
          metric: "Fifth harmonic",
          methodId: "method-harmonics",
          value: hd5 ? formatDbc(hd5.dbRelativeCarrier) : "Invalid",
          equivalent: hd5 ? formatVoltsPeak(hd5.amplitudeVoltsPeak) : "Invalid",
          comment: "Higher odd-order contribution at five times the signal frequency.",
        },
      ]
    : [];

  return (
    <>
      <div className="analysis-controls-grid">
        <article className="graph-card control-card">
          <div className="graph-title">
            <span>Signal</span>
          </div>
          <div className="control-grid three-col">
            <NumericField
              label="Amplitude"
              suffix="Vpk"
              value={signal.amplitudeVolts}
              min={0}
              step={0.1}
              onChange={(amplitudeVolts) =>
                setSignal((current) => ({ ...current, amplitudeVolts }))
              }
            />
            <NumericField
              label="Frequency"
              suffix="Hz"
              value={signal.frequencyHz}
              min={0.001}
              step={100}
              onChange={(frequencyHz) =>
                setSignal((current) => ({ ...current, frequencyHz }))
              }
            />
            <NumericField
              label="DC bias"
              suffix="V"
              value={signal.dcBiasVolts}
              step={0.1}
              onChange={(dcBiasVolts) =>
                setSignal((current) => ({ ...current, dcBiasVolts }))
              }
            />
          </div>
        </article>

        <article className="graph-card control-card">
          <div className="graph-title">
            <span>Frequency Sweep</span>
          </div>
          <div className="control-grid three-col">
            <NumericField
              label="Start"
              suffix="Hz"
              value={sweepRange.startHz}
              min={0.001}
              step={100}
              onChange={(startHz) =>
                setSweepRange((current) => ({ ...current, startHz }))
              }
            />
            <NumericField
              label="Stop"
              suffix="Hz"
              value={sweepRange.stopHz}
              min={0.001}
              step={1000}
              onChange={(stopHz) =>
                setSweepRange((current) => ({ ...current, stopHz }))
              }
            />
            <NumericField
              label="Points"
              suffix=""
              value={sweepRange.points}
              min={25}
              max={160}
              step={5}
              onChange={(points) =>
                setSweepRange((current) => ({
                  ...current,
                  points: Math.round(points),
                }))
              }
            />
          </div>
        </article>

        <article className="graph-card control-card full-width">
          <div className="graph-title">
            <span>Solver</span>
          </div>
          <div className="control-grid three-col">
            <NumericField
              label="FFT size"
              suffix=""
              value={settings.fftSize}
              min={1024}
              step={1024}
              onChange={(fftSize) =>
                setSettings((current) => ({ ...current, fftSize: Math.round(fftSize) }))
              }
            />
            <NumericField
              label="Settle"
              suffix="cycles"
              value={settings.settleCycles}
              min={0}
              step={1}
              onChange={(settleCycles) =>
                setSettings((current) => ({
                  ...current,
                  settleCycles: Math.round(settleCycles),
                }))
              }
            />
            <NumericField
              label="Window"
              suffix="cycles"
              value={settings.analysisCycles}
              min={1}
              step={1}
              onChange={(analysisCycles) =>
                setSettings((current) => ({
                  ...current,
                  analysisCycles: Math.round(analysisCycles),
                }))
              }
            />
          </div>
        </article>
      </div>

      <div className="metrics-grid">
        <Metric label="Topology" value={topologyLabels[topology]} />
        <Metric label="Capacitor" value={selectedCapacitorPreset.dielectric} />
        <Metric
          label="Signal"
          value={`${formatCompactUnit(formatHz(signal.frequencyHz))} ${formatCompactUnit(formatVoltsPeak(signal.amplitudeVolts))}`}
          methodId="method-signal"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="AC gain @ fin"
          value={signalFrequencyPoint ? formatDb(signalFrequencyPoint.magnitudeDb) : "Invalid"}
          methodId="method-linear"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="AC phase @ fin"
          value={signalFrequencyPoint ? formatPhase(signalFrequencyPoint.phaseDeg) : "Invalid"}
          methodId="method-linear"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="Fundamental"
          value={result ? formatVoltsPeak(result.fundamentalAmplitudeVoltsPeak) : "Invalid"}
          methodId="method-harmonics"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="THD"
          value={result ? formatDbc(result.thdDb) : "Invalid"}
          methodId="method-thd"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="HD2"
          value={hd2 ? formatDbc(hd2.dbRelativeCarrier) : "Invalid"}
          methodId="method-harmonics"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="HD3"
          value={hd3 ? formatDbc(hd3.dbRelativeCarrier) : "Invalid"}
          methodId="method-harmonics"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="HD4"
          value={hd4 ? formatDbc(hd4.dbRelativeCarrier) : "Invalid"}
          methodId="method-harmonics"
          onOpenMethodology={onOpenMethodology}
        />
        <Metric
          label="HD5"
          value={hd5 ? formatDbc(hd5.dbRelativeCarrier) : "Invalid"}
          methodId="method-harmonics"
          onOpenMethodology={onOpenMethodology}
        />
      </div>

      <div className="formula-strip">
        <span>{topologyLabels[topology]}</span>
        <span>R = {formatEngineering(resistanceOhms, "ohm")}</span>
        <span>C0 = {formatEngineering(capacitanceFarads, "F")}</span>
        {topology === "low-pass-2nd" && (
          <>
            <span>R2 = {formatEngineering(resistanceOhms2 ?? resistanceOhms, "ohm")}</span>
            <span>C2 = {formatEngineering(capacitanceFarads2 ?? capacitanceFarads, "F")}</span>
          </>
        )}
        <span>C model = {selectedCapacitorPreset.name}</span>
        <span>Vin = {formatVoltsPeak(signal.amplitudeVolts)}</span>
        <span>f = {formatHz(signal.frequencyHz)}</span>
        <span>fc = {Number.isFinite(cutoffFrequency) ? formatHz(cutoffFrequency) : "Invalid"}</span>
        <span>bias = {formatVolts(signal.dcBiasVolts)}</span>
        <span>poly = {formatNumber(alphaPerVolt)}, {formatNumber(betaPerVoltSquared)}, {formatNumber(gammaPerVoltCubed)}</span>
      </div>

      <article className="graph-card results-table-card">
        <div className="graph-title">
          <span>Distortion Result Details</span>
        </div>
        <div className="diagnostic-table-wrap">
          <table className="diagnostic-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Equivalent</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody className="diag-section diag-section-main">
              <tr className="diag-section-row">
                <th colSpan={4}>Current signal frequency</th>
              </tr>
              {distortionRows.map((row) => (
                <tr className="diag-group-main" key={row.metric}>
                  <td>
                    <MethodText
                      methodId={row.methodId}
                      onOpenMethodology={onOpenMethodology}
                    >
                      {row.metric}
                    </MethodText>
                  </td>
                  <td>{row.value}</td>
                  <td>{row.equivalent}</td>
                  <td>{row.comment}</td>
                </tr>
              ))}
            </tbody>
            <tbody className="diag-section diag-section-spectrum">
              <tr className="diag-section-row">
                <th colSpan={4}>Sweep context</th>
              </tr>
              <tr className="diag-group-spectrum">
                <td>
                  <MethodText
                    methodId="method-sweep"
                    onOpenMethodology={onOpenMethodology}
                  >
                    Signal sweep
                  </MethodText>
                </td>
                <td>{formatHz(sweepRange.startHz)}...{formatHz(sweepRange.stopHz)}</td>
                <td>{sweepRange.points} points</td>
                <td>HD2-H5 and THD are evaluated at each signal frequency.</td>
              </tr>
              <tr className="diag-group-spectrum">
                <td>
                  <MethodText
                    methodId="method-solver"
                    onOpenMethodology={onOpenMethodology}
                  >
                    Solver record
                  </MethodText>
                </td>
                <td>{settings.fftSize} samples</td>
                <td>{settings.analysisCycles} cycles</td>
                <td>Coherent FFT window used for every frequency point.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <div className="graphs-grid">
        <ChartPanel
          title="AC Magnitude + THD"
          xLabel="Signal frequency (Hz)"
          yLabel="AC magnitude (dB)"
          rightYLabel="THD (dBc)"
          fullWidth
          xMin={sweepFrequencyMin}
          xMax={sweepFrequencyMax}
          series={[
            {
              name: "AC magnitude",
              color: "#2468a9",
              data: sweepAcResponse.map((point) => [
                point.frequencyHz,
                point.magnitudeDb,
              ]),
              lineWidth: 1.8,
            },
            {
              name: "THD",
              color: "#20262d",
              data: sweepResult.map((point) => [point.frequencyHz, point.thdDb]),
              yAxisIndex: 1,
              showSymbol: true,
              symbolSize: 5,
              lineWidth: 1.8,
            },
          ]}
          yFormatter={(value) => `${formatNumber(Number(value))} dB`}
          rightYFormatter={(value) => `${formatNumber(Number(value))} dBc`}
        />
        <HarmonicAmplitudeChart
          sweepResult={sweepResult}
          fullWidth
          xMin={sweepFrequencyMin}
          xMax={sweepFrequencyMax}
        />
        <ChartPanel
          title="Capacitance Profile"
          xLabel="Capacitor voltage (V)"
          yLabel="C / C0 (%)"
          xScale="value"
          data={
            result?.capacitanceProfile.map((point) => [
              point.voltage,
              point.capacitancePercent,
            ]) ?? []
          }
          yFormatter={(value) => formatPercent(Number(value))}
        />
      </div>
    </>
  );
}


