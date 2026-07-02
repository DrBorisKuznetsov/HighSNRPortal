# Publication Audit: 2026-07-02

Purpose: readiness check before announcing `filters.highsnr.org` on LinkedIn.

## Checked

- Local app opens at `http://127.0.0.1:5175/`.
- Application title is `Passive Filter Tool`.
- Public CNAME is `filters.highsnr.org`.
- Main screens open without console errors:
  - Filter;
  - Capacitors;
  - Distortion Sweep;
  - Methodology.
- Mobile viewport around 390 px wide has no horizontal overflow.
- Production build includes:
  - `dist/index.html`;
  - `dist/CNAME`;
  - `dist/social-preview.png`;
  - `dist/tool-manifest.json`.

## Changes Made

- Added Open Graph and Twitter metadata to `index.html`.
- Generated `public/social-preview.png` for LinkedIn/social previews.
- Removed temporary Python migration scripts from the project root.
- Hid topology catalog entries that do not yet have connected solver support.
- Updated README status.

## Verification

```text
npm test
```

Result:

```text
2 test files passed
11 tests passed
```

```text
npm run build
```

Result:

```text
production build passed
```

Build note:

```text
Vite warns that the JavaScript bundle is larger than 500 kB.
```

This is acceptable for the announcement stage because the app uses ECharts and FFT-related numerical code. Recommended later improvement: split charting/nonlinear analysis code into lazy chunks.

## Live Domain Check

DNS and HTTP:

```text
filters.highsnr.org -> drboriskuznetsov.github.io
https://filters.highsnr.org/ returns HTTP 200
https://highsnr.org/ returns HTTP 200
```

Publication blocker:

```text
The live domain is still serving an older build.
```

Observed on 2026-07-02:

- live `<title>` is still `Passive Filter Tool`;
- `https://filters.highsnr.org/social-preview.png` returns 404.

Action before LinkedIn announcement:

- deploy the fresh `dist` directory generated after this audit;
- verify that the live page title becomes `Passive Filter Distortion Analyzer | HighSNR Lab`;
- verify that `https://filters.highsnr.org/social-preview.png` returns HTTP 200.

## Remaining Non-Blocking Notes

- The current public topology set is intentionally limited to solver-connected RC models.
- The Methodology screen is complete enough for public use, but can later be expanded with examples from published papers.
- The bundle-size warning should be addressed before larger public traffic or embedding into other pages.
