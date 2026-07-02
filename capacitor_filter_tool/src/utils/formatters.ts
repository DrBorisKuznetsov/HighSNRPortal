import { type AnalysisMode } from "../app/App";

export function isPowerOfTwo(value: number) {
  return Number.isInteger(value) && value > 0 && (value & (value - 1)) === 0;
}

export function formatVoltsPeak(value: number) {
  return `${formatNumber(value)} Vpk`;
}

export function formatVolts(value: number) {
  return `${formatNumber(value)} V`;
}

export function formatDbc(value: number) {
  return `${formatNumber(value)} dBc`;
}

export function formatPercent(value: number) {
  return `${formatNumber(value)} %`;
}

export function formatNumber(value: number) {
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

export function formatCompactUnit(value: string) {
  return value.replace(/\s+/g, "");
}

export function positiveAmplitude(amplitude: number) {
  if (!Number.isFinite(amplitude) || amplitude <= 0) {
    return 1e-15;
  }

  return amplitude;
}
