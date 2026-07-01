# Technical Specification Summary

Source document:

```text
docs/source/technical-spec-source.pdf
```

Original title:

```text
Техническое задание.
Веб-инструмент анализа влияния нелинейности конденсаторов
на искажения пассивных фильтров
```

This file is a working summary for developers and agents. The PDF remains the source document.

## Purpose

Create a web tool for analyzing passive filters that use real capacitors. The tool must help an engineer compare ideal linear behavior, non-ideal passive behavior, and nonlinear capacitor-driven distortion.

The practical goal is to connect capacitor physics with circuit-level consequences:

- cutoff frequency shift;
- gain and attenuation changes;
- phase response;
- resonance and Q;
- harmonic distortion;
- THD and optional THD+N;
- intermodulation distortion for multi-tone cases;
- sensitivity to input amplitude, frequency, and DC bias.

## Target Users

- Hardware engineers designing signal-chain filters.
- Engineers using X7R, X5R, or other Class II MLCC capacitors in precision paths.
- Researchers validating charge-conserving capacitor models.
- Students or readers of HighSNR capacitor publications who need an interactive companion tool.

## Analysis Modes

### 1. Linear AC Analysis

Ideal components only. The tool calculates classic small-signal frequency response:

- Bode magnitude and phase;
- cutoff frequencies;
- resonance frequency;
- Q factor;
- passband gain;
- stopband attenuation.

### 2. Linear Non-Ideal Analysis

Adds non-ideal but still linear component effects:

- capacitor ESR;
- capacitor ESL;
- leakage resistance;
- source and load resistance;
- inductor parasitics;
- component tolerances.

The user should be able to compare ideal and non-ideal responses on the same plot.

### 3. Nonlinear Distortion Analysis

Adds voltage-dependent capacitance:

```text
C(V) = C0 * (1 + alpha*V + beta*V^2 + gamma*V^3)
```

The preferred model is charge-conserving:

```text
q(V) = integral C(V) dV
i(t) = dq/dt
```

This avoids common simulation artifacts caused by treating a voltage-dependent capacitance as a simple time-varying linear capacitor.

Expected outputs:

- time-domain response;
- output spectrum;
- harmonic amplitudes;
- HD2, HD3, HD4, HD5;
- THD;
- optional THD+N;
- optional IMD for two-tone input;
- sweeps versus amplitude, frequency, and DC bias;
- capacitor type comparison.

## MVP Topologies

The first working version should support:

- RC low-pass;
- RC high-pass;
- RC band-pass as cascaded high-pass and low-pass stages;
- RC band-stop / notch, including Twin-T if practical;
- RLC band-pass;
- RLC band-stop / notch.

The UI should start with topology presets rather than a fully custom schematic editor.

## Later Topologies

After the MVP:

- LC low-pass;
- LC high-pass;
- LC ladder filters;
- pi and T filters;
- multi-stage RC networks;
- custom nodal editor.

The custom editor should be deferred until the solver and presets are reliable.

## Component Model

### Resistor

- Resistance value.
- Optional tolerance.
- Optional temperature coefficient later.

### Capacitor

Must support:

- ideal capacitance;
- ESR;
- ESL;
- leakage;
- nonlinear polynomial model;
- tabular measured or vendor-derived model.

Recommended CSV format:

```csv
Voltage,Capacitance
-5,6.2e-6
0,10e-6
5,6.0e-6
```

### Inductor

Must support:

- inductance;
- series resistance;
- optional parasitic capacitance later.

## Interface Requirements

The interface should be an engineering workbench, not a marketing page:

- topology selector;
- compact parameter panel;
- analysis mode selector;
- plots for magnitude, phase, time response, and spectrum;
- table of key metrics;
- comparison mode for ideal, non-ideal, and nonlinear behavior;
- exportable results later.

## Non-Goals For MVP

- No deep portal navigation tree.
- No full SPICE clone.
- No custom schematic editor in the first version.
- No paid reporting flow until the numerical core is trusted.
- No backend dependency unless browser-side computation becomes clearly insufficient.

## Open Questions

- Which product name should be public: "Passive Filter Distortion Analyzer" or a shorter name?
- Which plotting library best fits the portal style: ECharts or Plotly?
- Should reference validation be written in Python before porting to TypeScript?
- What is the minimum capacitor library for the first public version?
