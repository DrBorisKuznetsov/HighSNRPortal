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

export function CapacitorLibraryView({
  selectedCapacitorId,
  onSelectPreset,
  capacitanceFarads,
  setCapacitanceFarads,
  alphaPerVolt,
  setAlphaPerVolt,
  betaPerVoltSquared,
  setBetaPerVoltSquared,
  gammaPerVoltCubed,
  setGammaPerVoltCubed,
  signal,
  onOpenMethodology,
}: {
  selectedCapacitorId: CapacitorPresetId;
  onSelectPreset: (presetId: CapacitorPresetId) => void;
  capacitanceFarads: number;
  setCapacitanceFarads: (value: number) => void;
  alphaPerVolt: number;
  setAlphaPerVolt: (value: number) => void;
  betaPerVoltSquared: number;
  setBetaPerVoltSquared: (value: number) => void;
  gammaPerVoltCubed: number;
  setGammaPerVoltCubed: (value: number) => void;
  signal: NonlinearSignal;
  onOpenMethodology: OpenMethodology;
}) {
  const preset = getCapacitorPreset(selectedCapacitorId);
  const voltageSpan = Math.max(
    preset.ratedVoltage * 1.15,
    Math.abs(signal.dcBiasVolts) + Math.max(1, signal.amplitudeVolts * 1.8),
  );
  const capacitanceCurve = buildCapacitanceCurve(
    preset,
    capacitanceFarads,
    voltageSpan,
  );
  const effectiveAtBias = capacitanceCurve.reduce((closest, point) =>
    Math.abs(point.voltage - signal.dcBiasVolts) <
    Math.abs(closest.voltage - signal.dcBiasVolts)
      ? point
      : closest,
  );

  return (
    <>
      <div className="insight-panel">
        <div className="insight-copy">
          <span className="insight-kicker">Capacitor Position C1</span>
          <strong>{preset.name}</strong>
        </div>
        <div className="insight-stats">
          <Readout
            label="Nominal"
            value={formatEngineering(capacitanceFarads, "F")}
            methodId="method-capacitance"
            onOpenMethodology={onOpenMethodology}
          />
          <Readout
            label="Bias C"
            value={formatEngineering(effectiveAtBias.capacitance, "F")}
            methodId="method-capacitance"
            onOpenMethodology={onOpenMethodology}
          />
          <Readout label="Dielectric" value={preset.dielectric} />
        </div>
      </div>

      <div className="capacitor-grid">
        <article className="graph-card">
          <div className="graph-title">
            <span>C1 Model</span>
          </div>
          <label className="select-field">
            <span>Preset</span>
            <select
              value={selectedCapacitorId}
              onChange={(event) =>
                onSelectPreset(event.target.value as CapacitorPresetId)
              }
            >
              {capacitorPresetGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.presetIds.map((presetId) => (
                    <option key={presetId} value={presetId}>
                      {capacitorPresets[presetId].name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="control-grid two-col">
            <NumericField
              label="Nominal C1"
              suffix="F"
              value={capacitanceFarads}
              min={1e-12}
              step={10e-9}
              onChange={setCapacitanceFarads}
            />
            <NumericField
              label="alpha"
              suffix="1/V"
              value={alphaPerVolt}
              step={0.01}
              onChange={setAlphaPerVolt}
            />
            <NumericField
              label="beta"
              suffix="1/V^2"
              value={betaPerVoltSquared}
              step={0.01}
              onChange={setBetaPerVoltSquared}
            />
            <NumericField
              label="gamma"
              suffix="1/V^3"
              value={gammaPerVoltCubed}
              step={0.01}
              onChange={setGammaPerVoltCubed}
            />
          </div>

          <div className="diagnostic-table-wrap">
            <table className="diagnostic-table compact">
              <tbody>
                <tr className="diag-section-row">
                  <th colSpan={4}>Position assignment</th>
                </tr>
                <tr className="diag-group-main">
                  <td>Position</td>
                  <td>C1</td>
                  <td>{preset.model}</td>
                  <td>{preset.manufacturer}</td>
                </tr>
                <tr className="diag-group-main">
                  <td>Voltage rating</td>
                  <td>{formatVolts(preset.ratedVoltage)}</td>
                  <td>{preset.size}</td>
                  <td>{preset.dielectric}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <ChartPanel
          title="C(V) Model"
          xLabel="Bias voltage (V)"
          yLabel="C / Cnom (%)"
          xScale="value"
          data={capacitanceCurve.map((point) => [
            point.voltage,
            point.capacitancePercent,
          ])}
          yFormatter={(value) => formatPercent(Number(value))}
        />
      </div>

      <article className="graph-card library-card">
        <div className="graph-title">
          <span>MLCC Component Library</span>
        </div>
        <div className="library-table-wrap">
          <table className="library-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Mfr</th>
                <th>Nominal</th>
                <th>Rated</th>
                <th>Dielectric</th>
                <th>Size</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {Object.values(capacitorPresets).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.manufacturer}</td>
                  <td>{formatEngineering(item.cNomFarads, "F")}</td>
                  <td>{formatVolts(item.ratedVoltage)}</td>
                  <td>
                    <span className="badge">{item.dielectric}</span>
                  </td>
                  <td>{item.size}</td>
                  <td>
                    <button
                      className="btn-table-apply"
                      type="button"
                      onClick={() => onSelectPreset(item.id as CapacitorPresetId)}
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}

