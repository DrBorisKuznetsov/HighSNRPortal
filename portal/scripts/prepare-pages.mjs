import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedRoutePaths } from '../src/routeMetadata.js';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectRoot, 'dist');
const sourceIndex = join(distDir, 'index.html');

await copyFile(sourceIndex, join(distDir, '404.html'));

for (const routePath of publishedRoutePaths) {
  const routeDirectory = join(distDir, routePath.replace(/^\//, ''));
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(sourceIndex, join(routeDirectory, 'index.html'));
}

console.log(`Prepared ${publishedRoutePaths.length} public SPA entrypoints.`);

