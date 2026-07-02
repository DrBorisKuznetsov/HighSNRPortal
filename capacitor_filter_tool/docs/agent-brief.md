# Agent Brief

This document is for future agents working inside `capacitor_filter_tool`.

## Mission

Build a standalone HighSNR Engineering Tool for analyzing passive filters with real, non-ideal, and nonlinear capacitors.

The tool should connect directly to the capacitor research line:

- MLCC voltage-dependent capacitance;
- charge-conserving capacitor models;
- harmonic distortion in RC filters;
- practical signal-chain errors.

## Read First

1. `docs/source/technical-spec-source.pdf`
2. `docs/technical-spec.md`
3. `docs/architecture.md`
4. `docs/mathematics.md`
5. `docs/portal-integration.md`
6. `public/tool-manifest.json`

## Important Product Decisions

- The app is standalone.
- The portal is only the launcher and explanation surface.
- Recommended subdomain is `filters.highsnr.org`.
- Local dev port should be `5175` unless there is a conflict.
- The MVP starts with topology presets, not a custom nodal editor.
- Charge-conserving capacitor modeling is not optional for nonlinear mode.
- The currently connected solver topologies are `RC Low-pass`, `RC High-pass`, and loaded `RC 2-Stage Low-pass`.
- Catalog entries without a connected `solverTopology` are schematic/planning entries and must not imply validated numeric analysis.
- The loaded two-stage RC model uses independent `R1/C1` and `R2/C2`; its cutoff is solved numerically from the `-3 dB` condition.

## Suggested First Implementation Task

Completed baseline implementation:

- topology selector;
- RC low-pass/high-pass ideal AC response;
- loaded RC 2-stage low-pass response;
- magnitude, phase, nonlinear distortion and harmonic sweep plots;
- compact parameter panel;
- charge-conserving nonlinear capacitor model;
- validation tests for first-order and two-stage RC behavior.

Next implementation task: add one new topology at a time with a transfer-function derivation, UI parameters, and at least one validation fixture.

## Guardrails

- Do not put the full tool into `portal`.
- Do not create a deep project graph or new top-level portal section.
- Do not hand-roll FFT if a reliable library is available.
- Do not add paid/report features before validation exists.
- Do not use naive `i = C(V) * dV/dt` as the primary nonlinear capacitor model when charge conservation is required.

## Documentation Rule

Every meaningful design or model decision should be recorded in this directory first. If the decision affects the whole HighSNR workspace, also update the root `wiki`.
