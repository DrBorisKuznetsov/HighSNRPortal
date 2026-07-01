# Portal Integration

## Decision

The tool should be integrated into the HighSNR portal as a standalone Engineering Tool, not embedded into the portal bundle.

Recommended production address:

```text
https://filters.highsnr.org
```

Recommended local development address:

```text
http://localhost:5175/
```

## Why A Subdomain

The tool is large enough to deserve its own runtime:

- several analysis modes;
- numerical solver;
- spectrum calculations;
- sweeps;
- possible Web Worker or WASM boundary;
- its own documentation and validation lifecycle.

A subdomain keeps the portal clean and lets the tool evolve without increasing the portal's build and routing complexity.

## Portal Route

Keep the existing portal route as the description and launch page:

```text
/tools/capacitor-distortion-analyzer
```

This route should describe the engineering problem, connect the tool to capacitor research and publications, and launch the standalone app in a new tab.

## Launch Contract

The portal should use environment-aware links:

```text
development: http://localhost:5175/
production:  https://filters.highsnr.org
```

Do not enable a visible "Launch" button until the standalone tool has at least a minimal working UI. Until then, the portal page should show "In development" and link to related research.

## Suggested Portal Copy

Title:

```text
Passive Filter Distortion Analyzer
```

Short description:

```text
Analyze how voltage-dependent capacitance, ESR, ESL, leakage, source impedance, and load conditions affect passive filter response and harmonic distortion.
```

Status label:

```text
In development
```

Primary CTA when the app is ready:

```text
Launch Tool
```

Secondary CTA:

```text
Read Capacitor Research
```

## Related Portal Objects

- `/research` - capacitor research overview.
- `/publications` - capacitor papers and DOI records.
- `/lab-notes` - interim research log.
- `/tools/adc-enob-loss-calculator` - related ADC front-end tool.

## DNS And Hosting Notes

Recommended DNS:

```text
filters.highsnr.org
```

Possible hosting options:

- GitHub Pages with a separate CNAME;
- Cloudflare Pages;
- Vercel/Netlify if previews are useful.

If the tool remains fully static, GitHub Pages is enough. If server-side reports or private simulations appear later, use a separate backend and keep the public app static where possible.
