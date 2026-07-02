# Architecture Notes

## Boundary

This tool should be a standalone web application. The main portal should not own the solver, state model, plots, or heavy UI.

Recommended boundary:

```text
portal
  owns: catalog card, SEO/landing page, launch button, related links

capacitor_filter_tool
  owns: application UI, numerical model, validation, examples, docs
```

## Recommended Stack

Start with:

- Vite;
- React;
- TypeScript;
- ECharts or Plotly for plots;
- Web Worker for long sweeps;
- plain JSON/CSV for capacitor model data.

Avoid a backend in the MVP unless the browser implementation is demonstrably too slow or too unstable.

## Internal Modules

Suggested future source layout:

```text
src/
  app/              UI composition, routes, layout
  components/       reusable controls and plot wrappers
  models/           typed domain models
  solver/           filter calculations and nonlinear simulation
  data/             built-in capacitor presets
  workers/          sweep and spectrum jobs
  validation/       reference cases and numerical checks
```

## Numerical Core

Keep the numerical core independent from React:

- pure functions for linear transfer functions;
- pure functions for component impedance models;
- explicit state objects for nonlinear time-domain simulation;
- deterministic test cases;
- no DOM or UI dependencies inside solver code.

This makes it easier to validate the model, compare against Python references, and later move heavy calculations to Web Worker or WebAssembly.

## Analysis Pipeline

Recommended pipeline:

1. Parse topology and component parameters.
2. Build ideal linear model.
3. Build linear non-ideal model.
4. If nonlinear mode is enabled, build charge-conserving capacitor model.
5. Run selected analysis:
   - AC sweep;
   - time-domain response;
   - spectrum;
   - parameter sweep.
6. Return data series and metrics to the UI.

## Charge-Conserving Capacitor Model

Use charge as the primary state for nonlinear capacitors where possible:

```text
q(V) = C0 * (V + alpha*V^2/2 + beta*V^3/3 + gamma*V^4/4)
```

The current is:

```text
i(t) = dq/dt
```

This matches the research direction already documented in the portal and avoids artificial energy/current behavior from naive C(V) simulation.

## Validation Strategy

Start validation before adding many topologies:

- analytical RC low-pass baseline;
- ideal vs ESR/ESL regression cases;
- small-nonlinearity harmonic cases from the published RC theory;
- spectrum checks for HD2-HD5;
- sweep sanity checks for amplitude and frequency.

Each new topology should add one small validation fixture.

## UX Direction

The tool should feel like a compact engineering instrument:

- dense but readable controls;
- stable plot areas;
- no oversized hero;
- no explanatory marketing blocks inside the workbench;
- tooltips for technical parameters;
- defaults that immediately produce a meaningful plot.

The portal landing page can carry the explanatory copy. The app itself should prioritize work.

## UI Architecture and Schematics

- **Modular Views**: The main App.tsx acts only as a state container. All UI panels are separated into src/components/views/ (e.g., FilterSetupView.tsx) and smaller presentation components in src/components/ui/.
- **SVG Rendering**: Schematics are rendered as inline SVGs via FilterSchematic.tsx. To maintain a uniform scale across SVGs exported with different viewBox coordinates, the schematic wrapper assigns a fixed visual height and auto width. ViewBox coordinates are manually padded and normalized so that edge text is not cropped.
- **Topology Scope**: The topology library may list schematic/planning entries before their numerical model exists. Only entries with a connected `solverTopology` should enable AC and distortion calculations.

## Solvers and Mathematics

The mathematical foundation is documented in `mathematics.md`. The linear solver computes direct algebraic transfer functions for the connected RC topologies. The nonlinear solver uses explicit fourth-order Runge-Kutta (RK4) integration while tracking charge (`Q`) to maintain charge conservation over voltage-dependent capacitors. The connected second-order model is the loaded `RC 2-Stage Low-pass`; other second-order catalog entries need separate validation fixtures before solver activation.
