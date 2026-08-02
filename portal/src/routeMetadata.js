const defaultDescription = 'Independent electronics research, engineering tools, publications, videos, and education for real-world signal chains.';

export const routeMetadata = [
  { path: '/', title: 'HighSNR Lab', description: defaultDescription },
  { path: '/research', title: 'Capacitor Research', description: 'Research on MLCC behavior, nonlinear capacitance, dielectric memory, distortion, and precision signal-chain errors.', schemaType: 'CollectionPage' },
  { path: '/research/adc-front-end-modeling', title: 'Capacitor Research', description: defaultDescription, canonicalPath: '/research', noIndex: true },
  { path: '/research/nonlinear-passive-components', title: 'Capacitor Research', description: defaultDescription, canonicalPath: '/research', noIndex: true },
  { path: '/tools', title: 'Engineering Tools', description: 'Interactive calculators and simulation models for nonlinearities, noise, settling, and signal degradation.', schemaType: 'CollectionPage' },
  { path: '/tools/adc-enob-loss-calculator', title: 'Engineering Tools', description: defaultDescription, canonicalPath: '/tools', noIndex: true },
  { path: '/tools/capacitor-distortion-analyzer', title: 'Engineering Tools', description: defaultDescription, canonicalPath: '/tools', noIndex: true },
  { path: '/tools/capacitor-distortion', title: 'Engineering Tools', description: defaultDescription, canonicalPath: '/tools', noIndex: true },
  { path: '/publications', title: 'Articles & Papers', description: 'HighSNR Lab articles, preprints, application notes, and technical publications.', schemaType: 'CollectionPage' },
  {
    path: '/application-notes/an-001',
    title: 'AN-001: MLCC Distortion Near an RC Transition Band',
    description: 'Application Note AN-001 explains why MLCC distortion can peak near an RC transition band.',
    schemaType: 'TechArticle',
    author: 'Boris Kuznetsov',
    datePublished: '2026-07-27',
    dateModified: '2026-07-27',
  },
  { path: '/lab-notes', title: 'Research Log', description: 'Research updates, measurements, modeling notes, and engineering observations from HighSNR Lab.', schemaType: 'CollectionPage' },
  {
    path: '/lab-notes/mlcc-distortion-meter-functional-architecture',
    title: 'Measuring MLCC Distortion Under DC Bias',
    description: 'A two-channel architecture for measuring MLCC voltage and current under DC bias while controlling residual distortion in the test setup.',
    ogType: 'article',
    image: '/lab-notes/mlcc-distortion-meter-functional-architecture/03-meter-functional-architecture.png',
    imageWidth: 3127,
    imageHeight: 1317,
    imageAlt: 'Functional architecture of a two-channel MLCC distortion meter.',
    schemaType: 'TechArticle',
    author: 'Boris Kuznetsov',
    datePublished: '2026-08-02',
    dateModified: '2026-08-02',
  },
  { path: '/courses', title: 'Engineering Education', description: 'Engineering education and course material for practical analog and mixed-signal design.', schemaType: 'CollectionPage' },
  { path: '/education-tools', title: 'HighSNR Circuit Builder', description: 'Visual tools for drawing circuits and exporting Manim-ready Python code.' },
  { path: '/education-tools/highsnr-circuit-builder', title: 'HighSNR Circuit Builder', description: defaultDescription, canonicalPath: '/education-tools', noIndex: true },
  { path: '/about', title: 'About HighSNR Lab', description: 'About HighSNR Engineering Lab and Boris Kuznetsov.', schemaType: 'AboutPage' },
  { path: '/subscribe', title: 'Research Log', description: defaultDescription, canonicalPath: '/lab-notes', noIndex: true },
  { path: '/design-review', title: 'Design Review', description: 'Independent engineering assessment of precision analog and mixed-signal hardware.' },
  { path: '/projects', title: 'Capacitor Research', description: defaultDescription, canonicalPath: '/research', noIndex: true },
  { path: '/consulting', title: 'Design Review', description: defaultDescription, canonicalPath: '/design-review', noIndex: true },
];

export const publishedRoutePaths = routeMetadata
  .map(({ path }) => path)
  .filter((path) => path !== '/');

export const sitemapRouteMetadata = routeMetadata.filter(({ noIndex }) => !noIndex);

export const notFoundMetadata = {
  title: 'Page Not Found',
  description: 'The requested page is not part of the current HighSNR Lab portal.',
  noIndex: true,
  noFollow: true,
};

export function normalizeRoutePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

export function getRouteMetadata(pathname) {
  const normalizedPathname = normalizeRoutePath(pathname);

  return routeMetadata.find(({ path }) => path === normalizedPathname) ?? notFoundMetadata;
}
