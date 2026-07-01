const prefixes = [
  { factor: 1e-12, symbol: "p" },
  { factor: 1e-9, symbol: "n" },
  { factor: 1e-6, symbol: "u" },
  { factor: 1e-3, symbol: "m" },
  { factor: 1, symbol: "" },
  { factor: 1e3, symbol: "k" },
  { factor: 1e6, symbol: "M" },
  { factor: 1e9, symbol: "G" },
];

export function formatEngineering(value: number, unit: string) {
  const absolute = Math.abs(value);
  const prefix =
    [...prefixes].reverse().find((candidate) => absolute >= candidate.factor) ??
    prefixes[0];
  const scaled = value / prefix.factor;

  return `${formatNumber(scaled)} ${prefix.symbol}${unit}`;
}

export function formatHz(value: number) {
  return formatEngineering(value, "Hz");
}

export function formatDb(value: number) {
  return `${formatNumber(value)} dB`;
}

export function formatPhase(value: number) {
  return `${formatNumber(value)} deg`;
}

function formatNumber(value: number) {
  if (Math.abs(value) >= 100) {
    return value.toFixed(0);
  }

  if (Math.abs(value) >= 10) {
    return value.toFixed(1);
  }

  return value.toFixed(2);
}
