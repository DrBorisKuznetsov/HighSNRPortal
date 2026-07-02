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

export function HarmonicAmplitudeChart({
  sweepResult,
  fullWidth = false,
  xMin,
  xMax,
}: {
  sweepResult: DistortionSweepPoint[];
  fullWidth?: boolean;
  xMin?: number;
  xMax?: number;
}) {
  return (
    <ChartPanel
      title="Harmonic Amplitude vs Signal Frequency"
      xLabel="Signal frequency (Hz)"
      yLabel="Amplitude (Vpk)"
      fullWidth={fullWidth}
      xMin={xMin}
      xMax={xMax}
      yScale="log"
      series={[
        {
          name: "H2 amplitude",
          color: "#247a55",
          data: sweepResult.map((point) => [
            point.frequencyHz,
            positiveAmplitude(point.h2AmplitudeVoltsPeak),
          ]),
          showSymbol: true,
          symbolSize: 5,
          lineWidth: 1.4,
        },
        {
          name: "H3 amplitude",
          color: "#9d4f70",
          data: sweepResult.map((point) => [
            point.frequencyHz,
            positiveAmplitude(point.h3AmplitudeVoltsPeak),
          ]),
          showSymbol: true,
          symbolSize: 5,
          lineWidth: 1.4,
        },
        {
          name: "H4 amplitude",
          color: "#66569a",
          data: sweepResult.map((point) => [
            point.frequencyHz,
            positiveAmplitude(point.h4AmplitudeVoltsPeak),
          ]),
          showSymbol: true,
          symbolSize: 5,
          lineWidth: 1.4,
        },
        {
          name: "H5 amplitude",
          color: "#b77b2b",
          data: sweepResult.map((point) => [
            point.frequencyHz,
            positiveAmplitude(point.h5AmplitudeVoltsPeak),
          ]),
          showSymbol: true,
          symbolSize: 5,
          lineWidth: 1.4,
        },
      ]}
      yFormatter={(value) => formatEngineering(Number(value), "Vpk")}
    />
  );
}
