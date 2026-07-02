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

Status: substantially complete. Ideal RC low-pass/high-pass AC response, loaded RC 2-stage low-pass response, magnitude/phase plots, cutoff metric, CSV export, modular UI views, custom SVG schematics, and baseline validation tests are implemented.

- Scaffold Vite + React + TypeScript.
- Implement RC low-pass and RC high-pass ideal AC response.
- Implement loaded RC 2-stage low-pass response with R1/C1 and R2/C2.
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

Status: started. A charge-conserving RC nonlinear simulation, FFT-derived HD2-HD5, THD metrics, time-domain result table, capacitance profile plot, and harmonic-vs-frequency sweep are implemented for the connected RC solver topologies.

- Add polynomial C(V) model.
- Use charge-conserving q(V) formulation.
- Add time-domain simulation for RC low-pass.
- Add two-state RK4 simulation for loaded RC 2-stage low-pass.
- Add spectrum and HD2-HD5/THD metrics.
- Validate against analytical small-nonlinearity cases.

## Phase 4 - Topology Expansion

Goal: cover the MVP topology list.

Status: topology catalog and schematic previews are started, but only `RC Low-pass`, `RC High-pass`, and `RC 2-Stage Low-pass` are connected to numerical solvers.

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
