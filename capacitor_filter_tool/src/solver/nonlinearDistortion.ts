import FFT from "fft.js";
import { logSpace, type FrequencyRange, type RcTopology } from "./acResponse";

export type NonlinearCapacitorModel = {
  capacitanceFarads: number;
  alphaPerVolt: number;
  betaPerVoltSquared: number;
  gammaPerVoltCubed: number;
};

export type NonlinearSignal = {
  amplitudeVolts: number;
  frequencyHz: number;
  dcBiasVolts: number;
};

export type NonlinearSimulationSettings = {
  fftSize: number;
  settleCycles: number;
  analysisCycles: number;
};

export type NonlinearDistortionInput = {
  topology: RcTopology;
  resistanceOhms: number;
  capacitor: NonlinearCapacitorModel;
  signal: NonlinearSignal;
  settings: NonlinearSimulationSettings;
};

export type HarmonicMetric = {
  harmonic: number;
  frequencyHz: number;
  amplitudeVoltsPeak: number;
  ratio: number;
  dbRelativeCarrier: number;
};

export type TimeDomainPoint = {
  timeMs: number;
  inputVolts: number;
  outputVolts: number;
  capacitorVolts: number;
};

export type SpectrumPoint = {
  frequencyHz: number;
  amplitudeVoltsPeak: number;
  amplitudeDbv: number;
};

export type CapacitanceProfilePoint = {
  voltage: number;
  capacitanceRatio: number;
  capacitancePercent: number;
};

export type NonlinearDistortionResult = {
  timeDomain: TimeDomainPoint[];
  spectrum: SpectrumPoint[];
  capacitanceProfile: CapacitanceProfilePoint[];
  sampleRateHz: number;
  fundamentalAmplitudeVoltsPeak: number;
  harmonics: HarmonicMetric[];
  thdRatio: number;
  thdPercent: number;
  thdDb: number;
};

export type DistortionSweepPoint = {
  frequencyHz: number;
  fundamentalAmplitudeVoltsPeak: number;
  h2AmplitudeVoltsPeak: number;
  h3AmplitudeVoltsPeak: number;
  h4AmplitudeVoltsPeak: number;
  h5AmplitudeVoltsPeak: number;
  hd2Db: number;
  hd3Db: number;
  hd4Db: number;
  hd5Db: number;
  thdDb: number;
  thdPercent: number;
};

export type DistortionFrequencySweepInput = Omit<
  NonlinearDistortionInput,
  "signal"
> & {
  signal: Omit<NonlinearSignal, "frequencyHz">;
  frequency: FrequencyRange;
};

const minimumDb = -180;

export const defaultNonlinearSignal: NonlinearSignal = {
  amplitudeVolts: 1,
  frequencyHz: 1000,
  dcBiasVolts: 0,
};

export const defaultNonlinearCapacitor: Pick<
  NonlinearCapacitorModel,
  "alphaPerVolt" | "betaPerVoltSquared" | "gammaPerVoltCubed"
> = {
  alphaPerVolt: -0.25,
  betaPerVoltSquared: 0.08,
  gammaPerVoltCubed: 0,
};

export const defaultNonlinearSettings: NonlinearSimulationSettings = {
  fftSize: 4096,
  settleCycles: 24,
  analysisCycles: 8,
};

export function simulateNonlinearDistortion({
  topology,
  resistanceOhms,
  capacitor,
  signal,
  settings,
}: NonlinearDistortionInput): NonlinearDistortionResult {
  validateNonlinearInput(resistanceOhms, capacitor, signal, settings);

  const dt = settings.analysisCycles / (signal.frequencyHz * settings.fftSize);
  const sampleRateHz = 1 / dt;
  const settleSamples = Math.round(
    (settings.settleCycles * settings.fftSize) / settings.analysisCycles,
  );
  const totalSamples = settleSamples + settings.fftSize;
  const outputSamples = new Array<number>(settings.fftSize);
  const timeDomain: TimeDomainPoint[] = [];
  const profile = createCapacitanceProfile(capacitor, signal);

  let capacitorVoltage = signal.dcBiasVolts;
  let charge = voltageToCharge(capacitorVoltage, capacitor);

  for (let sample = 0; sample < totalSamples; sample += 1) {
    const timeSec = sample * dt;
    capacitorVoltage = chargeToVoltage(charge, capacitor, capacitorVoltage);
    const inputVolts = inputAtTime(timeSec, signal);
    const outputVolts =
      topology === "low-pass" ? capacitorVoltage : inputVolts - capacitorVoltage;

    if (sample >= settleSamples) {
      const analysisIndex = sample - settleSamples;
      outputSamples[analysisIndex] = outputVolts;
      timeDomain.push({
        timeMs: (analysisIndex * dt * 1000),
        inputVolts,
        outputVolts,
        capacitorVolts: capacitorVoltage,
      });
    }

    charge = integrateChargeRk4(charge, timeSec, dt, resistanceOhms, capacitor, signal);
  }

  const harmonicSpectrum = calculateSpectrum(outputSamples, sampleRateHz, "rectangular");
  const spectrum = calculateSpectrum(outputSamples, sampleRateHz, "blackman-harris");
  const harmonics = calculateHarmonics(
    harmonicSpectrum,
    signal.frequencyHz,
    settings.analysisCycles,
  );
  const fundamentalAmplitudeVoltsPeak = harmonics[0]?.amplitudeVoltsPeak ?? 0;
  const distortionPower = harmonics
    .slice(1)
    .reduce((sum, harmonic) => sum + harmonic.amplitudeVoltsPeak ** 2, 0);
  const thdRatio =
    fundamentalAmplitudeVoltsPeak > 0
      ? Math.sqrt(distortionPower) / fundamentalAmplitudeVoltsPeak
      : 0;

  return {
    timeDomain: decimateTimeDomain(timeDomain, 1600),
    spectrum: spectrum.filter((point) => point.frequencyHz > 0),
    capacitanceProfile: profile,
    sampleRateHz,
    fundamentalAmplitudeVoltsPeak,
    harmonics,
    thdRatio,
    thdPercent: thdRatio * 100,
    thdDb: ratioToDb(thdRatio),
  };
}

export function sweepNonlinearDistortionByFrequency({
  topology,
  resistanceOhms,
  capacitor,
  signal,
  settings,
  frequency,
}: DistortionFrequencySweepInput): DistortionSweepPoint[] {
  const frequencies = logSpace(
    frequency.startHz,
    frequency.stopHz,
    frequency.points,
  );

  return frequencies.map((frequencyHz) => {
    const result = simulateNonlinearDistortion({
      topology,
      resistanceOhms,
      capacitor,
      signal: {
        ...signal,
        frequencyHz,
      },
      settings,
    });

    return {
      frequencyHz,
      fundamentalAmplitudeVoltsPeak: result.fundamentalAmplitudeVoltsPeak,
      h2AmplitudeVoltsPeak: result.harmonics[1]?.amplitudeVoltsPeak ?? 0,
      h3AmplitudeVoltsPeak: result.harmonics[2]?.amplitudeVoltsPeak ?? 0,
      h4AmplitudeVoltsPeak: result.harmonics[3]?.amplitudeVoltsPeak ?? 0,
      h5AmplitudeVoltsPeak: result.harmonics[4]?.amplitudeVoltsPeak ?? 0,
      hd2Db: result.harmonics[1]?.dbRelativeCarrier ?? minimumDb,
      hd3Db: result.harmonics[2]?.dbRelativeCarrier ?? minimumDb,
      hd4Db: result.harmonics[3]?.dbRelativeCarrier ?? minimumDb,
      hd5Db: result.harmonics[4]?.dbRelativeCarrier ?? minimumDb,
      thdDb: result.thdDb,
      thdPercent: result.thdPercent,
    };
  });
}

export function capacitanceAtVoltage(
  voltage: number,
  capacitor: NonlinearCapacitorModel,
) {
  return (
    capacitor.capacitanceFarads *
    (1 +
      capacitor.alphaPerVolt * voltage +
      capacitor.betaPerVoltSquared * voltage ** 2 +
      capacitor.gammaPerVoltCubed * voltage ** 3)
  );
}

export function voltageToCharge(
  voltage: number,
  capacitor: NonlinearCapacitorModel,
) {
  return (
    capacitor.capacitanceFarads *
    (voltage +
      (capacitor.alphaPerVolt * voltage ** 2) / 2 +
      (capacitor.betaPerVoltSquared * voltage ** 3) / 3 +
      (capacitor.gammaPerVoltCubed * voltage ** 4) / 4)
  );
}

export function chargeToVoltage(
  charge: number,
  capacitor: NonlinearCapacitorModel,
  initialGuessVolts = 0,
) {
  let voltage = initialGuessVolts;

  for (let iteration = 0; iteration < 24; iteration += 1) {
    const residual = voltageToCharge(voltage, capacitor) - charge;
    const derivative = capacitanceAtVoltage(voltage, capacitor);

    if (!Number.isFinite(derivative) || Math.abs(derivative) < capacitor.capacitanceFarads * 1e-9) {
      break;
    }

    const nextVoltage = voltage - residual / derivative;

    if (!Number.isFinite(nextVoltage)) {
      break;
    }

    if (Math.abs(nextVoltage - voltage) < 1e-12) {
      return nextVoltage;
    }

    voltage = nextVoltage;
  }

  return voltage;
}

function integrateChargeRk4(
  charge: number,
  timeSec: number,
  dt: number,
  resistanceOhms: number,
  capacitor: NonlinearCapacitorModel,
  signal: NonlinearSignal,
) {
  const derivative = (nextTimeSec: number, nextCharge: number) => {
    const capacitorVoltage = chargeToVoltage(nextCharge, capacitor);
    return (inputAtTime(nextTimeSec, signal) - capacitorVoltage) / resistanceOhms;
  };

  const k1 = derivative(timeSec, charge);
  const k2 = derivative(timeSec + dt / 2, charge + (dt * k1) / 2);
  const k3 = derivative(timeSec + dt / 2, charge + (dt * k2) / 2);
  const k4 = derivative(timeSec + dt, charge + dt * k3);

  return charge + (dt * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
}

function inputAtTime(timeSec: number, signal: NonlinearSignal) {
  return (
    signal.dcBiasVolts +
    signal.amplitudeVolts * Math.sin(2 * Math.PI * signal.frequencyHz * timeSec)
  );
}

function calculateSpectrum(
  samples: number[],
  sampleRateHz: number,
  windowType: "rectangular" | "blackman-harris",
): SpectrumPoint[] {
  const window =
    windowType === "blackman-harris"
      ? createBlackmanHarrisWindow(samples.length)
      : undefined;
  const windowSum = window
    ? window.reduce((sum, value) => sum + value, 0)
    : samples.length;
  const mean = window
    ? samples.reduce((sum, value, index) => sum + value * window[index], 0) /
      windowSum
    : samples.reduce((sum, value) => sum + value, 0) / samples.length;
  const coherentGain = windowSum / samples.length;
  const preparedSamples = samples.map(
    (value, index) => (value - mean) * (window?.[index] ?? 1),
  );
  const fft = new FFT(samples.length);
  const output = fft.createComplexArray();

  fft.realTransform(output, preparedSamples);
  fft.completeSpectrum(output);

  const nyquistBin = samples.length / 2;
  const spectrum: SpectrumPoint[] = [];

  for (let bin = 0; bin <= nyquistBin; bin += 1) {
    const real = output[bin * 2] ?? 0;
    const imaginary = output[bin * 2 + 1] ?? 0;
    const scale = bin === 0 || bin === nyquistBin ? 1 : 2;
    const amplitudeVoltsPeak =
      (scale * Math.sqrt(real * real + imaginary * imaginary)) /
      (samples.length * coherentGain);

    spectrum.push({
      frequencyHz: (bin * sampleRateHz) / samples.length,
      amplitudeVoltsPeak,
      amplitudeDbv: amplitudeToDbv(amplitudeVoltsPeak),
    });
  }

  return spectrum;
}

function createBlackmanHarrisWindow(length: number) {
  const denominator = Math.max(length - 1, 1);

  return Array.from({ length }, (_, index) => {
    const phase = (2 * Math.PI * index) / denominator;

    return (
      0.35875 -
      0.48829 * Math.cos(phase) +
      0.14128 * Math.cos(2 * phase) -
      0.01168 * Math.cos(3 * phase)
    );
  });
}

function calculateHarmonics(
  spectrum: SpectrumPoint[],
  fundamentalFrequencyHz: number,
  analysisCycles: number,
) {
  const fundamental = spectrum[analysisCycles];
  const fundamentalAmplitude = fundamental?.amplitudeVoltsPeak ?? 0;

  return [1, 2, 3, 4, 5].map((harmonic) => {
    const bin = harmonic * analysisCycles;
    const point = spectrum[bin];
    const amplitudeVoltsPeak = point?.amplitudeVoltsPeak ?? 0;
    const ratio =
      harmonic === 1
        ? 1
        : fundamentalAmplitude > 0
          ? amplitudeVoltsPeak / fundamentalAmplitude
          : 0;

    return {
      harmonic,
      frequencyHz: harmonic * fundamentalFrequencyHz,
      amplitudeVoltsPeak,
      ratio,
      dbRelativeCarrier: harmonic === 1 ? 0 : ratioToDb(ratio),
    };
  });
}

function createCapacitanceProfile(
  capacitor: NonlinearCapacitorModel,
  signal: NonlinearSignal,
) {
  const span = Math.max(1, Math.abs(signal.amplitudeVolts) * 1.6);
  const start = signal.dcBiasVolts - span;
  const stop = signal.dcBiasVolts + span;
  const points = 240;

  return Array.from({ length: points }, (_, index) => {
    const voltage = start + ((stop - start) * index) / (points - 1);
    const capacitance = capacitanceAtVoltage(voltage, capacitor);
    const capacitanceRatio = capacitance / capacitor.capacitanceFarads;

    return {
      voltage,
      capacitanceRatio,
      capacitancePercent: capacitanceRatio * 100,
    };
  });
}

function decimateTimeDomain(points: TimeDomainPoint[], maxPoints: number) {
  if (points.length <= maxPoints) {
    return points;
  }

  const stride = Math.ceil(points.length / maxPoints);

  return points.filter((_, index) => index % stride === 0);
}

function validateNonlinearInput(
  resistanceOhms: number,
  capacitor: NonlinearCapacitorModel,
  signal: NonlinearSignal,
  settings: NonlinearSimulationSettings,
) {
  assertPositive("resistanceOhms", resistanceOhms);
  assertPositive("capacitanceFarads", capacitor.capacitanceFarads);
  assertPositive("frequencyHz", signal.frequencyHz);

  if (!Number.isFinite(signal.amplitudeVolts) || signal.amplitudeVolts < 0) {
    throw new Error("signal.amplitudeVolts must be a non-negative finite number.");
  }

  if (!Number.isFinite(signal.dcBiasVolts)) {
    throw new Error("signal.dcBiasVolts must be finite.");
  }

  if (!isPowerOfTwo(settings.fftSize) || settings.fftSize < 1024) {
    throw new Error("settings.fftSize must be a power of two and at least 1024.");
  }

  if (!Number.isInteger(settings.analysisCycles) || settings.analysisCycles < 1) {
    throw new Error("settings.analysisCycles must be a positive integer.");
  }

  if (!Number.isInteger(settings.settleCycles) || settings.settleCycles < 0) {
    throw new Error("settings.settleCycles must be a non-negative integer.");
  }

  if (settings.fftSize % settings.analysisCycles !== 0) {
    throw new Error("settings.analysisCycles must divide settings.fftSize.");
  }

  if (5 * settings.analysisCycles >= settings.fftSize / 2) {
    throw new Error("settings.fftSize is too small for HD5 at this analysis length.");
  }

  const profile = createCapacitanceProfile(capacitor, signal);
  const hasInvalidCapacitance = profile.some(
    (point) => !Number.isFinite(point.capacitanceRatio) || point.capacitanceRatio <= 0,
  );

  if (hasInvalidCapacitance) {
    throw new Error("C(V) becomes non-positive in the simulated voltage range.");
  }
}

function assertPositive(name: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive finite number.`);
  }
}

function isPowerOfTwo(value: number) {
  return Number.isInteger(value) && value > 0 && (value & (value - 1)) === 0;
}

function amplitudeToDbv(amplitude: number) {
  return 20 * Math.log10(Math.max(amplitude, 10 ** (minimumDb / 20)));
}

function ratioToDb(ratio: number) {
  return 20 * Math.log10(Math.max(ratio, 10 ** (minimumDb / 20)));
}
