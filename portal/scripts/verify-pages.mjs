import { access, open, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedRoutePaths, routeMetadata } from '../src/routeMetadata.js';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectRoot, 'dist');
const uniquePaths = new Set(routeMetadata.map(({ path }) => path));

if (uniquePaths.size !== routeMetadata.length) {
  throw new Error('Route metadata contains duplicate paths.');
}

const appSource = await readFile(join(projectRoot, 'src', 'App.jsx'), 'utf8');
const appRoutePaths = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => path !== '*');
const metadataPathSet = new Set(routeMetadata.map(({ path }) => path));
const missingFromMetadata = appRoutePaths.filter((path) => !metadataPathSet.has(path));
const missingFromApp = [...metadataPathSet].filter((path) => !appRoutePaths.includes(path));

if (missingFromMetadata.length || missingFromApp.length) {
  throw new Error(`Route metadata mismatch. Missing from metadata: ${missingFromMetadata.join(', ') || 'none'}. Missing from App: ${missingFromApp.join(', ') || 'none'}.`);
}

await access(join(distDir, '404.html'));

for (const routePath of publishedRoutePaths) {
  await access(join(distDir, routePath.replace(/^\//, ''), 'index.html'));
}

const pdfPaths = [
  'docs/battery-tester/client_brief_battery_tester_en.pdf',
  'docs/battery-tester/battery_tester_rev_d.pdf',
  'docs/battery-tester/HighSNR_Design_Review_SNR-R-2607_corrected.pdf',
];

for (const pdfPath of pdfPaths) {
  const filePath = join(distDir, pdfPath);
  const handle = await open(filePath, 'r');
  const signature = Buffer.alloc(5);
  await handle.read(signature, 0, signature.length, 0);
  await handle.close();

  if (signature.toString() !== '%PDF-') {
    throw new Error(`${pdfPath} is not a valid PDF file.`);
  }
}

const designReviewHtml = await readFile(join(distDir, 'design-review', 'index.html'), 'utf8');
if (!designReviewHtml.includes('<div id="root"></div>')) {
  throw new Error('Design Review entrypoint does not contain the portal root element.');
}

console.log(`Verified ${publishedRoutePaths.length} public routes and ${pdfPaths.length} PDF downloads.`);
