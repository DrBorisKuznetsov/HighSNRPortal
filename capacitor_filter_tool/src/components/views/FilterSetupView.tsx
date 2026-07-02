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
import { type OpenMethodology, type AnalysisMode, topologyLabels, topologyCatalog, type TopologyCatalogItem } from "../../app/App";
import { MethodText } from "../ui/MethodText";
import { Readout } from "../ui/Readout";
import { Metric } from "../ui/Metric";
import { FilterSchematic } from "../ui/FilterSchematic";
import { HarmonicAmplitudeChart } from "../ui/HarmonicAmplitudeChart";

export function FilterSetupView({
  topology,
  setTopology,
  resistanceOhms,
  setResistanceOhms,
  capacitanceFarads,
  setCapacitanceFarads,
  resistanceOhms2,
  setResistanceOhms2,
  capacitanceFarads2,
  setCapacitanceFarads2,
  cutoffFrequency,
  cutoffPoint,
  response,
  frequencyRange,
  setFrequencyRange,
  onOpenMethodology,
}: {
  topology: RcTopology;
  setTopology: (topology: RcTopology) => void;
  resistanceOhms: number;
  setResistanceOhms: (value: number) => void;
  capacitanceFarads: number;
  setCapacitanceFarads: (value: number) => void;
  resistanceOhms2?: number;
  setResistanceOhms2?: (value: number) => void;
  capacitanceFarads2?: number;
  setCapacitanceFarads2?: (value: number) => void;
  cutoffFrequency: number;
  cutoffPoint:
    | {
        magnitudeDb: number;
        phaseDeg: number;
      }
    | undefined;
  response: Array<{ frequencyHz: number; magnitudeDb: number; phaseDeg: number }>;
  frequencyRange: FrequencyRange;
  setFrequencyRange: (value: FrequencyRange | ((range: FrequencyRange) => FrequencyRange)) => void;
  onOpenMethodology: OpenMethodology;
}) {
  const [topologyQuery, setTopologyQuery] = useState("");
  const normalizedQuery = topologyQuery.trim().toLowerCase();
  const visibleTopologies = topologyCatalog.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    return `${item.label} ${item.family} ${item.response} ${item.order}`
      .toLowerCase()
      .includes(normalizedQuery);
  });
  const selectedTopologyItem =
    topologyCatalog.find((item) => item.solverTopology === topology) ??
    topologyCatalog[0];
  const topologyDescription =
    topology === "low-pass-2nd"
      ? "R1-C1 stage followed by R2-C2 stage"
      : topology === "low-pass"
        ? "R series, C shunt"
        : "C series, R shunt";
  const cutoffFormula =
    topology === "low-pass-2nd"
      ? "Numeric -3 dB solution of |H(f)|"
      : "1 / (2*pi*R*C)";

  return (
    <>
      <div className="insight-panel">
        <div className="insight-copy">
          <span className="insight-kicker">Filter Parameters</span>
          <strong>{selectedTopologyItem.label}</strong>
        </div>
        <div className="insight-stats">
          <Readout
            label="Cutoff"
            value={Number.isFinite(cutoffFrequency) ? formatHz(cutoffFrequency) : "Invalid"}
            methodId="method-linear"
            onOpenMethodology={onOpenMethodology}
          />
          <Readout label="Order" value={selectedTopologyItem.order} />
          <Readout label="State" value={topology === "low-pass-2nd" ? "Ideal 2-stage RC" : "Ideal RC"} />
        </div>
      </div>

      <div className="setup-grid">
        <article className="graph-card setup-card">
          <div className="graph-title">
            <span>Topology Library</span>
          </div>
          <input
            className="filter-search"
            type="search"
            value={topologyQuery}
            onChange={(event) => setTopologyQuery(event.target.value)}
            placeholder="Search topology"
            aria-label="Search topology"
          />
          <div className="topology-library">
            {visibleTopologies.map((item) => (
              <button
                className={
                  item.solverTopology === topology
                    ? "topology-card is-active"
                    : "topology-card"
                }
                disabled={!item.solverTopology}
                key={item.id}
                type="button"
                onClick={() => item.solverTopology && setTopology(item.solverTopology)}
              >
                <span>{item.label}</span>
                <em>{item.family} / {item.response} / {item.order}</em>
                <small>{item.capacitors.length > 0 ? item.capacitors.join(", ") : "No C position"}</small>
              </button>
            ))}
          </div>
        </article>

        <article className="graph-card setup-card">
          <div className="graph-title">
            <span>Schematic</span>
          </div>
          <FilterSchematic topology={topology} />
        </article>

        <article className="graph-card setup-card">
          <div className="graph-title">
            <span>Electrical Parameters</span>
          </div>
          <div className="control-grid two-col">
            <NumericField
              label="R1"
              suffix="ohm"
              value={resistanceOhms}
              min={0.001}
              step={100}
              onChange={setResistanceOhms}
            />
            <NumericField
              label="C1"
              suffix="F"
              value={capacitanceFarads}
              min={1e-12}
              step={10e-9}
              onChange={setCapacitanceFarads}
            />
            {topology === "low-pass-2nd" && setResistanceOhms2 && setCapacitanceFarads2 && (
              <>
                <NumericField
                  label="R2"
                  suffix="ohm"
                  value={resistanceOhms2 ?? resistanceOhms}
                  min={0.001}
                  step={100}
                  onChange={setResistanceOhms2}
                />
                <NumericField
                  label="C2"
                  suffix="F"
                  value={capacitanceFarads2 ?? capacitanceFarads}
                  min={1e-12}
                  step={10e-9}
                  onChange={setCapacitanceFarads2}
                />
              </>
            )}
          </div>
          <div className="diagnostic-table-wrap">
            <table className="diagnostic-table compact">
              <tbody>
                <tr className="diag-section-row">
                  <th colSpan={3}>Selected Topology</th>
                </tr>
                <tr className="diag-group-main">
                  <td>Topology</td>
                  <td>{selectedTopologyItem.label}</td>
                  <td>{topologyDescription}</td>
                </tr>
                {topology === "low-pass-2nd" && (
                  <tr className="diag-group-main">
                    <td>Second stage</td>
                    <td>
                      R2 = {formatEngineering(resistanceOhms2 ?? resistanceOhms, "ohm")}
                      {" / "}
                      C2 = {formatEngineering(capacitanceFarads2 ?? capacitanceFarads, "F")}
                    </td>
                    <td>Loaded cascade transfer function</td>
                  </tr>
                )}
                {topology === "low-pass-2nd" && (
                  <tr className="diag-group-main">
                    <td>Transfer form</td>
                    <td>H(s) = 1 / D(s)</td>
                    <td>D(s) = 1 + s*(R1*C1 + R1*C2 + R2*C2) + s^2*R1*R2*C1*C2</td>
                  </tr>
                )}
                {topology === "low-pass-2nd" && (
                  <tr className="diag-group-main">
                    <td>Component positions</td>
                    <td>{selectedTopologyItem.capacitors.join(", ")}</td>
                    <td>Each capacitor value is included in AC and distortion calculations.</td>
                  </tr>
                )}
                {topology !== "low-pass-2nd" && (
                  <tr className="diag-group-main">
                    <td>Component positions</td>
                    <td>{selectedTopologyItem.capacitors.join(", ")}</td>
                    <td>{selectedTopologyItem.family} / {selectedTopologyItem.response}</td>
                  </tr>
                )}
                <tr className="diag-group-main">
                  <td>Order</td>
                  <td>{selectedTopologyItem.order}</td>
                  <td>{topology === "low-pass-2nd" ? "Two energy-storage capacitors" : "One energy-storage capacitor"}</td>
                </tr>
                <tr className="diag-group-main">
                  <td>
                    <MethodText
                      methodId="method-linear"
                      onOpenMethodology={onOpenMethodology}
                    >
                      Cutoff
                    </MethodText>
                  </td>
                  <td>{Number.isFinite(cutoffFrequency) ? formatHz(cutoffFrequency) : "Invalid"}</td>
                  <td>{cutoffFormula}</td>
                </tr>
                <tr className="diag-group-main">
                  <td>
                    <MethodText
                      methodId="method-linear"
                      onOpenMethodology={onOpenMethodology}
                    >
                      Magnitude @ fc
                    </MethodText>
                  </td>
                  <td>{cutoffPoint ? formatDb(cutoffPoint.magnitudeDb) : "Invalid"}</td>
                  <td>Nominal -3 dB point</td>
                </tr>
                <tr className="diag-group-main">
                  <td>
                    <MethodText
                      methodId="method-linear"
                      onOpenMethodology={onOpenMethodology}
                    >
                      Phase @ fc
                    </MethodText>
                  </td>
                  <td>{cutoffPoint ? formatPhase(cutoffPoint.phaseDeg) : "Invalid"}</td>
                  <td>Filter phase at cutoff</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div className="analysis-control-strip">
        <NumericField
          label="AC start"
          suffix="Hz"
          value={frequencyRange.startHz}
          min={0.001}
          step={10}
          onChange={(startHz) => setFrequencyRange((range) => ({ ...range, startHz }))}
        />
        <NumericField
          label="AC stop"
          suffix="Hz"
          value={frequencyRange.stopHz}
          min={0.001}
          step={1000}
          onChange={(stopHz) => setFrequencyRange((range) => ({ ...range, stopHz }))}
        />
        <NumericField
          label="AC points"
          suffix=""
          value={frequencyRange.points}
          min={25}
          max={2000}
          step={25}
          onChange={(points) =>
            setFrequencyRange((range) => ({ ...range, points: Math.round(points) }))
          }
        />
      </div>

      <div className="graphs-grid">
        <ChartPanel
          title="Amplitude Response"
          xLabel="Frequency (Hz)"
          yLabel="Magnitude (dB)"
          seriesName={topologyLabels[topology]}
          data={response.map((point) => [point.frequencyHz, point.magnitudeDb])}
          cutoffFrequency={cutoffFrequency}
          yFormatter={(value) => formatDb(Number(value))}
        />
        <ChartPanel
          title="Phase Response"
          xLabel="Frequency (Hz)"
          yLabel="Phase (deg)"
          seriesName={topologyLabels[topology]}
          data={response.map((point) => [point.frequencyHz, point.phaseDeg])}
          cutoffFrequency={cutoffFrequency}
          yFormatter={(value) => formatPhase(Number(value))}
        />
      </div>
    </>
  );
}

