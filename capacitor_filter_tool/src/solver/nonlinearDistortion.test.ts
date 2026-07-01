import { describe, expect, it } from "vitest";
import { calculateFrequencyResponse } from "./acResponse";
import {
  chargeToVoltage,
  simulateNonlinearDistortion,
  sweepNonlinearDistortionByFrequency,
  voltageToCharge,
  type NonlinearCapacitorModel,
} from "./nonlinearDistortion";

const linearCapacitor: NonlinearCapacitorModel = {
  capacitanceFarads: 100e-9,
  alphaPerVolt: 0,
  betaPerVoltSquared: 0,
  gammaPerVoltCubed: 0,
};

describe("nonlinear distortion solver", () => {
  it("inverts the charge-conserving capacitor model", () => {
    const capacitor: NonlinearCapacitorModel = {
      capacitanceFarads: 100e-9,
      alphaPerVolt: -0.2,
      betaPerVoltSquared: 0.06,
      gammaPerVoltCubed: 0.01,
    };
    const voltage = 0.85;
    const charge = voltageToCharge(voltage, capacitor);

    expect(chargeToVoltage(charge, capacitor, voltage)).toBeCloseTo(voltage, 10);
  });

  it("matches ideal RC low-pass amplitude when C(V) is linear", () => {
    const result = simulateNonlinearDistortion({
      topology: "low-pass",
      resistanceOhms: 1000,
      capacitor: linearCapacitor,
      signal: {
        amplitudeVolts: 1,
        frequencyHz: 1000,
        dcBiasVolts: 0,
      },
      settings: {
        fftSize: 4096,
        settleCycles: 32,
        analysisCycles: 8,
      },
    });
    const [linearPoint] = calculateFrequencyResponse({
      topology: "low-pass",
      resistanceOhms: 1000,
      capacitanceFarads: 100e-9,
      frequency: {
        startHz: 1000,
        stopHz: 1000.001,
        points: 2,
      },
    });

    expect(result.fundamentalAmplitudeVoltsPeak).toBeCloseTo(
      linearPoint.magnitudeLinear,
      3,
    );
    expect(result.harmonics[1].dbRelativeCarrier).toBeLessThan(-90);
    expect(result.thdDb).toBeLessThan(-90);
  });

  it("produces second harmonic distortion when alpha is non-zero", () => {
    const result = simulateNonlinearDistortion({
      topology: "low-pass",
      resistanceOhms: 1000,
      capacitor: {
        ...linearCapacitor,
        alphaPerVolt: -0.35,
      },
      signal: {
        amplitudeVolts: 1.5,
        frequencyHz: 1000,
        dcBiasVolts: 0,
      },
      settings: {
        fftSize: 4096,
        settleCycles: 32,
        analysisCycles: 8,
      },
    });

    expect(result.harmonics[1].dbRelativeCarrier).toBeGreaterThan(-80);
    expect(result.thdPercent).toBeGreaterThan(0.001);
  });

  it("returns harmonic amplitudes for frequency sweep plots", () => {
    const sweep = sweepNonlinearDistortionByFrequency({
      topology: "low-pass",
      resistanceOhms: 1000,
      capacitor: {
        ...linearCapacitor,
        alphaPerVolt: -0.35,
      },
      signal: {
        amplitudeVolts: 1.5,
        dcBiasVolts: 0,
      },
      settings: {
        fftSize: 2048,
        settleCycles: 16,
        analysisCycles: 8,
      },
      frequency: {
        startHz: 500,
        stopHz: 2000,
        points: 4,
      },
    });

    expect(sweep).toHaveLength(4);
    expect(sweep[0].h2AmplitudeVoltsPeak).toBeGreaterThan(0);
    expect(sweep[0].h3AmplitudeVoltsPeak).toBeGreaterThanOrEqual(0);
    expect(sweep[0].h4AmplitudeVoltsPeak).toBeGreaterThanOrEqual(0);
    expect(sweep[0].h5AmplitudeVoltsPeak).toBeGreaterThanOrEqual(0);
  });
});
