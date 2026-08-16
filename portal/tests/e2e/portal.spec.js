import { expect, test } from '@playwright/test';

const publicPages = [
  ['/', 'HighSNR Engineering Lab', 'HighSNR Lab'],
  ['/research', 'Capacitor Research', 'Capacitor Research | HighSNR Lab'],
  ['/tools', 'Engineering Tools', 'Engineering Tools | HighSNR Lab'],
  ['/publications', 'Articles, Preprints, and Technical Notes', 'Electronics Research Papers & Application Notes | HighSNR Lab'],
  ['/application-notes/an-001', 'Frequency-Dependent Distortion in Class II Ceramic Capacitors', 'AN-001: MLCC Distortion Near an RC Transition Band | HighSNR Lab'],
  ['/lab-notes', 'Research Log', 'Research Log | HighSNR Lab'],
  ['/lab-notes/mlcc-distortion-meter-functional-architecture', 'Measuring MLCC Distortion Under DC Bias', 'Measuring MLCC Distortion Under DC Bias | HighSNR Lab'],
  ['/courses', 'Engineering Education', 'Engineering Education | HighSNR Lab'],
  ['/education-tools', 'HighSNR Circuit Builder', 'HighSNR Circuit Builder | HighSNR Lab'],
  ['/about', 'HighSNR Engineering Lab', 'About HighSNR Lab | HighSNR Lab'],
  ['/design-review', 'Design Review', 'Design Review | HighSNR Lab'],
];

for (const [path, heading, title] of publicPages) {
  test(`${path} renders directly`, async ({ page }) => {
    const clientErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && /react error|hydration/i.test(message.text())) {
        clientErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => clientErrors.push(error.message));
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin === 'http://127.0.0.1:5173' && response.status() >= 400) {
        clientErrors.push(`${response.status()} ${url.pathname}`);
      }
    });

    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page).toHaveTitle(title);

    const brokenImages = await page.locator('img').evaluateAll((images) => (
      images.filter((image) => image.complete && image.naturalWidth === 0).length
    ));
    expect(brokenImages).toBe(0);
    expect(clientErrors).toEqual([]);
  });
}

test('mobile navigation is compact, accessible, and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(menuButton).toBeVisible();
  await expect(navigation).toBeHidden();

  await menuButton.click();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();

  await navigation.getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page).toHaveURL('/research/');
  await expect(navigation).toBeHidden();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('Design Review does not overflow the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/design-review');

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
});

test('MLCC engineering note is responsive and has publication metadata', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lab-notes/mlcc-distortion-meter-functional-architecture');

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  const structuredData = JSON.parse(await page.locator('#structured-data').textContent());
  const articleEntity = structuredData['@graph'].find((entity) => entity['@type'] === 'TechArticle');
  expect(articleEntity).toMatchObject({
    headline: 'Measuring MLCC Distortion Under DC Bias',
    datePublished: '2026-08-02',
    url: 'https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/',
  });
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeHidden();
});

test('published routes keep their metadata with a trailing slash', async ({ page }) => {
  await page.goto('/lab-notes/mlcc-distortion-meter-functional-architecture/');

  await expect(page.getByRole('heading', { level: 1, name: 'Measuring MLCC Distortion Under DC Bias' })).toBeVisible();
  await expect(page).toHaveTitle('Measuring MLCC Distortion Under DC Bias | HighSNR Lab');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/',
  );
});

test('internal navigation resets scroll position', async ({ page }) => {
  await page.goto('/design-review');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500);

  await page.getByRole('link', { name: 'About & Contact' }).click();
  await expect(page).toHaveURL('/about/');
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('internal links use canonical trailing-slash URLs', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Design Review' })).toHaveAttribute('href', '/design-review/');
  await expect(page.getByRole('link', { name: 'Research', exact: true })).toHaveAttribute('href', '/research/');
});

test('publication hub exposes and measures related portal paths', async ({ page }) => {
  await page.goto('/publications/');
  await page.evaluate(() => {
    window.__testAnalyticsEvents = [];
    window.gtag = (...args) => window.__testAnalyticsEvents.push(args);
  });

  await expect(page.getByRole('link', { name: 'Engineering Tools' })).toHaveAttribute('href', '/tools/');
  const mlccLink = page.getByRole('link', { name: 'MLCC Measurement Note' });
  await expect(mlccLink).toHaveAttribute(
    'href',
    '/lab-notes/mlcc-distortion-meter-functional-architecture/',
  );

  await mlccLink.click();
  await expect(page).toHaveURL('/lab-notes/mlcc-distortion-meter-functional-architecture/');
  expect(await page.evaluate(() => window.__testAnalyticsEvents)).toContainEqual([
    'event',
    'select_content',
    {
      content_type: 'publication_hub',
      item_id: '/lab-notes/mlcc-distortion-meter-functional-architecture/',
    },
  ]);
});

test('legacy blog URL resolves without creating an indexable duplicate', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.getByRole('heading', { level: 1, name: 'Articles, Preprints, and Technical Notes' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://highsnr.org/publications/',
  );
});

test('Design Review PDF downloads are published as PDFs', async ({ request }) => {
  const pdfPaths = [
    '/docs/battery-tester/client_brief_battery_tester_en.pdf',
    '/docs/battery-tester/battery_tester_rev_d.pdf',
    '/docs/battery-tester/HighSNR_Design_Review_SNR-R-2607_corrected.pdf',
  ];

  for (const pdfPath of pdfPaths) {
    const response = await request.get(pdfPath);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  }
});
