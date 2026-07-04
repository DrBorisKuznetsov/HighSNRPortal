import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  BookOpen,
  CircleHelp,
  Database,
  Download,
  Home,
  RadioTower,
  RotateCcw,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import { ChartPanel } from "../components/ChartPanel";
import { isPowerOfTwo, formatVoltsPeak, formatVolts, formatDbc, formatPercent, formatNumber, formatCompactUnit, positiveAmplitude } from "../utils/formatters";
import { buildLinearCsv, buildNonlinearCsv, validateLinearInputs, validateNonlinearInputs, validateComponentInputs, modeLabel } from "../utils/helpers";
import { FilterSetupView } from "../components/views/FilterSetupView";
import { Readout } from "../components/ui/Readout";
import { MethodText } from "../components/ui/MethodText";
import { Metric } from "../components/ui/Metric";
import { FilterSchematic } from "../components/ui/FilterSchematic";
import { HarmonicAmplitudeChart } from "../components/ui/HarmonicAmplitudeChart";
import { CapacitorLibraryView } from "../components/views/CapacitorLibraryView";
import { LinearView } from "../components/views/LinearView";
import { NonlinearView } from "../components/views/NonlinearView";
import { MethodologyView } from "../components/views/MethodologyView";
import { NumericField } from "../components/NumericField";
import {
  buildCapacitanceCurve,
  capacitorPresetGroups,
  capacitorPresets,
  defaultCapacitorPresetId,
  estimatePolynomialCoefficients,
  getCapacitorPreset,
  type CapacitorPresetId,
} from "../data/capacitorLibrary";
import {
  calculateCutoffFrequency,
  calculateFrequencyResponse,
  defaultFrequencyRange,
  type FrequencyRange,
  type RcTopology,
} from "../solver/acResponse";
import { formatDb, formatEngineering, formatHz, formatPhase } from "../solver/format";

import {
  defaultNonlinearSettings,
  defaultNonlinearSignal,
  simulateNonlinearDistortion,
  sweepNonlinearDistortionByFrequency,
  type DistortionSweepPoint,
  type NonlinearSimulationSettings,
  type NonlinearSignal,
} from "../solver/nonlinearDistortion";
import { trackEvent } from "../utils/analytics";

export type AnalysisMode = "setup" | "linear" | "nonlinear" | "methodology";
export type OpenMethodology = (sectionId: string) => void;

const defaultCircuit = {
  topology: "low-pass" as RcTopology,
  resistanceOhms: 1000,
  capacitanceFarads: getCapacitorPreset(defaultCapacitorPresetId).cNomFarads,
};

const defaultDistortionSweepRange: FrequencyRange = {
  startHz: 100,
  stopHz: 100_000,
  points: 32,
};

export const topologyLabels: Record<RcTopology, string> = {
  "low-pass": "RC Low-pass",
  "high-pass": "RC High-pass",
  "low-pass-2nd": "RC 2-Stage Low-pass",
};

export type TopologyCatalogItem = {
  id: string;
  label: string;
  family: string;
  response: string;
  order: string;
  capacitors: string[];
  solverTopology?: RcTopology;
};

export const topologyCatalog: TopologyCatalogItem[] = [
  {
    id: "rc-low-pass",
    label: "RC Low-pass",
    family: "RC",
    response: "Low-pass",
    order: "1st",
    capacitors: ["C1"],
    solverTopology: "low-pass",
  },
  {
    id: "rc-high-pass",
    label: "RC High-pass",
    family: "RC",
    response: "High-pass",
    order: "1st",
    capacitors: ["C1"],
    solverTopology: "high-pass",
  },
  { id: "rl-low-pass", label: "RL Low-pass", family: "RL", response: "Low-pass", order: "1st", capacitors: [] },
  { id: "rl-high-pass", label: "RL High-pass", family: "RL", response: "High-pass", order: "1st", capacitors: [] },
  { id: "rc-lag", label: "RC Lag", family: "RC", response: "Lag", order: "1st", capacitors: ["C1"] },
  { id: "rc-lead", label: "RC Lead", family: "RC", response: "Lead", order: "1st", capacitors: ["C1"] },
  {
    id: "rc-low-pass-2nd",
    label: "RC 2-Stage Low-pass",
    family: "RC",
    response: "Low-pass",
    order: "2nd",
    capacitors: ["C1", "C2"],
    solverTopology: "low-pass-2nd",
  },
  { id: "crc-pi", label: "CRC Pi", family: "RC", response: "Low-pass", order: "2nd", capacitors: ["C1", "C2"] },
  { id: "rcr-t", label: "RCR T", family: "RC", response: "Low-pass", order: "2nd", capacitors: ["C1"] },
  { id: "twin-t-notch", label: "Twin-T Notch", family: "RC", response: "Notch", order: "2nd", capacitors: ["C1", "C2", "C3"] },
  { id: "passive-band-pass", label: "RC Band-pass", family: "RC", response: "Band-pass", order: "2nd", capacitors: ["C1", "C2"] },
  { id: "rlc-low-pass", label: "RLC Low-pass", family: "RLC", response: "Low-pass", order: "2nd", capacitors: ["C1"] },
  { id: "rlc-high-pass", label: "RLC High-pass", family: "RLC", response: "High-pass", order: "2nd", capacitors: ["C1"] },
  { id: "rlc-band-pass", label: "RLC Band-pass", family: "RLC", response: "Band-pass", order: "2nd", capacitors: ["C1"] },
  { id: "rlc-notch", label: "RLC Notch", family: "RLC", response: "Notch", order: "2nd", capacitors: ["C1"] },
  { id: "sallen-key-lp", label: "Sallen-Key LP", family: "Active", response: "Low-pass", order: "2nd", capacitors: ["C1", "C2"] },
  { id: "sallen-key-hp", label: "Sallen-Key HP", family: "Active", response: "High-pass", order: "2nd", capacitors: ["C1", "C2"] },
  { id: "mfb-low-pass", label: "MFB Low-pass", family: "Active", response: "Low-pass", order: "2nd", capacitors: ["C1", "C2"] },
  { id: "mfb-band-pass", label: "MFB Band-pass", family: "Active", response: "Band-pass", order: "2nd", capacitors: ["C1", "C2"] },
  { id: "bessel-ladder", label: "Bessel Ladder", family: "LC", response: "Low-pass", order: "3rd", capacitors: ["C1", "C2"] },
  { id: "chebyshev-ladder", label: "Chebyshev Ladder", family: "LC", response: "Low-pass", order: "5th", capacitors: ["C1", "C2", "C3"] },
];

export function App() {
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("setup");
  const [pendingMethodSection, setPendingMethodSection] = useState<string | null>(
    null,
  );
  const [topology, setTopology] = useState<RcTopology>(defaultCircuit.topology);
  const [resistanceOhms, setResistanceOhms] = useState(defaultCircuit.resistanceOhms);
  const [capacitanceFarads, setCapacitanceFarads] = useState(defaultCircuit.capacitanceFarads);
  const [resistanceOhms2, setResistanceOhms2] = useState(defaultCircuit.resistanceOhms);
  const [capacitanceFarads2, setCapacitanceFarads2] = useState(defaultCircuit.capacitanceFarads);
  const [selectedCapacitorId, setSelectedCapacitorId] =
    useState<CapacitorPresetId>(defaultCapacitorPresetId);
  const [frequencyRange, setFrequencyRange] = useState<FrequencyRange>(
    defaultFrequencyRange,
  );
  const [distortionSweepRange, setDistortionSweepRange] = useState<FrequencyRange>(
    defaultDistortionSweepRange,
  );
  const [signal, setSignal] = useState<NonlinearSignal>(defaultNonlinearSignal);
  const defaultPolynomial = estimatePolynomialCoefficients(
    getCapacitorPreset(defaultCapacitorPresetId),
  );
  const [alphaPerVolt, setAlphaPerVolt] = useState(defaultPolynomial.alphaPerVolt);
  const [betaPerVoltSquared, setBetaPerVoltSquared] = useState(
    defaultPolynomial.betaPerVoltSquared,
  );
  const [gammaPerVoltCubed, setGammaPerVoltCubed] = useState(
    defaultPolynomial.gammaPerVoltCubed,
  );
  const [settings, setSettings] = useState<NonlinearSimulationSettings>(
    defaultNonlinearSettings,
  );

  const primaryComponentValidationErrors = validateComponentInputs(
    resistanceOhms,
    capacitanceFarads,
  );
  const secondaryComponentValidationErrors =
    topology === "low-pass-2nd"
      ? validateComponentInputs(resistanceOhms2, capacitanceFarads2).map((error) =>
          error.replace("R1", "R2").replace("C1", "C2"),
        )
      : [];
  const componentValidationErrors = [
    ...primaryComponentValidationErrors,
    ...secondaryComponentValidationErrors,
  ];
  const linearValidationErrors = validateLinearInputs(
    resistanceOhms,
    capacitanceFarads,
    frequencyRange,
  ).concat(secondaryComponentValidationErrors);
  const nonlinearValidationErrors = validateNonlinearInputs(
    resistanceOhms,
    capacitanceFarads,
    signal,
    settings,
  ).concat(secondaryComponentValidationErrors);
  const distortionSweepValidationErrors = validateLinearInputs(
    resistanceOhms,
    capacitanceFarads,
    distortionSweepRange,
  ).concat(secondaryComponentValidationErrors);

  const cutoffFrequency = useMemo(
    () =>
      componentValidationErrors.length === 0
        ? calculateCutoffFrequency(
            resistanceOhms,
            capacitanceFarads,
            topology,
            resistanceOhms2,
            capacitanceFarads2,
          )
        : Number.NaN,
    [
      capacitanceFarads,
      capacitanceFarads2,
      componentValidationErrors.length,
      resistanceOhms,
      resistanceOhms2,
      topology,
    ],
  );

  const linearResponse = useMemo(
    () =>
      linearValidationErrors.length === 0
        ? calculateFrequencyResponse({
            topology,
            resistanceOhms,
            capacitanceFarads,
            resistanceOhms2,
            capacitanceFarads2,
            frequency: frequencyRange,
          })
        : [],
    [
      topology,
      resistanceOhms,
      resistanceOhms2,
      capacitanceFarads,
      capacitanceFarads2,
      frequencyRange,
      linearValidationErrors.length,
    ],
  );

  const selectedCapacitorPreset = getCapacitorPreset(selectedCapacitorId);

  const nonlinearComputation = useMemo(() => {
    if (nonlinearValidationErrors.length > 0) {
      return { result: undefined, error: undefined };
    }

    try {
      return {
        result: simulateNonlinearDistortion({
          topology,
          resistanceOhms,
          capacitor: {
            capacitanceFarads,
            alphaPerVolt,
            betaPerVoltSquared,
            gammaPerVoltCubed,
          },
          resistanceOhms2,
          capacitor2:
            topology === "low-pass-2nd"
              ? {
                  capacitanceFarads: capacitanceFarads2,
                  alphaPerVolt,
                  betaPerVoltSquared,
                  gammaPerVoltCubed,
                }
              : undefined,
          signal,
          settings,
        }),
        error: undefined,
      };
    } catch (error) {
      return {
        result: undefined,
        error: error instanceof Error ? error.message : "Nonlinear simulation failed.",
      };
    }
  }, [
    alphaPerVolt,
    betaPerVoltSquared,
    capacitanceFarads,
    capacitanceFarads2,
    gammaPerVoltCubed,
    nonlinearValidationErrors.length,
    resistanceOhms,
    resistanceOhms2,
    settings,
    signal,
    topology,
  ]);

  const distortionSweepComputation = useMemo(() => {
    if (
      nonlinearValidationErrors.length > 0 ||
      distortionSweepValidationErrors.length > 0
    ) {
      return { result: [] as DistortionSweepPoint[], error: undefined };
    }

    try {
      return {
        result: sweepNonlinearDistortionByFrequency({
          topology,
          resistanceOhms,
          capacitor: {
            capacitanceFarads,
            alphaPerVolt,
            betaPerVoltSquared,
            gammaPerVoltCubed,
          },
          resistanceOhms2,
          capacitor2:
            topology === "low-pass-2nd"
              ? {
                  capacitanceFarads: capacitanceFarads2,
                  alphaPerVolt,
                  betaPerVoltSquared,
                  gammaPerVoltCubed,
                }
              : undefined,
          signal: {
            amplitudeVolts: signal.amplitudeVolts,
            dcBiasVolts: signal.dcBiasVolts,
          },
          settings,
          frequency: distortionSweepRange,
        }),
        error: undefined,
      };
    } catch (error) {
      return {
        result: [] as DistortionSweepPoint[],
        error:
          error instanceof Error
            ? error.message
            : "Distortion frequency sweep failed.",
      };
    }
  }, [
    alphaPerVolt,
    betaPerVoltSquared,
    capacitanceFarads,
    capacitanceFarads2,
    distortionSweepRange,
    distortionSweepValidationErrors.length,
    gammaPerVoltCubed,
    nonlinearValidationErrors.length,
    resistanceOhms,
    resistanceOhms2,
    settings,
    signal.amplitudeVolts,
    signal.dcBiasVolts,
    topology,
  ]);

  const cutoffPoint =
    linearResponse.length > 0
      ? linearResponse.reduce((closest, point) => {
          return Math.abs(point.frequencyHz - cutoffFrequency) <
            Math.abs(closest.frequencyHz - cutoffFrequency)
            ? point
            : closest;
        }, linearResponse[0])
      : undefined;

  const nonlinearResult = nonlinearComputation.result;
  const activeValidationErrors =
    analysisMode === "setup"
      ? linearValidationErrors
      : analysisMode === "linear"
        ? componentValidationErrors
        : analysisMode === "nonlinear"
          ? [
              ...nonlinearValidationErrors,
              ...distortionSweepValidationErrors,
              ...(nonlinearComputation.error ? [nonlinearComputation.error] : []),
              ...(distortionSweepComputation.error
                ? [distortionSweepComputation.error]
                : []),
            ]
          : [];

  useEffect(() => {
    const handleMethodHash = () => {
      const sectionId = window.location.hash.replace("#", "");

      if (sectionId.startsWith("method-")) {
        setAnalysisMode("methodology");
        setPendingMethodSection(sectionId);
      }
    };

    window.addEventListener("hashchange", handleMethodHash);
    handleMethodHash();

    return () => window.removeEventListener("hashchange", handleMethodHash);
  }, []);

  useEffect(() => {
    const handleMethodLinkClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>("a[href^='#method-']");
      const href = link?.getAttribute("href");

      if (!href) {
        return;
      }

      event.preventDefault();
      const sectionId = href.slice(1);
      window.history.pushState(null, "", href);
      setAnalysisMode("methodology");
      setPendingMethodSection(sectionId);
    };

    document.addEventListener("click", handleMethodLinkClick);

    return () => document.removeEventListener("click", handleMethodLinkClick);
  }, []);

  useEffect(() => {
    if (analysisMode !== "methodology" || !pendingMethodSection) {
      return;
    }

    const timerId = window.setTimeout(() => {
      const target = document.getElementById(pendingMethodSection);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document
          .querySelectorAll(".method-section-focus")
          .forEach((section) => section.classList.remove("method-section-focus"));
        target.classList.add("method-section-focus");
        window.history.replaceState(null, "", `#${pendingMethodSection}`);
      }

      setPendingMethodSection(null);
    }, 80);

    return () => window.clearTimeout(timerId);
  }, [analysisMode, pendingMethodSection]);

  const openMethodology: OpenMethodology = (sectionId) => {
    setAnalysisMode("methodology");
    setPendingMethodSection(sectionId);
  };

  const selectAnalysisMode = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    trackEvent('tab_changed', { mode });

    if (mode !== "methodology" && window.location.hash.startsWith("#method-")) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  };

  const resetDefaults = () => {
    const preset = getCapacitorPreset(defaultCapacitorPresetId);
    const polynomial = estimatePolynomialCoefficients(preset);

    setAnalysisMode("setup");
    setTopology(defaultCircuit.topology);
    setResistanceOhms(defaultCircuit.resistanceOhms);
    setResistanceOhms2(defaultCircuit.resistanceOhms);
    setSelectedCapacitorId(defaultCapacitorPresetId);
    setCapacitanceFarads(preset.cNomFarads);
    setCapacitanceFarads2(preset.cNomFarads);
    setFrequencyRange(defaultFrequencyRange);
    setDistortionSweepRange(defaultDistortionSweepRange);
    setSignal(defaultNonlinearSignal);
    setAlphaPerVolt(polynomial.alphaPerVolt);
    setBetaPerVoltSquared(polynomial.betaPerVoltSquared);
    setGammaPerVoltCubed(polynomial.gammaPerVoltCubed);
    setSettings(defaultNonlinearSettings);
  };

  const applyCapacitorPreset = (presetId: CapacitorPresetId) => {
    const preset = getCapacitorPreset(presetId);
    const polynomial = estimatePolynomialCoefficients(preset);

    setSelectedCapacitorId(presetId);
    setCapacitanceFarads(preset.cNomFarads);
    setCapacitanceFarads2(preset.cNomFarads);
    setAlphaPerVolt(polynomial.alphaPerVolt);
    setBetaPerVoltSquared(polynomial.betaPerVoltSquared);
    setGammaPerVoltCubed(polynomial.gammaPerVoltCubed);
    trackEvent('preset_applied', { preset_id: presetId });
  };

  const updateTopology = (newTopology: RcTopology) => {
    setTopology(newTopology);
    trackEvent('topology_changed', { topology: newTopology });
  };

  const updateCapacitanceFarads = (value: number) => {
    setSelectedCapacitorId("custom");
    setCapacitanceFarads(value);
    trackEvent('parameter_changed', { parameter: 'capacitance_farads', value });
  };

  const updateCapacitanceFarads2 = (value: number) => {
    setSelectedCapacitorId("custom");
    setCapacitanceFarads2(value);
    trackEvent('parameter_changed', { parameter: 'capacitance_farads2', value });
  };

  const updateAlphaPerVolt = (value: number) => {
    setSelectedCapacitorId("custom");
    setAlphaPerVolt(value);
    trackEvent('parameter_changed', { parameter: 'alpha_per_volt', value });
  };

  const updateBetaPerVoltSquared = (value: number) => {
    setSelectedCapacitorId("custom");
    setBetaPerVoltSquared(value);
    trackEvent('parameter_changed', { parameter: 'beta_per_volt_squared', value });
  };

  const updateGammaPerVoltCubed = (value: number) => {
    setSelectedCapacitorId("custom");
    setGammaPerVoltCubed(value);
    trackEvent('parameter_changed', { parameter: 'gamma_per_volt_cubed', value });
  };

  const exportCsv = () => {
    const rows =
      analysisMode === "setup"
        ? buildLinearCsv(topology, linearResponse)
        : analysisMode === "nonlinear" && nonlinearResult
          ? buildNonlinearCsv(nonlinearResult, distortionSweepComputation.result)
          : [];

    if (rows.length === 0) {
      return;
    }

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      analysisMode === "setup"
        ? `${topology}-ideal-ac-response.csv`
        : `${topology}-nonlinear-distortion.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const canExport =
    analysisMode === "setup"
      ? linearResponse.length > 0
      : analysisMode === "nonlinear"
        ? Boolean(nonlinearResult)
        : false;

  return (
    <main
      className={
        analysisMode === "methodology"
          ? "app-container methodology-open"
          : "app-container"
      }
    >
      <aside className="sidebar" aria-label="Project summary">
        <div className="logo-container">
          <div className="logo-icon">
            <Waves size={23} />
          </div>
          <div>
            <span className="logo-text">Passive Filter Tool</span>
            <span className="logo-sub">Simulation Tool</span>
          </div>
        </div>

        <a className="portal-link" href="https://highsnr.org/">
          <Home size={15} />
          <span>HighSNR Portal</span>
        </a>

        <section className="input-section">
          <div className="section-title">
            <span>
              <RadioTower size={15} />
              Current Filter
            </span>
          </div>
          <div className="sidebar-readout">
            <Readout label="Topology" value={topologyLabels[topology]} />
            <Readout label="R1" value={formatEngineering(resistanceOhms, "ohm")} />
            <Readout label="C1" value={formatEngineering(capacitanceFarads, "F")} />
            {topology === "low-pass-2nd" && (
              <>
                <Readout label="R2" value={formatEngineering(resistanceOhms2, "ohm")} />
                <Readout label="C2" value={formatEngineering(capacitanceFarads2, "F")} />
              </>
            )}
            <Readout label="Model" value={selectedCapacitorPreset.dielectric} />
            <Readout
              label="fc"
              value={Number.isFinite(cutoffFrequency) ? formatHz(cutoffFrequency) : "Invalid"}
            />
          </div>
        </section>

        <section className="input-section">
          <div className="section-title">
            <span>
              <Activity size={15} />
              Analysis State
            </span>
          </div>
          <div className="sidebar-readout">
            <Readout label="Mode" value={modeLabel(analysisMode)} />
            <Readout
              label="Status"
              value={activeValidationErrors.length > 0 ? "Invalid" : "Ready"}
            />
            <Readout label="Signal" value={formatHz(signal.frequencyHz)} />
            <Readout label="Sweep" value={`${formatHz(distortionSweepRange.startHz)}...${formatHz(distortionSweepRange.stopHz)}`} />
          </div>
        </section>
      </aside>

      <section className="main-content" aria-label="Filter analysis">
        <div className="tabs-nav-container">
          <nav className="tabs-header" aria-label="Workspace section">
            <button
              className={analysisMode === "setup" ? "tab-btn active" : "tab-btn"}
              type="button"
              onClick={() => selectAnalysisMode("setup")}
            >
              <RadioTower size={16} />
              Filter
            </button>
            <button
              className={analysisMode === "linear" ? "tab-btn active" : "tab-btn"}
              type="button"
              onClick={() => selectAnalysisMode("linear")}
            >
              <Database size={16} />
              Capacitors
            </button>
            <button
              className={analysisMode === "nonlinear" ? "tab-btn active" : "tab-btn"}
              type="button"
              onClick={() => selectAnalysisMode("nonlinear")}
            >
              <SlidersHorizontal size={16} />
              Distortion Sweep
            </button>
            <button
              className={analysisMode === "methodology" ? "tab-btn active" : "tab-btn"}
              type="button"
              onClick={() => setAnalysisMode("methodology")}
            >
              <BookOpen size={16} />
              Methodology
            </button>
          </nav>

          <div className="top-actions">
            <div
              className={activeValidationErrors.length > 0 ? "calc-status error" : "calc-status ready"}
              aria-live="polite"
            >
              <span className="status-dot" />
              <span>{activeValidationErrors.length > 0 ? "Invalid" : "Ready"}</span>
            </div>
            <button className="btn-secondary" type="button" title="Reset defaults" onClick={resetDefaults}>
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              className="btn-secondary"
              type="button" title="Export CSV"
              onClick={exportCsv}
              disabled={!canExport}
            >
              <Download size={16} />
              CSV
            </button>
          </div>
        </div>

        {activeValidationErrors.length > 0 && (
          <div className="validation-banner is-error">
            <span>{activeValidationErrors[0]}</span>
          </div>
        )}

        {analysisMode === "setup" && (
          <FilterSetupView
            topology={topology}
            setTopology={updateTopology}
            resistanceOhms={resistanceOhms}
            setResistanceOhms={setResistanceOhms}
            capacitanceFarads={capacitanceFarads}
            setCapacitanceFarads={updateCapacitanceFarads}
            resistanceOhms2={resistanceOhms2}
            setResistanceOhms2={setResistanceOhms2}
            capacitanceFarads2={capacitanceFarads2}
            setCapacitanceFarads2={updateCapacitanceFarads2}
            cutoffFrequency={cutoffFrequency}
            cutoffPoint={cutoffPoint}
            response={linearResponse}
            frequencyRange={frequencyRange}
            setFrequencyRange={setFrequencyRange}
            onOpenMethodology={openMethodology}
          />
        )}

        {analysisMode === "linear" && (
          <CapacitorLibraryView
            selectedCapacitorId={selectedCapacitorId}
            onSelectPreset={applyCapacitorPreset}
            capacitanceFarads={capacitanceFarads}
            setCapacitanceFarads={updateCapacitanceFarads}
            alphaPerVolt={alphaPerVolt}
            setAlphaPerVolt={updateAlphaPerVolt}
            betaPerVoltSquared={betaPerVoltSquared}
            setBetaPerVoltSquared={updateBetaPerVoltSquared}
            gammaPerVoltCubed={gammaPerVoltCubed}
            setGammaPerVoltCubed={updateGammaPerVoltCubed}
            signal={signal}
            onOpenMethodology={openMethodology}
          />
        )}

        {analysisMode === "nonlinear" && (
          <NonlinearView
            topology={topology}
            resistanceOhms={resistanceOhms}
            capacitanceFarads={capacitanceFarads}
            resistanceOhms2={resistanceOhms2}
            capacitanceFarads2={capacitanceFarads2}
            signal={signal}
            setSignal={setSignal}
            selectedCapacitorPreset={selectedCapacitorPreset}
            alphaPerVolt={alphaPerVolt}
            betaPerVoltSquared={betaPerVoltSquared}
            gammaPerVoltCubed={gammaPerVoltCubed}
            settings={settings}
            setSettings={setSettings}
            result={nonlinearResult}
            sweepRange={distortionSweepRange}
            setSweepRange={setDistortionSweepRange}
            sweepResult={distortionSweepComputation.result}
            onOpenMethodology={openMethodology}
          />
        )}

        {analysisMode === "methodology" && <MethodologyView />}
      </section>
    </main>
  );
}

