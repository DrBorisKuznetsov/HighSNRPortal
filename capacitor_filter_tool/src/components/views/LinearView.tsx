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

export function LinearView({
  topology,
  cutoffFrequency,
  cutoffPoint,
  resistanceOhms,
  capacitanceFarads,
  response,
  frequencyRange,
  setFrequencyRange,
}: {
  topology: RcTopology;
  cutoffFrequency: number;
  cutoffPoint:
    | {
        magnitudeDb: number;
        phaseDeg: number;
      }
    | undefined;
  resistanceOhms: number;
  capacitanceFarads: number;
  resistanceOhms2?: number;
  capacitanceFarads2?: number;
  response: Array<{ frequencyHz: number; magnitudeDb: number; phaseDeg: number }>;
  frequencyRange: FrequencyRange;
  setFrequencyRange: (value: FrequencyRange | ((range: FrequencyRange) => FrequencyRange)) => void;
}) {
  return (
    <>
      <div className="metrics-grid">
        <Metric label="Topology" value={topologyLabels[topology]} />
        <Metric
          label="Cutoff"
          value={Number.isFinite(cutoffFrequency) ? formatHz(cutoffFrequency) : "Invalid"}
        />
        <Metric
          label="Magnitude @ fc"
          value={cutoffPoint ? formatDb(cutoffPoint.magnitudeDb) : "Invalid"}
        />
        <Metric
          label="Phase @ fc"
          value={cutoffPoint ? formatPhase(cutoffPoint.phaseDeg) : "Invalid"}
        />
      </div>

      <div className="formula-strip">
        <span>{topologyLabels[topology]}</span>
        <span>R = {formatEngineering(resistanceOhms, "ohm")}</span>
        <span>C = {formatEngineering(capacitanceFarads, "F")}</span>
        <span>
          fc = {Number.isFinite(cutoffFrequency) ? formatHz(cutoffFrequency) : "Invalid"}
        </span>
      </div>

      <div className="analysis-control-strip">
        <NumericField
          label="Start"
          suffix="Hz"
          value={frequencyRange.startHz}
          min={0.001}
          step={10}
          onChange={(startHz) => setFrequencyRange((range) => ({ ...range, startHz }))}
        />
        <NumericField
          label="Stop"
          suffix="Hz"
          value={frequencyRange.stopHz}
          min={0.001}
          step={1000}
          onChange={(stopHz) => setFrequencyRange((range) => ({ ...range, stopHz }))}
        />
        <NumericField
          label="Points"
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
          title="Magnitude"
          xLabel="Frequency (Hz)"
          yLabel="Magnitude (dB)"
          seriesName={topologyLabels[topology]}
          data={response.map((point) => [point.frequencyHz, point.magnitudeDb])}
          cutoffFrequency={cutoffFrequency}
          yFormatter={(value) => formatDb(Number(value))}
        />
        <ChartPanel
          title="Phase"
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

