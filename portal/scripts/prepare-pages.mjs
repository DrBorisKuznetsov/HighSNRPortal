import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  notFoundMetadata,
  publishedRoutePaths,
  routeMetadata,
  sitemapRouteMetadata,
} from '../src/routeMetadata.js';
import {
  buildStructuredData,
  getCanonicalUrl,
  getPageTitle,
  getRobotsContent,
  getSocialImage,
  siteOrigin,
} from '../src/seo.js';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectRoot, 'dist');
const sourceIndex = join(distDir, 'index.html');
const sourceHtml = await readFile(sourceIndex, 'utf8');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceMeta(html, attribute, value, content) {
  const pattern = new RegExp(`<meta ${attribute}="${value}" content="[^"]*" \\/>`);
  return html.replace(pattern, `<meta ${attribute}="${value}" content="${escapeHtml(content)}" />`);
}

function renderRouteHtml(metadata, { includeCanonical = true, includeStructuredData = true } = {}) {
  const title = getPageTitle(metadata);
  const url = getCanonicalUrl(metadata);
  const socialImage = getSocialImage(metadata);
  let html = sourceHtml.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  html = replaceMeta(html, 'name', 'description', metadata.description);
  html = replaceMeta(html, 'name', 'robots', getRobotsContent(metadata));
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', metadata.description);
  html = replaceMeta(html, 'property', 'og:type', metadata.ogType ?? 'website');
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'property', 'og:image', socialImage.url);
  html = replaceMeta(html, 'property', 'og:image:width', socialImage.width);
  html = replaceMeta(html, 'property', 'og:image:height', socialImage.height);
  html = replaceMeta(html, 'property', 'og:image:alt', socialImage.alt);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', metadata.description);
  html = replaceMeta(html, 'name', 'twitter:image', socialImage.url);

  if (includeStructuredData) {
    const structuredData = JSON.stringify(buildStructuredData(metadata)).replaceAll('<', '\\u003c');
    html = html.replace(
      /<script id="structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="structured-data" type="application/ld+json">${structuredData}</script>`,
    );
  } else {
    html = html.replace(/\s*<script id="structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/, '');
  }

  if (includeCanonical) {
    html = html.replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escapeHtml(url)}" />`,
    );
  } else {
    html = html.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '');
  }

  return html;
}

await writeFile(sourceIndex, renderRouteHtml(routeMetadata.find(({ path }) => path === '/')), 'utf8');

const notFoundHtml = renderRouteHtml(
  { ...notFoundMetadata, path: '/' },
  { includeCanonical: false, includeStructuredData: false },
);
await writeFile(join(distDir, '404.html'), notFoundHtml, 'utf8');

for (const routePath of publishedRoutePaths) {
  const metadata = routeMetadata.find(({ path }) => path === routePath);
  const routeDirectory = join(distDir, routePath.replace(/^\//, ''));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(
    join(routeDirectory, 'index.html'),
    renderRouteHtml(metadata, { includeStructuredData: !metadata.noIndex }),
    'utf8',
  );
}

const robots = [
  'User-agent: *',
  'Allow: /',
  `Sitemap: ${siteOrigin}/sitemap.xml`,
  '',
].join('\n');
await writeFile(join(distDir, 'robots.txt'), robots, 'utf8');

const sitemapUrls = sitemapRouteMetadata
  .map((metadata) => {
    const lastModified = metadata.dateModified ? `<lastmod>${escapeHtml(metadata.dateModified)}</lastmod>` : '';
    return `  <url><loc>${escapeHtml(getCanonicalUrl(metadata))}</loc>${lastModified}</url>`;
  })
  .join('\n');
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemapUrls,
  '</urlset>',
  '',
].join('\n');
await writeFile(join(distDir, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Prepared ${publishedRoutePaths.length} public SPA entrypoints and ${sitemapRouteMetadata.length} sitemap URLs.`);
