import puppeteer from 'puppeteer';

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

  for (let i = 1; i < headerLinks.length; i++) {
    const { href, text } = headerLinks[i];

    console.log(`Переход по: [${text}] ${href}`);

    await collectPageMetrics(page, href);
    await wait(500);
  }

  await browser.close();
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
      firstRender: getNumber('first-render-time')
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
    await collectMetrics(page, metrics);
    await wait(5);
  }

  console.log(`Метрики для "${href}":`);
  console.table(metrics);
};
