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
import { HarmonicAmplitudeChart } from "../ui/HarmonicAmplitudeChart";

export function FilterSchematic({ topology }: { topology: RcTopology }) {
  if (topology === "high-pass") {
    return (
      <div className="schematic-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
        <svg 
          className="filter-schematic"
          style={{ height: "120px", width: "auto" }} 
          viewBox="-1000 0 43000 20547.2" 
          role="img" 
          aria-label="RC high-pass schematic (user provided)"
        >
          <g stroke="currentColor" fill="none" strokeWidth="311.79" strokeMiterlimit="22.9">
            <polyline points="25269.34,18790.41 25269.34,16478.88 26687.47,15828.99 23851.27,14529.21 26687.47,13229.44 23851.27,11929.6 26687.47,10629.82 23851.27,9330.04 25269.4,8680.15 25269.4,6310.69 "/>
            <line x1="23559.75" y1="6347.92" x2="31828.53" y2="6347.92" />
            <polygon points="25269.34,20343.29 26190.8,19566.82 27112.25,18790.41 25269.34,18790.41 23426.43,18790.41 24347.89,19566.82 "/>
            <circle cx="6526.26" cy="6347.92" r="546.38"/>
            <circle cx="32374.91" cy="6347.92" r="546.38"/>
            <circle cx="25329.45" cy="6310.69" r="546.38" fill="currentColor" stroke="none" />
            <text x="29175.66" y="14229.15" fill="currentColor" stroke="none" fontSize="3519.7" fontFamily="sans-serif">R1</text>
            <text x="14374.57" y="2594.63" fill="currentColor" stroke="none" fontSize="3519.7" fontFamily="sans-serif">C1</text>
            <text x="-89.73" y="7284.03" fill="currentColor" stroke="none" fontSize="3519.7" fontFamily="sans-serif">Vin</text>
            <text x="33883.77" y="7551.54" fill="currentColor" stroke="none" fontSize="3519.7" fontFamily="sans-serif">Vout</text>
            <g>
              <line x1="15922.47" y1="8360.94" x2="15922.47" y2="4334.96" />
              <line x1="16733.11" y1="8360.94" x2="16733.11" y2="4334.96" />
            </g>
            <line x1="15922.47" y1="6347.92" x2="7067.46" y2="6347.92" />
            <line x1="23559.75" y1="6347.92" x2="16733.11" y2="6347.92" />
          </g>
        </svg>
      </div>
    );
  }

  if (topology === "low-pass-2nd") {
    return (
      <div className="schematic-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
        <svg 
          className="filter-schematic"
          style={{ height: "120px", width: "auto" }} 
          viewBox="-100 0 5200 1500" 
          role="img" 
          aria-label="RC 2-stage low-pass schematic (user provided)"
        >
          <g stroke="currentColor" fill="none" strokeWidth="23.88" strokeMiterlimit="22.9">
            <polyline points="541.64,491.13 895.69,491.13 945.46,599.73 1045,382.53 1144.54,599.73 1244.08,382.53 1343.62,599.73 1443.16,382.53 1492.93,491.13 1939.79,491.13 "/>
            <g>
              <line x1="1785.63" y1="858.26" x2="2093.95" y2="858.26" />
              <line x1="1785.63" y1="920.35" x2="2093.95" y2="920.35" />
            </g>
            <line x1="1939.79" y1="858.26" x2="1939.79" y2="488.28" />
            <line x1="1939.79" y1="1290.33" x2="1939.79" y2="920.35" />
            <polygon points="1939.79,1409.26 2010.36,1349.79 2080.93,1290.33 1939.79,1290.33 1798.66,1290.33 1869.23,1349.79 "/>
            <circle cx="499.8" cy="491.13" r="41.84"/>
            <circle cx="1939.79" cy="488.28" r="41.84" fill="currentColor" stroke="none" />
            <text x="1061.61" y="198.7" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">R1</text>
            <text x="2193.59" y="973.91" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">C1</text>
            <text x="-6.87" y="562.82" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">Vin</text>
            <polyline points="1939.79,488.28 2293.84,488.28 2343.61,596.88 2443.15,379.68 2542.69,596.88 2642.23,379.68 2741.77,596.88 2841.31,379.68 2891.09,488.28 3202.42,488.28 "/>
            <g>
              <line x1="3048.26" y1="858.26" x2="3356.58" y2="858.26" />
              <line x1="3048.26" y1="920.35" x2="3356.58" y2="920.35" />
            </g>
            <line x1="3202.42" y1="858.26" x2="3202.42" y2="488.28" />
            <line x1="3202.42" y1="1290.33" x2="3202.42" y2="920.35" />
            <polygon points="3202.42,1409.26 3272.99,1349.79 3343.55,1290.33 3202.42,1290.33 3061.28,1290.33 3131.85,1349.79 "/>
            <circle cx="3202.42" cy="488.28" r="41.84" fill="currentColor" stroke="none" />
            <line x1="3168.04" y1="488.28" x2="3801.28" y2="488.28" />
            <circle cx="3843.13" cy="488.28" r="41.84"/>
            <text x="3921.89" y="565.17" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">Vout</text>
            <text x="3454.46" y="973.91" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">C</text>
            <text x="3650.52" y="973.91" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">2</text>
            <text x="2435.37" y="198.7" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">R</text>
            <text x="2607.66" y="198.7" fill="currentColor" stroke="none" fontSize="269.55" fontFamily="sans-serif">2</text>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="schematic-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      <svg 
        className="filter-schematic"
        style={{ height: "120px", width: "auto" }} 
        viewBox="-100 0 2600 1100" 
        role="img" 
        aria-label="RC low-pass schematic (user provided)"
      >
        <g stroke="currentColor" fill="none" strokeWidth="16" strokeMiterlimit="22.9">
          <polyline points="369.47,333.2 610.97,333.2 644.92,407.29 712.82,259.13 780.72,407.29 848.62,259.13 916.52,407.29 984.42,259.13 1018.37,333.2 1230.73,333.2 "/>
          <g>
            <line x1="1218.02" y1="583.64" x2="1428.34" y2="583.64" />
            <line x1="1218.02" y1="625.98" x2="1428.34" y2="625.98" />
          </g>
          <line x1="1323.18" y1="583.64" x2="1323.18" y2="331.26" />
          <line x1="1230.73" y1="333.2" x2="1662.68" y2="333.2" />
          <line x1="1323.18" y1="878.36" x2="1323.18" y2="625.98" />
          <polygon points="1323.18,959.48 1371.32,918.92 1419.45,878.36 1323.18,878.36 1226.91,878.36 1275.04,918.92 "/>
          <circle cx="340.92" cy="333.2" r="28.54" />
          <circle cx="1691.23" cy="333.2" r="28.54" />
          <circle cx="1323.18" cy="331.26" r="28.54" fill="currentColor" stroke="none" />
          <text x="724.15" y="133.73" fill="currentColor" stroke="none" fontSize="183.87" fontFamily="sans-serif">R1</text>
          <text x="1496.3" y="662.52" fill="currentColor" stroke="none" fontSize="183.87" fontFamily="sans-serif">C1</text>
          <text x="-4.69" y="382.11" fill="currentColor" stroke="none" fontSize="183.87" fontFamily="sans-serif">Vin</text>
          <text x="1770.05" y="396.08" fill="currentColor" stroke="none" fontSize="183.87" fontFamily="sans-serif">Vout</text>
        </g>
      </svg>
    </div>
  );
}

