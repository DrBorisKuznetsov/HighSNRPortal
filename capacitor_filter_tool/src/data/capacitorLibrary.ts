export type CapacitorModelKind = "C0G" | "X7R" | "X5R" | "PRESET_FIT" | "CUSTOM";

export type CapacitorPreset = {
  id: string;
  name: string;
  cNomFarads: number;
  ratedVoltage: number;
  model: CapacitorModelKind;
  manufacturer: string;
  size: string;
  dielectric: string;
  v50: number | null;
  exponent: number | null;
};

export type CapacitorPolynomial = {
  alphaPerVolt: number;
  betaPerVoltSquared: number;
  gammaPerVoltCubed: number;
};

export const capacitorPresets = {
  custom: {
    id: "custom",
    name: "Custom editable model",
    cNomFarads: 100e-9,
    ratedVoltage: 25,
    model: "CUSTOM",
    manufacturer: "User",
    size: "-",
    dielectric: "Custom",
    v50: null,
    exponent: null,
  },
  generic_c0g: {
    id: "generic_c0g",
    name: "Generic C0G (Linear)",
    cNomFarads: 10e-9,
    ratedVoltage: 5,
    model: "C0G",
    manufacturer: "Generic",
    size: "0805",
    dielectric: "C0G",
    v50: null,
    exponent: null,
  },
  generic_x7r: {
    id: "generic_x7r",
    name: "Generic X7R (Moderate Bias)",
    cNomFarads: 10e-9,
    ratedVoltage: 5,
    model: "X7R",
    manufacturer: "Generic",
    size: "0805",
    dielectric: "X7R",
    v50: null,
    exponent: null,
  },
  generic_x5r: {
    id: "generic_x5r",
    name: "Generic X5R (Strong Bias)",
    cNomFarads: 10e-9,
    ratedVoltage: 5,
    model: "X5R",
    manufacturer: "Generic",
    size: "0805",
    dielectric: "X5R",
    v50: null,
    exponent: null,
  },
  murata_grm033_1u_6v3: {
    id: "murata_grm033_1u_6v3",
    name: "Murata GRM033 (1uF, 6.3V, X5R)",
    cNomFarads: 1e-6,
    ratedVoltage: 6.3,
    model: "PRESET_FIT",
    manufacturer: "Murata",
    size: "0201",
    dielectric: "X5R",
    v50: 1.8,
    exponent: 1.5,
  },
  murata_grm21b_10u_25v: {
    id: "murata_grm21b_10u_25v",
    name: "Murata GRM21B (10uF, 25V, X7R)",
    cNomFarads: 10e-6,
    ratedVoltage: 25,
    model: "PRESET_FIT",
    manufacturer: "Murata",
    size: "0805",
    dielectric: "X7R",
    v50: 9.5,
    exponent: 1.4,
  },
  murata_grm31c_10u_100v: {
    id: "murata_grm31c_10u_100v",
    name: "Murata GRM31C (10uF, 100V, X7S)",
    cNomFarads: 10e-6,
    ratedVoltage: 100,
    model: "PRESET_FIT",
    manufacturer: "Murata",
    size: "1206",
    dielectric: "X7S",
    v50: 45,
    exponent: 1.4,
  },
  tdk_c1608_1u_25v: {
    id: "tdk_c1608_1u_25v",
    name: "TDK C1608 (1uF, 25V, X7R)",
    cNomFarads: 1e-6,
    ratedVoltage: 25,
    model: "PRESET_FIT",
    manufacturer: "TDK",
    size: "0603",
    dielectric: "X7R",
    v50: 12.5,
    exponent: 1.3,
  },
  tdk_c2012_1u_50v: {
    id: "tdk_c2012_1u_50v",
    name: "TDK C2012 (1uF, 50V, X7R)",
    cNomFarads: 1e-6,
    ratedVoltage: 50,
    model: "PRESET_FIT",
    manufacturer: "TDK",
    size: "0805",
    dielectric: "X7R",
    v50: 28,
    exponent: 1.2,
  },
  samsung_cl21b_10u_25v: {
    id: "samsung_cl21b_10u_25v",
    name: "Samsung CL21B (10uF, 25V, X7R)",
    cNomFarads: 10e-6,
    ratedVoltage: 25,
    model: "PRESET_FIT",
    manufacturer: "Samsung",
    size: "0805",
    dielectric: "X7R",
    v50: 12,
    exponent: 1.5,
  },
  kemet_c0402_100n_25v: {
    id: "kemet_c0402_100n_25v",
    name: "Kemet C0402 (100nF, 25V, X7R)",
    cNomFarads: 100e-9,
    ratedVoltage: 25,
    model: "PRESET_FIT",
    manufacturer: "Kemet",
    size: "0402",
    dielectric: "X7R",
    v50: 15,
    exponent: 1.2,
  },
  kemet_c0603_1u_16v: {
    id: "kemet_c0603_1u_16v",
    name: "Kemet C0603 (1uF, 16V, X7R)",
    cNomFarads: 1e-6,
    ratedVoltage: 16,
    model: "PRESET_FIT",
    manufacturer: "Kemet",
    size: "0603",
    dielectric: "X7R",
    v50: 7,
    exponent: 1.3,
  },
  taiyo_emk105_2u2_16v: {
    id: "taiyo_emk105_2u2_16v",
    name: "Taiyo Yuden EMK105 (2.2uF, 16V, X5R)",
    cNomFarads: 2.2e-6,
    ratedVoltage: 16,
    model: "PRESET_FIT",
    manufacturer: "Taiyo Yuden",
    size: "0402",
    dielectric: "X5R",
    v50: 4.8,
    exponent: 1.5,
  },
  avx_0805_10u_25v: {
    id: "avx_0805_10u_25v",
    name: "Kyocera AVX 0805 (10uF, 25V, X7R)",
    cNomFarads: 10e-6,
    ratedVoltage: 25,
    model: "PRESET_FIT",
    manufacturer: "Kyocera AVX",
    size: "0805",
    dielectric: "X7R",
    v50: 11.5,
    exponent: 1.4,
  },
} satisfies Record<string, CapacitorPreset>;

export type CapacitorPresetId = keyof typeof capacitorPresets;

export const defaultCapacitorPresetId: CapacitorPresetId = "kemet_c0402_100n_25v";

export const capacitorPresetGroups: Array<{
  label: string;
  presetIds: CapacitorPresetId[];
}> = [
  { label: "Custom", presetIds: ["custom"] },
  { label: "Generic Models", presetIds: ["generic_c0g", "generic_x7r", "generic_x5r"] },
  {
    label: "Murata MLCC",
    presetIds: ["murata_grm033_1u_6v3", "murata_grm21b_10u_25v", "murata_grm31c_10u_100v"],
  },
  { label: "TDK MLCC", presetIds: ["tdk_c1608_1u_25v", "tdk_c2012_1u_50v"] },
  { label: "Samsung MLCC", presetIds: ["samsung_cl21b_10u_25v"] },
  { label: "Kemet MLCC", presetIds: ["kemet_c0402_100n_25v", "kemet_c0603_1u_16v"] },
  { label: "Taiyo Yuden MLCC", presetIds: ["taiyo_emk105_2u2_16v"] },
  { label: "Kyocera AVX MLCC", presetIds: ["avx_0805_10u_25v"] },
];

export function getCapacitorPreset(id: CapacitorPresetId) {
  return capacitorPresets[id];
}

export function estimatePolynomialCoefficients(
  preset: CapacitorPreset,
): CapacitorPolynomial {
  if (preset.model === "C0G") {
    return { alphaPerVolt: 0, betaPerVoltSquared: 0, gammaPerVoltCubed: 0 };
  }

  if (preset.model === "CUSTOM") {
    return { alphaPerVolt: -0.25, betaPerVoltSquared: 0.08, gammaPerVoltCubed: 0 };
  }

  const biasStrength =
    preset.model === "PRESET_FIT" && preset.v50
      ? Math.min(1.8, Math.max(0.25, preset.ratedVoltage / (preset.v50 * 2)))
      : preset.model === "X5R"
        ? 1.25
        : 0.85;

  return {
    alphaPerVolt: -0.18 * biasStrength,
    betaPerVoltSquared: 0.055 * biasStrength,
    gammaPerVoltCubed: -0.004 * biasStrength,
  };
}

export function capacitanceAtBias(
  preset: CapacitorPreset,
  voltage: number,
  cNomFarads = preset.cNomFarads,
) {
  if (preset.model === "C0G" || preset.model === "CUSTOM") {
    return cNomFarads;
  }

  if (preset.model === "PRESET_FIT") {
    const v50 = preset.v50 ?? preset.ratedVoltage;
    const exponent = preset.exponent ?? 1.4;
    return cNomFarads / (1 + (Math.abs(voltage) / v50) ** exponent);
  }

  if (preset.model === "X5R") {
    return cNomFarads / (1 + (Math.abs(voltage) / (preset.ratedVoltage * 0.5)) ** 1.5);
  }

  return cNomFarads / (1 + (Math.abs(voltage) / preset.ratedVoltage) ** 1.4);
}

export function buildCapacitanceCurve(
  preset: CapacitorPreset,
  cNomFarads: number,
  voltageSpan: number,
  points = 180,
) {
  const span = Math.max(1, voltageSpan);

  return Array.from({ length: points }, (_, index) => {
    const voltage = -span + (2 * span * index) / (points - 1);
    const capacitance = capacitanceAtBias(preset, voltage, cNomFarads);

    return {
      voltage,
      capacitance,
      capacitancePercent: (capacitance / cNomFarads) * 100,
    };
  });
}
