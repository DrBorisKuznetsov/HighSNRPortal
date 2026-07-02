# Passive Filter Tool

Standalone workspace for the web tool described in the technical specification:

> Web tool for analyzing how capacitor nonlinearity affects distortion in passive filters.

The tool belongs to the HighSNR Engineering Tools family, but it should not be built directly inside the main portal. The portal should act as a launch and explanation page; this directory should contain the actual application, model code, validation assets, and project documentation.

## Current Status

- Project directory prepared: `capacitor_filter_tool`.
- Original technical specification copied to `docs/source/technical-spec-source.pdf`.
- Working specification summary created in `docs/technical-spec.md`.
- Portal integration contract created in `public/tool-manifest.json`.
- Vite + React + TypeScript application runtime scaffolded.
- Initial ideal RC low-pass/high-pass AC workbench implemented.
- RC cutoff and ideal response validation tests added.
- Initial charge-conserving nonlinear RC distortion analysis implemented.
- **UI Architecture Modularized**: Separated `App.tsx` logic into distinct view/ui components (`src/components/views`, `src/components/ui`).
- **Custom Schematics Integrated**: Replaced placeholders with exact SVG schemas from CorelDraw (`RC Low-pass`, `RC High-pass`, `RC 2-Stage Low-pass`), scaling them uniformly via fixed height mapping and normalized `viewBox` coordinates.
- **2nd Order RC Support**: Connected `RC 2-Stage Low-pass` to the linear and nonlinear solvers with independent R1/C1 and R2/C2 values.
- **Public Announcement Audit**: Added Open Graph/Twitter metadata, generated `public/social-preview.png`, removed temporary migration scripts, and limited the public topology list to solver-connected models.
- Recommended production subdomain: `https://filters.highsnr.org`.
- Recommended local development URL: `http://localhost:5175/`.

The current app supports ideal RC low-pass/high-pass frequency response plus a loaded two-stage RC low-pass model. Nonlinear mode uses a charge-conserving capacitor model, time-domain simulation, FFT-derived HD2-HD5, THD, capacitance profile plotting, CSV export, and validation tests. The UI is now modularized with native vector schematic rendering. The public topology list only exposes models that are connected to the solver; additional topology definitions remain internal roadmap material until their electrical models are implemented.

## Local Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm test
npm run build
```

## Working Name

Use this naming until a final product name is chosen:

- Full name: **Passive Filter Distortion Analyzer**
- Short name: **Passive Filter Tool**
- Portal route: `/tools/capacitor-distortion-analyzer`
- Subdomain: `filters.highsnr.org`

The existing portal route can remain stable for SEO and internal links even if the visible product name is refined later.

## First Files To Read

1. `docs/technical-spec.md` - working summary of the PDF specification.
2. `docs/architecture.md` - recommended application boundaries and solver design.
3. `docs/mathematics.md` - mathematical reference for linear and nonlinear solvers.
4. `docs/portal-integration.md` - how this tool should connect to the portal.
5. `docs/agent-brief.md` - instructions for future agents working inside this tool.

## Recommended Development Direction

Start with a browser-first application:

- React + TypeScript + Vite for UI.
- A separate TypeScript numerical core for filter response and distortion calculations.
- Web Worker boundary for heavier sweeps.
- ECharts or Plotly for engineering plots.
- CSV import for measured or vendor-derived `Voltage,Capacitance` tables.

Python can be used for reference notebooks and validation scripts, but the MVP should remain client-side if possible.
