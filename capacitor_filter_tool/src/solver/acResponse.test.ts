import { describe, expect, it } from "vitest";
import {
  calculateCutoffFrequency,
  calculateFrequencyResponse,
  logSpace,
} from "./acResponse";

describe("RC ideal AC response", () => {
  it("calculates the analytical cutoff frequency", () => {
    const cutoffFrequency = calculateCutoffFrequency(1000, 100e-9);

    expect(cutoffFrequency).toBeCloseTo(1591.5494309189535, 9);
  });

  it("returns -3.0103 dB at cutoff for a low-pass filter", () => {
    const cutoffFrequency = calculateCutoffFrequency(1000, 100e-9);
    const [point] = calculateFrequencyResponse({
      topology: "low-pass",
      resistanceOhms: 1000,
      capacitanceFarads: 100e-9,
      frequency: {
        startHz: cutoffFrequency,
        stopHz: cutoffFrequency * 1.000001,
        points: 2,
      },
    });

    expect(point.magnitudeDb).toBeCloseTo(-3.0102999566, 9);
    expect(point.phaseDeg).toBeCloseTo(-45, 9);
  });

  it("returns -3.0103 dB at cutoff for a high-pass filter", () => {
    const cutoffFrequency = calculateCutoffFrequency(1000, 100e-9);
    const [point] = calculateFrequencyResponse({
      topology: "high-pass",
      resistanceOhms: 1000,
      capacitanceFarads: 100e-9,
      frequency: {
        startHz: cutoffFrequency,
        stopHz: cutoffFrequency * 1.000001,
        points: 2,
      },
    });

    expect(point.magnitudeDb).toBeCloseTo(-3.0102999566, 9);
    expect(point.phaseDeg).toBeCloseTo(45, 9);
  });

  it("creates a logarithmic sweep with fixed endpoints", () => {
    const values = logSpace(10, 1000, 3);

    expect(values[0]).toBeCloseTo(10, 12);
    expect(values[1]).toBeCloseTo(100, 12);
    expect(values[2]).toBeCloseTo(1000, 12);
  });
});
