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
4. `docs/portal-integration.md`
5. `public/tool-manifest.json`

## Important Product Decisions

- The app is standalone.
- The portal is only the launcher and explanation surface.
- Recommended subdomain is `filters.highsnr.org`.
- Local dev port should be `5175` unless there is a conflict.
- The MVP starts with topology presets, not a custom nodal editor.
- Charge-conserving capacitor modeling is not optional for nonlinear mode.

## Suggested First Implementation Task

Create a minimal Vite + React + TypeScript app with:

- topology selector;
- RC low-pass ideal AC response;
- magnitude and phase plots;
- compact parameter panel;
- placeholder tabs for non-ideal and nonlinear modes;
- a small validation test for RC cutoff frequency.

Do not start with every topology at once. Prove the architecture on one topology, then expand.

## Guardrails

- Do not put the full tool into `portal`.
- Do not create a deep project graph or new top-level portal section.
- Do not hand-roll FFT if a reliable library is available.
- Do not add paid/report features before validation exists.
- Do not use naive `i = C(V) * dV/dt` as the primary nonlinear capacitor model when charge conservation is required.

## Documentation Rule

Every meaningful design or model decision should be recorded in this directory first. If the decision affects the whole HighSNR workspace, also update the root `wiki`.
