import { access, open, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  publishedRoutePaths,
  routeMetadata,
  sitemapRouteMetadata,
} from '../src/routeMetadata.js';
import {
  getCanonicalUrl,
  getPageTitle,
  getRobotsContent,
  getSocialImage,
  siteOrigin,
} from '../src/seo.js';

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

function escapedPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function assertHtmlValue(html, pattern, expected, routePath, label) {
  const match = html.match(pattern);
  if (!match || match[1] !== expected) {
    throw new Error(`${routePath} has incorrect static ${label}. Expected "${expected}", received "${match?.[1] ?? 'missing'}".`);
  }
}

for (const metadata of routeMetadata) {
  const htmlPath = metadata.path === '/'
    ? join(distDir, 'index.html')
    : join(distDir, metadata.path.replace(/^\//, ''), 'index.html');
  const html = await readFile(htmlPath, 'utf8');
  const expectedTitle = getPageTitle(metadata);
  const expectedCanonical = getCanonicalUrl(metadata);
  const expectedSocialImage = getSocialImage(metadata);

  if (
    !html.includes('<main class="main-content">')
    || !html.includes(`data-prerender-path="${metadata.path}"`)
    || html.includes('<div id="root"></div>')
  ) {
    throw new Error(`${metadata.path} must contain server-rendered page HTML inside #root.`);
  }

  assertHtmlValue(html, /<title>(.*?)<\/title>/, escapeHtml(expectedTitle), metadata.path, 'title');
  assertHtmlValue(html, /<meta name="description" content="([^"]*)" \/>/, escapeHtml(metadata.description), metadata.path, 'description');
  assertHtmlValue(html, /<meta name="robots" content="([^"]*)" \/>/, getRobotsContent(metadata), metadata.path, 'robots directive');
  assertHtmlValue(html, /<link rel="canonical" href="([^"]*)" \/>/, expectedCanonical, metadata.path, 'canonical URL');
  assertHtmlValue(html, /<meta property="og:title" content="([^"]*)" \/>/, escapeHtml(expectedTitle), metadata.path, 'Open Graph title');
  assertHtmlValue(html, /<meta property="og:description" content="([^"]*)" \/>/, escapeHtml(metadata.description), metadata.path, 'Open Graph description');
  assertHtmlValue(html, /<meta property="og:url" content="([^"]*)" \/>/, expectedCanonical, metadata.path, 'Open Graph URL');
  assertHtmlValue(html, /<meta property="og:image" content="([^"]*)" \/>/, expectedSocialImage.url, metadata.path, 'Open Graph image');
  assertHtmlValue(html, /<meta name="twitter:title" content="([^"]*)" \/>/, escapeHtml(expectedTitle), metadata.path, 'Twitter title');
  assertHtmlValue(html, /<meta name="twitter:description" content="([^"]*)" \/>/, escapeHtml(metadata.description), metadata.path, 'Twitter description');

  const structuredDataMatch = html.match(/<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (metadata.noIndex) {
    if (structuredDataMatch) {
      throw new Error(`${metadata.path} is noindex but still contains structured data.`);
    }
    continue;
  }

  if (!structuredDataMatch) {
    throw new Error(`${metadata.path} is missing structured data.`);
  }

  const structuredData = JSON.parse(structuredDataMatch[1]);
  const pageEntity = structuredData['@graph']?.find((entity) => entity['@id'] === `${expectedCanonical}#webpage`);
  if (!pageEntity || pageEntity.url !== expectedCanonical || pageEntity.name !== expectedTitle) {
    throw new Error(`${metadata.path} has invalid structured page data.`);
  }

  if (metadata.schemaType === 'TechArticle' && pageEntity['@type'] !== 'TechArticle') {
    throw new Error(`${metadata.path} is missing TechArticle structured data.`);
  }

  if (metadata.schemaType === 'TechArticle') {
    if (
      pageEntity.headline !== metadata.title
      || pageEntity.datePublished !== metadata.datePublished
      || pageEntity.dateModified !== metadata.dateModified
      || pageEntity.author?.name !== metadata.author
      || pageEntity.image !== expectedSocialImage.url
    ) {
      throw new Error(`${metadata.path} has incomplete TechArticle structured data.`);
    }
  }
}

const publicationsHtml = await readFile(join(distDir, 'publications', 'index.html'), 'utf8');
if (!publicationsHtml.includes('Articles, Preprints, and Technical Notes')) {
  throw new Error('/publications/ must expose its visible page heading in the generated HTML.');
}

const robots = await readFile(join(distDir, 'robots.txt'), 'utf8');
if (robots !== 'User-agent: *\nAllow: /\nSitemap: https://highsnr.org/sitemap.xml\n') {
  throw new Error('robots.txt does not contain the expected crawl and sitemap directives.');
}

const sitemap = await readFile(join(distDir, 'sitemap.xml'), 'utf8');
const sitemapCanonicalUrls = sitemapRouteMetadata.map((metadata) => getCanonicalUrl(metadata));
if (new Set(sitemapCanonicalUrls).size !== sitemapCanonicalUrls.length) {
  throw new Error('sitemap.xml source metadata contains duplicate canonical URLs.');
}

for (const metadata of sitemapRouteMetadata) {
  const url = getCanonicalUrl(metadata);
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    throw new Error(`sitemap.xml is missing ${url}.`);
  }
}

for (const metadata of routeMetadata.filter(({ noIndex }) => noIndex)) {
  const routeUrl = `${siteOrigin}${metadata.path}/`;
  const urlPattern = new RegExp(`<loc>${escapedPattern(routeUrl)}<\\/loc>`);
  if (urlPattern.test(sitemap)) {
    throw new Error(`sitemap.xml includes noindex route ${metadata.path}.`);
  }
}

const sitemapUrlCount = [...sitemap.matchAll(/<url>/g)].length;
if (sitemapUrlCount !== sitemapRouteMetadata.length) {
  throw new Error(`sitemap.xml contains ${sitemapUrlCount} URLs; expected ${sitemapRouteMetadata.length}.`);
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
if (!designReviewHtml.includes('<div id="root" data-prerender-path="/design-review">') || !designReviewHtml.includes('<h1>Design Review</h1>')) {
  throw new Error('Design Review entrypoint does not contain its server-rendered portal content.');
}

const legacyBlogHtml = await readFile(join(distDir, 'blog', 'index.html'), 'utf8');
if (
  !legacyBlogHtml.includes('<meta name="robots" content="noindex, follow" />')
  || !legacyBlogHtml.includes('<link rel="canonical" href="https://highsnr.org/publications/" />')
) {
  throw new Error('Legacy /blog entrypoint must be noindex and canonicalize to /publications/.');
}

console.log(`Verified ${publishedRoutePaths.length} public routes, ${sitemapRouteMetadata.length} sitemap URLs, and ${pdfPaths.length} PDF downloads.`);
