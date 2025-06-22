import puppeteer from 'puppeteer';

const args = process.argv.slice(2);
const repeatsCount = parseInt(args[0], 10) || 1;

// TODO: Добавить возможность тестировать одну технологию на разных настройках
// TODO: Добавить визуальное сравнение технологий (графики)
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  const headerLinks = await page.$$eval('.menu-link', (links) =>
    links.map((link) => ({
      text: (link.textContent || '').trim(),
      href: link.getAttribute('href')
    }))
  );

  const allMetrics = [];

  for (let repeat = 1; repeat <= repeatsCount; repeat++) {
    console.log(`\nПовтор ${repeat} из ${repeatsCount}`);

    for (let i = 1; i < headerLinks.length; i++) {
      const { href, text } = headerLinks[i];
      console.log(`Переход по: [${text}] ${href}`);

      const metrics = await collectPageMetrics(page, href);

      allMetrics.push({
        repeat,
        page: href,
        metrics
      });

      await wait(500);
    }
  }

  await browser.close();

  console.log('\nВсе метрики собраны:');
  summarizeMetricsByPage(allMetrics);
})();

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const collectMetrics = async (page, metrics) => {
  const m = await page.evaluate(() => {
    const getNumber = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const match = el.textContent?.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : null;
    };

    return {
      timestamp: Date.now(),
      fps: getNumber('fps'),
      memoryMB: getNumber('memory'),
      domNodes: getNumber('dom-nodes'),
      fcp: getNumber('fcp'),
      unputLatency: getNumber('input-latency')
    };
  });

  metrics.push(m);
};

const collectPageMetrics = async (page, href) => {
  const metrics = [];

  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click(`.menu-link[href="${href}"]`)]);

  await page.waitForSelector('.page-container');

  const { centerX, centerY } = await page.evaluate(() => {
    const container = document.querySelector('.page-container');
    if (!container) throw new Error('page-container не найден');

    const rect = container.getBoundingClientRect();

    return {
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    };
  });

  await page.mouse.move(centerX, centerY);

  const steps = 50;
  const delta = 1000;

  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel({ deltaY: delta });
    await page.mouse.wheel({ deltaX: delta });
    await page.mouse.click(centerX, centerY);
    await collectMetrics(page, metrics);
    await wait(5);
  }

  return metrics;
};

function summarizeMetricsByPage(allMetrics) {
  const pageGroups = {};

  for (const { page, metrics } of allMetrics) {
    if (!pageGroups[page]) pageGroups[page] = [];
    pageGroups[page].push(...metrics);
  }

  const summary = [];

  for (const [page, metrics] of Object.entries(pageGroups)) {
    const avg = (key) => {
      const values = metrics.map((m) => m[key]).filter((v) => typeof v === 'number');
      const sum = values.reduce((acc, v) => acc + v, 0);

      return values.length > 0 ? sum / values.length : null;
    };

    summary.push({
      page,
      avgFPS: avg('fps')?.toFixed(2),
      avgMemoryMB: avg('memoryMB')?.toFixed(2),
      avgDOMNodes: avg('domNodes')?.toFixed(0),
      avgFCP: avg('fcp')?.toFixed(2),
      avgInputLatency: avg('unputLatency')?.toFixed(2)
    });
  }

  console.log('\nСредние значения метрик по каждой технологии:');
  console.table(summary);
}
