# Roadmap

## Phase 0 - Project Preparation

Status: complete.

- Create `capacitor_filter_tool` directory.
- Copy source PDF specification.
- Create specification summary.
- Create architecture notes.
- Create portal integration contract.
- Create agent brief.

## Phase 1 - Minimal Working Tool

Goal: first usable browser workbench.

Status: started. Ideal unloaded RC low-pass/high-pass AC response, magnitude/phase plots, cutoff metric, CSV export, and baseline validation tests are implemented.

- Scaffold Vite + React + TypeScript.
- Implement RC low-pass and RC high-pass ideal AC response.
- Add magnitude and phase plots.
- Add cutoff frequency metric.
- Add validation tests for ideal RC equations.
- Add portal-compatible launch metadata.

## Phase 2 - Linear Non-Ideal Model

Goal: compare ideal and realistic passive behavior.

- Add ESR, ESL, leakage, source resistance, load resistance.
- Add tolerance sweeps.
- Add ideal vs non-ideal overlay.
- Add metric table.

## Phase 3 - Nonlinear Capacitor Model

Goal: connect capacitor nonlinearity to distortion.

Status: started. A charge-conserving RC nonlinear simulation, FFT spectrum, HD2-HD5, THD metrics, time-domain plot, and capacitance profile plot are implemented for the preset RC topologies.

- Add polynomial C(V) model.
- Use charge-conserving q(V) formulation.
- Add time-domain simulation for RC low-pass.
- Add spectrum and HD2-HD5/THD metrics.
- Validate against analytical small-nonlinearity cases.

## Phase 4 - Topology Expansion

Goal: cover the MVP topology list.

- RC band-pass.
- RC band-stop / notch.
- RLC band-pass.
- RLC band-stop / notch.
- Topology-specific validation fixtures.

## Phase 5 - Data And Publication Links

Goal: make the tool useful for real engineering cases.

- Add capacitor preset library.
- Add CSV import for measured/vendor capacitance curves.
- Add example cases linked to HighSNR publications.
- Add exportable result snapshots.

## Later

- LC ladder filters.
- Pi and T filters.
- Multi-stage RC networks.
- Custom nodal editor.
- PDF report generation.
