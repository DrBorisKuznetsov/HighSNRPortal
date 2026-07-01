import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  BookOpen,
  CircleHelp,
  Database,
  Download,
  RadioTower,
  RotateCcw,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import { ChartPanel } from "../components/ChartPanel";
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

type AnalysisMode = "setup" | "linear" | "nonlinear" | "methodology";
type OpenMethodology = (sectionId: string) => void;

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

const topologyLabels: Record<RcTopology, string> = {
  "low-pass": "RC Low-pass",
  "high-pass": "RC High-pass",
};

type TopologyCatalogItem = {
  id: string;
  label: string;
  family: string;
  response: string;
  order: string;
  capacitors: string[];
  solverTopology?: RcTopology;
};

const topologyCatalog: TopologyCatalogItem[] = [
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

  const componentValidationErrors = validateComponentInputs(
    resistanceOhms,
    capacitanceFarads,
  );
  const linearValidationErrors = validateLinearInputs(
    resistanceOhms,
    capacitanceFarads,
    frequencyRange,
  );
  const nonlinearValidationErrors = validateNonlinearInputs(
    resistanceOhms,
    capacitanceFarads,
    signal,
    settings,
  );
  const distortionSweepValidationErrors = validateLinearInputs(
    resistanceOhms,
    capacitanceFarads,
    distortionSweepRange,
  );

  const cutoffFrequency = useMemo(
    () =>
      componentValidationErrors.length === 0
        ? calculateCutoffFrequency(resistanceOhms, capacitanceFarads)
        : Number.NaN,
    [capacitanceFarads, componentValidationErrors.length, resistanceOhms],
  );

  const linearResponse = useMemo(
    () =>
      linearValidationErrors.length === 0
        ? calculateFrequencyResponse({
            topology,
            resistanceOhms,
            capacitanceFarads,
            frequency: frequencyRange,
          })
        : [],
    [
      topology,
      resistanceOhms,
      capacitanceFarads,
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
    gammaPerVoltCubed,
    nonlinearValidationErrors.length,
    resistanceOhms,
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
    distortionSweepRange,
    distortionSweepValidationErrors.length,
    gammaPerVoltCubed,
    nonlinearValidationErrors.length,
    resistanceOhms,
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
    setSelectedCapacitorId(defaultCapacitorPresetId);
    setCapacitanceFarads(preset.cNomFarads);
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
    setAlphaPerVolt(polynomial.alphaPerVolt);
    setBetaPerVoltSquared(polynomial.betaPerVoltSquared);
    setGammaPerVoltCubed(polynomial.gammaPerVoltCubed);
  };

  const updateCapacitanceFarads = (value: number) => {
    setSelectedCapacitorId("custom");
    setCapacitanceFarads(value);
  };

  const updateAlphaPerVolt = (value: number) => {
    setSelectedCapacitorId("custom");
    setAlphaPerVolt(value);
  };

  const updateBetaPerVoltSquared = (value: number) => {
    setSelectedCapacitorId("custom");
    setBetaPerVoltSquared(value);
  };

  const updateGammaPerVoltCubed = (value: number) => {
    setSelectedCapacitorId("custom");
    setGammaPerVoltCubed(value);
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
              type="button"
              title="Export CSV"
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
            setTopology={setTopology}
            resistanceOhms={resistanceOhms}
            setResistanceOhms={setResistanceOhms}
            capacitanceFarads={capacitanceFarads}
            setCapacitanceFarads={updateCapacitanceFarads}
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

function FilterSetupView({
  topology,
  setTopology,
  resistanceOhms,
  setResistanceOhms,
  capacitanceFarads,
  setCapacitanceFarads,
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

  return (
    <>
      <div className="insight-panel">
        <div className="insight-copy">
          <span className="insight-kicker">Filter Parameters</span>
          <strong>{topologyLabels[topology]}</strong>
        </div>
        <div className="insight-stats">
          <Readout
            label="Cutoff"
            value={Number.isFinite(cutoffFrequency) ? formatHz(cutoffFrequency) : "Invalid"}
            methodId="method-linear"
            onOpenMethodology={onOpenMethodology}
          />
          <Readout label="Order" value="1st" />
          <Readout label="State" value="Ideal RC" />
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
          </div>
          <div className="diagnostic-table-wrap">
            <table className="diagnostic-table compact">
              <tbody>
                <tr className="diag-section-row">
                  <th colSpan={3}>Selected Topology</th>
                </tr>
                <tr className="diag-group-main">
                  <td>Topology</td>
                  <td>{topologyLabels[topology]}</td>
                  <td>{topology === "low-pass" ? "R series, C shunt" : "C series, R shunt"}</td>
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
                  <td>1 / (2*pi*R*C)</td>
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

function CapacitorLibraryView({
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

function LinearView({
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

function NonlinearView({
  topology,
  resistanceOhms,
  capacitanceFarads,
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
    ? calculateCutoffFrequency(resistanceOhms, capacitanceFarads)
    : Number.NaN;
  const signalFrequencyPoint = useMemo(() => {
    if (!hasValidContext) {
      return undefined;
    }

    const [point] = calculateFrequencyResponse({
      topology,
      resistanceOhms,
      capacitanceFarads,
      frequency: {
        startHz: signal.frequencyHz,
        stopHz: signal.frequencyHz * 1.000001,
        points: 2,
      },
    });

    return point;
  }, [capacitanceFarads, hasValidContext, resistanceOhms, signal.frequencyHz, topology]);
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
      frequency: sweepRange,
    });
  }, [
    capacitanceFarads,
    hasValidSweepRange,
    resistanceOhms,
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

function HarmonicAmplitudeChart({
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

function MethodologyView() {
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
                <div className="formula-block"><code>Magnitude[dB] = 20*log10(|H(f)|)</code></div>
                <div className="formula-block"><code>Phase[deg] = angle(H(f))*180/pi</code></div>
              </div>
              <table className="definition-table">
                <tbody>
                  <tr><th>Cutoff</th><td>Frequency where the nominal first-order magnitude is near -3 dB, shown in Hz.</td></tr>
                  <tr><th>AC gain @ fin</th><td>Magnitude at the current signal frequency, shown in dB.</td></tr>
                  <tr><th>AC magnitude</th><td>Magnitude curve over the sweep frequency axis, shown in dB.</td></tr>
                  <tr><th>AC phase</th><td>Phase at the current signal frequency or over the AC curve, shown in deg.</td></tr>
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

function FilterSchematic({ topology }: { topology: RcTopology }) {
  if (topology === "high-pass") {
    return (
      <div className="schematic-wrap">
        <svg className="filter-schematic" viewBox="0 0 640 260" role="img" aria-label="RC high-pass schematic">
          <line className="wire" x1="56" y1="120" x2="180" y2="120" />
          <line className="wire" x1="232" y1="120" x2="390" y2="120" />
          <line className="wire" x1="390" y1="120" x2="545" y2="120" />
          <line className="wire" x1="390" y1="120" x2="390" y2="166" />
          <polyline className="resistor" points="390,166 372,176 408,194 372,212 408,230 390,240" />
          <line className="wire" x1="362" y1="240" x2="418" y2="240" />
          <line className="wire" x1="374" y1="250" x2="406" y2="250" />
          <line className="wire" x1="385" y1="258" x2="395" y2="258" />
          <line className="capacitor" x1="180" y1="78" x2="180" y2="162" />
          <line className="capacitor" x1="232" y1="78" x2="232" y2="162" />
          <circle className="node" cx="390" cy="120" r="5" />
          <text className="schematic-label" x="42" y="104">Vin</text>
          <text className="schematic-label" x="536" y="104">Vout</text>
          <text className="schematic-label" x="188" y="65">C1</text>
          <text className="schematic-label" x="414" y="205">R1</text>
        </svg>
      </div>
    );
  }

  return (
    <div className="schematic-wrap">
      <svg className="filter-schematic" viewBox="0 0 640 260" role="img" aria-label="RC low-pass schematic">
        <line className="wire" x1="56" y1="120" x2="145" y2="120" />
        <polyline className="resistor" points="145,120 164,102 196,138 228,102 260,138 292,102 324,138 343,120" />
        <line className="wire" x1="343" y1="120" x2="545" y2="120" />
        <line className="wire" x1="390" y1="120" x2="390" y2="170" />
        <line className="capacitor" x1="352" y1="170" x2="428" y2="170" />
        <line className="capacitor" x1="352" y1="205" x2="428" y2="205" />
        <line className="wire" x1="390" y1="205" x2="390" y2="240" />
        <line className="wire" x1="362" y1="240" x2="418" y2="240" />
        <line className="wire" x1="374" y1="250" x2="406" y2="250" />
        <line className="wire" x1="385" y1="258" x2="395" y2="258" />
        <circle className="node" cx="390" cy="120" r="5" />
        <text className="schematic-label" x="42" y="104">Vin</text>
        <text className="schematic-label" x="536" y="104">Vout</text>
        <text className="schematic-label" x="224" y="84">R1</text>
        <text className="schematic-label" x="414" y="194">C1</text>
      </svg>
    </div>
  );
}

function Metric({
  label,
  value,
  methodId,
  onOpenMethodology,
}: {
  label: string;
  value: string;
  methodId?: string;
  onOpenMethodology?: OpenMethodology;
}) {
  return (
    <div className="metric-card">
      <span className="metric-title">
        {methodId && onOpenMethodology ? (
          <MethodText methodId={methodId} onOpenMethodology={onOpenMethodology}>
            {label}
          </MethodText>
        ) : (
          label
        )}
      </span>
      <strong className="metric-val">{value}</strong>
    </div>
  );
}

function Readout({
  label,
  value,
  methodId,
  onOpenMethodology,
}: {
  label: string;
  value: string;
  methodId?: string;
  onOpenMethodology?: OpenMethodology;
}) {
  return (
    <div className="readout-row">
      <span className="readout-label">
        {methodId && onOpenMethodology ? (
          <MethodText methodId={methodId} onOpenMethodology={onOpenMethodology}>
            {label}
          </MethodText>
        ) : (
          label
        )}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function MethodText({
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

function buildLinearCsv(
  topology: RcTopology,
  response: Array<{ frequencyHz: number; magnitudeDb: number; phaseDeg: number }>,
) {
  if (response.length === 0) {
    return [];
  }

  return [
    `Topology,${topology}`,
    "FrequencyHz,MagnitudeDb,PhaseDeg",
    ...response.map((point) =>
      [point.frequencyHz, point.magnitudeDb, point.phaseDeg].join(","),
    ),
  ];
}

function buildNonlinearCsv(
  result: ReturnType<typeof simulateNonlinearDistortion>,
  sweep: DistortionSweepPoint[],
) {
  return [
    "DistortionFrequencySweep",
    "SignalFrequencyHz,H2AmplitudeVpk,H3AmplitudeVpk,H4AmplitudeVpk,H5AmplitudeVpk,HD2dBc,HD3dBc,HD4dBc,HD5dBc,THDdBc,THDPercent",
    ...sweep.map((point) =>
      [
        point.frequencyHz,
        point.h2AmplitudeVoltsPeak,
        point.h3AmplitudeVoltsPeak,
        point.h4AmplitudeVoltsPeak,
        point.h5AmplitudeVoltsPeak,
        point.hd2Db,
        point.hd3Db,
        point.hd4Db,
        point.hd5Db,
        point.thdDb,
        point.thdPercent,
      ].join(","),
    ),
    "",
    "Spectrum",
    "FrequencyHz,AmplitudeVoltsPeak,AmplitudeDbV",
    ...result.spectrum.map((point) =>
      [point.frequencyHz, point.amplitudeVoltsPeak, point.amplitudeDbv].join(","),
    ),
    "",
    "Harmonics",
    "Harmonic,FrequencyHz,AmplitudeVoltsPeak,dBc",
    ...result.harmonics.map((harmonic) =>
      [
        harmonic.harmonic,
        harmonic.frequencyHz,
        harmonic.amplitudeVoltsPeak,
        harmonic.dbRelativeCarrier,
      ].join(","),
    ),
    "",
    `THDPercent,${result.thdPercent}`,
    `THDdB,${result.thdDb}`,
  ];
}

function validateLinearInputs(
  resistanceOhms: number,
  capacitanceFarads: number,
  frequencyRange: FrequencyRange,
) {
  const errors = validateComponentInputs(resistanceOhms, capacitanceFarads);

  if (!Number.isFinite(frequencyRange.startHz) || frequencyRange.startHz <= 0) {
    errors.push("Start frequency must be positive.");
  }

  if (!Number.isFinite(frequencyRange.stopHz) || frequencyRange.stopHz <= 0) {
    errors.push("Stop frequency must be positive.");
  }

  if (frequencyRange.stopHz <= frequencyRange.startHz) {
    errors.push("Stop frequency must be higher than start frequency.");
  }

  if (!Number.isInteger(frequencyRange.points) || frequencyRange.points < 25) {
    errors.push("Sweep points must be an integer of at least 25.");
  }

  return errors;
}

function validateNonlinearInputs(
  resistanceOhms: number,
  capacitanceFarads: number,
  signal: NonlinearSignal,
  settings: NonlinearSimulationSettings,
) {
  const errors = validateComponentInputs(resistanceOhms, capacitanceFarads);

  if (!Number.isFinite(signal.amplitudeVolts) || signal.amplitudeVolts < 0) {
    errors.push("Signal amplitude must be non-negative.");
  }

  if (!Number.isFinite(signal.frequencyHz) || signal.frequencyHz <= 0) {
    errors.push("Signal frequency must be positive.");
  }

  if (!Number.isFinite(signal.dcBiasVolts)) {
    errors.push("DC bias must be finite.");
  }

  if (!isPowerOfTwo(settings.fftSize) || settings.fftSize < 1024) {
    errors.push("FFT size must be a power of two and at least 1024.");
  }

  if (!Number.isInteger(settings.settleCycles) || settings.settleCycles < 0) {
    errors.push("Settle cycles must be a non-negative integer.");
  }

  if (!Number.isInteger(settings.analysisCycles) || settings.analysisCycles < 1) {
    errors.push("Window cycles must be a positive integer.");
  }

  if (settings.analysisCycles > 0 && settings.fftSize % settings.analysisCycles !== 0) {
    errors.push("Window cycles must divide FFT size for coherent FFT analysis.");
  }

  if (5 * settings.analysisCycles >= settings.fftSize / 2) {
    errors.push("FFT size is too small to measure HD5 with this window.");
  }

  return errors;
}

function validateComponentInputs(resistanceOhms: number, capacitanceFarads: number) {
  const errors: string[] = [];

  if (!Number.isFinite(resistanceOhms) || resistanceOhms <= 0) {
    errors.push("R1 must be a positive value.");
  }

  if (!Number.isFinite(capacitanceFarads) || capacitanceFarads <= 0) {
    errors.push("C1 must be a positive value.");
  }

  return errors;
}

function modeLabel(mode: AnalysisMode) {
  if (mode === "setup") {
    return "Filter";
  }

  if (mode === "linear") {
    return "Capacitors";
  }

  if (mode === "methodology") {
    return "Methodology";
  }

  return "Distortion Sweep";
}

function isPowerOfTwo(value: number) {
  return Number.isInteger(value) && value > 0 && (value & (value - 1)) === 0;
}

function formatVoltsPeak(value: number) {
  return `${formatNumber(value)} Vpk`;
}

function formatVolts(value: number) {
  return `${formatNumber(value)} V`;
}

function formatDbc(value: number) {
  return `${formatNumber(value)} dBc`;
}

function formatPercent(value: number) {
  return `${formatNumber(value)} %`;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "Invalid";
  }

  if (Math.abs(value) >= 100) {
    return value.toFixed(0);
  }

  if (Math.abs(value) >= 10) {
    return value.toFixed(1);
  }

  return value.toFixed(3);
}

function formatCompactUnit(value: string) {
  return value.replace(/\s+/g, "");
}

function positiveAmplitude(amplitude: number) {
  if (!Number.isFinite(amplitude) || amplitude <= 0) {
    return 1e-15;
  }

  return amplitude;
}
