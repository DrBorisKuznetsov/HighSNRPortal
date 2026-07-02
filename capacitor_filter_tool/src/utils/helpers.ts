import { type FrequencyRange, type RcTopology } from "../solver/acResponse";
import { type NonlinearSignal, type NonlinearSimulationSettings, type DistortionSweepPoint, simulateNonlinearDistortion } from "../solver/nonlinearDistortion";
import { type AnalysisMode } from "../app/App";
import { isPowerOfTwo } from "./formatters";

export function buildLinearCsv(
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

export function buildNonlinearCsv(
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

export function validateLinearInputs(
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

export function validateNonlinearInputs(
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

export function validateComponentInputs(resistanceOhms: number, capacitanceFarads: number) {
  const errors: string[] = [];

  if (!Number.isFinite(resistanceOhms) || resistanceOhms <= 0) {
    errors.push("R1 must be a positive value.");
  }

  if (!Number.isFinite(capacitanceFarads) || capacitanceFarads <= 0) {
    errors.push("C1 must be a positive value.");
  }

  return errors;
}

export function modeLabel(mode: AnalysisMode) {
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

