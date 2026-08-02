const defaultDescription = 'Independent electronics research, engineering tools, publications, videos, and education for real-world signal chains.';

export const routeMetadata = [
  { path: '/', title: 'HighSNR Lab', description: defaultDescription },
  { path: '/research', title: 'Capacitor Research', description: 'Research on MLCC behavior, nonlinear capacitance, dielectric memory, distortion, and precision signal-chain errors.' },
  { path: '/research/adc-front-end-modeling', title: 'Capacitor Research', description: defaultDescription },
  { path: '/research/nonlinear-passive-components', title: 'Capacitor Research', description: defaultDescription },
  { path: '/tools', title: 'Engineering Tools', description: 'Interactive calculators and simulation models for nonlinearities, noise, settling, and signal degradation.' },
  { path: '/tools/adc-enob-loss-calculator', title: 'Engineering Tools', description: defaultDescription },
  { path: '/tools/capacitor-distortion-analyzer', title: 'Engineering Tools', description: defaultDescription },
  { path: '/tools/capacitor-distortion', title: 'Engineering Tools', description: defaultDescription },
  { path: '/publications', title: 'Articles & Papers', description: 'HighSNR Lab articles, preprints, application notes, and technical publications.' },
  { path: '/application-notes/an-001', title: 'AN-001: MLCC Distortion Near an RC Transition Band', description: 'Application Note AN-001 explains why MLCC distortion can peak near an RC transition band.' },
  { path: '/lab-notes', title: 'Research Log', description: 'Research updates, measurements, modeling notes, and engineering observations from HighSNR Lab.' },
  { path: '/courses', title: 'Engineering Education', description: 'Engineering education and course material for practical analog and mixed-signal design.' },
  { path: '/education-tools', title: 'HighSNR Circuit Builder', description: 'Visual tools for drawing circuits and exporting Manim-ready Python code.' },
  { path: '/education-tools/highsnr-circuit-builder', title: 'HighSNR Circuit Builder', description: defaultDescription },
  { path: '/about', title: 'About HighSNR Lab', description: 'About HighSNR Engineering Lab and Boris Kuznetsov.' },
  { path: '/subscribe', title: 'Research Log', description: defaultDescription },
  { path: '/design-review', title: 'Design Review', description: 'Independent engineering assessment of precision analog and mixed-signal hardware.' },
  { path: '/projects', title: 'Capacitor Research', description: defaultDescription },
  { path: '/consulting', title: 'Design Review', description: defaultDescription },
];

export const publishedRoutePaths = routeMetadata
  .map(({ path }) => path)
  .filter((path) => path !== '/');

export function getRouteMetadata(pathname) {
  return routeMetadata.find(({ path }) => path === pathname) ?? {
    title: 'Page Not Found',
    description: 'The requested page is not part of the current HighSNR Lab portal.',
    noIndex: true,
  };
}

