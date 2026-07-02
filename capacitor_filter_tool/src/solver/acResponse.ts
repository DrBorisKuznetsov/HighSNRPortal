export type RcTopology = "low-pass" | "high-pass" | "low-pass-2nd";

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
  resistanceOhms2?: number;
  capacitanceFarads2?: number;
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
  topology?: RcTopology,
  resistanceOhms2?: number,
  capacitanceFarads2?: number,
) {
  assertPositive("resistanceOhms", resistanceOhms);
  assertPositive("capacitanceFarads", capacitanceFarads);
  
  if (topology === "low-pass-2nd") {
    const r2 = resistanceOhms2 ?? resistanceOhms;
    const c2 = capacitanceFarads2 ?? capacitanceFarads;

    assertPositive("resistanceOhms2", r2);
    assertPositive("capacitanceFarads2", c2);

    return solveLowPass2ndCutoffFrequency(
      resistanceOhms,
      capacitanceFarads,
      r2,
      c2,
    );
  }

  return 1 / (2 * Math.PI * resistanceOhms * capacitanceFarads);
}

export function calculateFrequencyResponse({
  topology,
  resistanceOhms,
  capacitanceFarads,
  resistanceOhms2,
  capacitanceFarads2,
  frequency,
}: FrequencyResponseInput): FrequencyResponsePoint[] {
  assertPositive("resistanceOhms", resistanceOhms);
  assertPositive("capacitanceFarads", capacitanceFarads);
  assertFrequencyRange(frequency);

  const frequencies = logSpace(frequency.startHz, frequency.stopHz, frequency.points);

  if (topology === "low-pass-2nd") {
    const R1 = resistanceOhms;
    const C1 = capacitanceFarads;
    const R2 = resistanceOhms2 || R1;
    const C2 = capacitanceFarads2 || C1;
    
    return frequencies.map((frequencyHz) =>
      calculateLowPass2ndPoint(frequencyHz, R1, C1, R2, C2),
    );
  }

  // 1st order behavior
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

function calculateLowPass2ndPoint(
  frequencyHz: number,
  resistanceOhms: number,
  capacitanceFarads: number,
  resistanceOhms2: number,
  capacitanceFarads2: number,
): FrequencyResponsePoint {
  const omega = 2 * Math.PI * frequencyHz;
  const real =
    1 -
    omega ** 2 *
      resistanceOhms *
      capacitanceFarads *
      resistanceOhms2 *
      capacitanceFarads2;
  const imaginary =
    omega *
    (resistanceOhms * capacitanceFarads +
      resistanceOhms * capacitanceFarads2 +
      resistanceOhms2 * capacitanceFarads2);
  const magnitudeLinear = 1 / Math.sqrt(real * real + imaginary * imaginary);
  const phaseRad = Math.atan2(-imaginary, real);

  return {
    frequencyHz,
    magnitudeLinear,
    magnitudeDb: 20 * Math.log10(magnitudeLinear),
    phaseDeg: (phaseRad * 180) / Math.PI,
  };
}

function solveLowPass2ndCutoffFrequency(
  resistanceOhms: number,
  capacitanceFarads: number,
  resistanceOhms2: number,
  capacitanceFarads2: number,
) {
  const targetMagnitude = 1 / Math.SQRT2;
  const naturalFrequency =
    1 /
    (2 *
      Math.PI *
      Math.sqrt(
        resistanceOhms *
          capacitanceFarads *
          resistanceOhms2 *
          capacitanceFarads2,
      ));
  let low = naturalFrequency * 1e-9;
  let high = naturalFrequency;

  while (
    calculateLowPass2ndPoint(
      high,
      resistanceOhms,
      capacitanceFarads,
      resistanceOhms2,
      capacitanceFarads2,
    ).magnitudeLinear > targetMagnitude
  ) {
    high *= 2;
  }

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const mid = (low + high) / 2;
    const magnitude = calculateLowPass2ndPoint(
      mid,
      resistanceOhms,
      capacitanceFarads,
      resistanceOhms2,
      capacitanceFarads2,
    ).magnitudeLinear;

    if (magnitude > targetMagnitude) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
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
