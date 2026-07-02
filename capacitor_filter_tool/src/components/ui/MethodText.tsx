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
import { Readout } from "../ui/Readout";
import { Metric } from "../ui/Metric";
import { FilterSchematic } from "../ui/FilterSchematic";
import { HarmonicAmplitudeChart } from "../ui/HarmonicAmplitudeChart";

export function MethodText({
  children,
  methodId,
  onOpenMethodology,
}: {
  children: ReactNode;
  methodId: string;
  onOpenMethodology: OpenMethodology;
}) {
  return (
    <a
      className="metric-help-link"
      href={`#${methodId}`}
      title="Open methodology section"
      onClick={() => onOpenMethodology(methodId)}
    >
      <span>{children}</span>
      <CircleHelp size={13} aria-hidden="true" />
    </a>
  );
}

