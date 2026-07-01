export type RcTopology = "low-pass" | "high-pass";

export type FrequencyRange = {
  startHz: number;
  stopHz: number;
  points: number;
};

export type FrequencyResponsePoint = {
  frequencyHz: number;
  magnitudeLinear: number;
  magnitudeDb: number;
  phaseDeg: number;
};

export type FrequencyResponseInput = {
  topology: RcTopology;
  resistanceOhms: number;
  capacitanceFarads: number;
  frequency: FrequencyRange;
};

export const defaultFrequencyRange: FrequencyRange = {
  startHz: 10,
  stopHz: 1_000_000,
  points: 500,
};

export function calculateCutoffFrequency(
  resistanceOhms: number,
  capacitanceFarads: number,
) {
  assertPositive("resistanceOhms", resistanceOhms);
  assertPositive("capacitanceFarads", capacitanceFarads);

  return 1 / (2 * Math.PI * resistanceOhms * capacitanceFarads);
}

export function calculateFrequencyResponse({
  topology,
  resistanceOhms,
  capacitanceFarads,
  frequency,
}: FrequencyResponseInput): FrequencyResponsePoint[] {
  assertPositive("resistanceOhms", resistanceOhms);
  assertPositive("capacitanceFarads", capacitanceFarads);
  assertFrequencyRange(frequency);

  const frequencies = logSpace(frequency.startHz, frequency.stopHz, frequency.points);
  const tau = resistanceOhms * capacitanceFarads;

  return frequencies.map((frequencyHz) => {
    const omegaTau = 2 * Math.PI * frequencyHz * tau;
    const denominatorMagnitude = Math.sqrt(1 + omegaTau * omegaTau);
    const magnitudeLinear =
      topology === "low-pass" ? 1 / denominatorMagnitude : omegaTau / denominatorMagnitude;
    const phaseRad =
      topology === "low-pass" ? -Math.atan(omegaTau) : Math.PI / 2 - Math.atan(omegaTau);

    return {
      frequencyHz,
      magnitudeLinear,
      magnitudeDb: 20 * Math.log10(magnitudeLinear),
      phaseDeg: (phaseRad * 180) / Math.PI,
    };
  });
}

export function logSpace(start: number, stop: number, points: number) {
  assertPositive("start", start);
  assertPositive("stop", stop);

  if (stop <= start) {
    throw new Error("stop must be greater than start.");
  }

  if (!Number.isInteger(points) || points < 2) {
    throw new Error("points must be an integer greater than 1.");
  }

  const startLog = Math.log10(start);
  const stopLog = Math.log10(stop);
  const step = (stopLog - startLog) / (points - 1);

  return Array.from({ length: points }, (_, index) => 10 ** (startLog + step * index));
}

function assertFrequencyRange(frequency: FrequencyRange) {
  assertPositive("frequency.startHz", frequency.startHz);
  assertPositive("frequency.stopHz", frequency.stopHz);

  if (frequency.stopHz <= frequency.startHz) {
    throw new Error("frequency.stopHz must be greater than frequency.startHz.");
  }

  if (!Number.isInteger(frequency.points) || frequency.points < 2) {
    throw new Error("frequency.points must be an integer greater than 1.");
  }
}

function assertPositive(name: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive finite number.`);
  }
}
