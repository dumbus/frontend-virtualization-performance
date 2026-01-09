import puppeteer from 'puppeteer';

const parseArgs = () => {
  const args = process.argv.slice(2);
  const config = {
    repeatsCount: 1,
    visibleRows: null,
    visibleColumns: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    // Поддержка формата с = (-r=2, -vr=10)
    if (arg.includes('=')) {
      const [flag, value] = arg.split('=');
      const numValue = parseInt(value, 10);

      if ((flag === '--repeats' || flag === '-r') && !isNaN(numValue)) {
        config.repeatsCount = numValue;
        continue;
      } else if ((flag === '--visible-rows' || flag === '-vr') && !isNaN(numValue)) {
        config.visibleRows = numValue;
        continue;
      } else if ((flag === '--visible-columns' || flag === '-vc') && !isNaN(numValue)) {
        config.visibleColumns = numValue;
        continue;
      }
    }

    // Поддержка формата с раздельными аргументами (-r 2, -vr 10)
    if (arg === '--repeats' || arg === '-r') {
      if (nextArg && !isNaN(parseInt(nextArg, 10))) {
        config.repeatsCount = parseInt(nextArg, 10);
        i++;
      }
    } else if (arg === '--visible-rows' || arg === '-vr') {
      if (nextArg && !isNaN(parseInt(nextArg, 10))) {
        config.visibleRows = parseInt(nextArg, 10);
        i++;
      }
    } else if (arg === '--visible-columns' || arg === '-vc') {
      if (nextArg && !isNaN(parseInt(nextArg, 10))) {
        config.visibleColumns = parseInt(nextArg, 10);
        i++;
      }
    } else if (!isNaN(parseInt(arg, 10)) && i === 0) {
      // Поддержка старого формата: первый аргумент без флага = количество повторов
      config.repeatsCount = parseInt(arg, 10) || 1;
    }
  }

  return config;
};

const config = parseArgs();

console.log('Конфигурация теста:');
console.log(`  Количество повторов: ${config.repeatsCount}`);
console.log(`  Количество видимых рядов: ${config.visibleRows !== null ? config.visibleRows : 'по умолчанию (20)'}`);
console.log(
  `  Количество видимых столбцов: ${config.visibleColumns !== null ? config.visibleColumns : 'по умолчанию (20)'}`
);
console.log('');

// TODO: Добавить возможность тестировать одну технологию на разных настройках
// TODO: Добавить визуальное сравнение технологий (графики)
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Установка настроек через localStorage перед началом тестирования
  if (config.visibleRows !== null || config.visibleColumns !== null) {
    await page.evaluate(
      (settings) => {
        const stored = JSON.parse(localStorage.getItem('gridSettings') || '{}');
        const updated = {
          ...stored,
          ...(settings.visibleRows !== null && { visibleRowCount: settings.visibleRows }),
          ...(settings.visibleColumns !== null && { visibleColumnCount: settings.visibleColumns })
        };
        localStorage.setItem('gridSettings', JSON.stringify(updated));
      },
      { visibleRows: config.visibleRows, visibleColumns: config.visibleColumns }
    );

    // Перезагружаем страницу, чтобы применить настройки
    await page.reload({ waitUntil: 'networkidle0' });
    console.log('Настройки применены через localStorage\n');
  }

  const headerLinks = await page.$$eval('.menu-link', (links) =>
    links.map((link) => ({
      text: (link.textContent || '').trim(),
      href: link.getAttribute('href')
    }))
  );

  const allMetrics = [];

  for (let repeat = 1; repeat <= config.repeatsCount; repeat++) {
    console.log(`\nПовтор ${repeat} из ${config.repeatsCount}`);

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
  const delta = 500;

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
  const summaryNumeric = [];

  for (const [page, metrics] of Object.entries(pageGroups)) {
    const avg = (key) => {
      const values = metrics.map((m) => m[key]).filter((v) => typeof v === 'number');
      const sum = values.reduce((acc, v) => acc + v, 0);

      return values.length > 0 ? sum / values.length : null;
    };

    const avgFPS = avg('fps');
    const avgMemoryMB = avg('memoryMB');
    const avgDOMNodes = avg('domNodes');
    const avgFCP = avg('fcp');
    const avgInputLatency = avg('unputLatency');

    summary.push({
      page,
      avgFPS: avgFPS?.toFixed(2),
      avgMemoryMB: avgMemoryMB?.toFixed(2),
      avgDOMNodes: avgDOMNodes?.toFixed(0),
      avgFCP: avgFCP?.toFixed(2),
      avgInputLatency: avgInputLatency?.toFixed(2)
    });

    summaryNumeric.push({
      page,
      avgFPS,
      avgMemoryMB,
      avgDOMNodes,
      avgFCP,
      avgInputLatency
    });
  }

  console.log('\nСредние значения метрик по каждой технологии:');
  console.table(summary);

  // Расчет BIPI (BI Performance Index)
  calculateAndDisplayBIPI(summaryNumeric);
}

function calculateAndDisplayBIPI(summary) {
  // Весовые коэффициенты
  const weights = {
    fps: 0.25,
    inputLatency: 0.25,
    memoryMB: 0.2,
    domNodes: 0.2,
    fcp: 0.1
  };

  // min и max значения каждой метрики
  const ranges = {
    fps: { min: Infinity, max: -Infinity },
    inputLatency: { min: Infinity, max: -Infinity },
    memoryMB: { min: Infinity, max: -Infinity },
    domNodes: { min: Infinity, max: -Infinity },
    fcp: { min: Infinity, max: -Infinity }
  };

  for (const item of summary) {
    if (item.avgFPS != null) {
      ranges.fps.min = Math.min(ranges.fps.min, item.avgFPS);
      ranges.fps.max = Math.max(ranges.fps.max, item.avgFPS);
    }

    if (item.avgInputLatency != null) {
      ranges.inputLatency.min = Math.min(ranges.inputLatency.min, item.avgInputLatency);
      ranges.inputLatency.max = Math.max(ranges.inputLatency.max, item.avgInputLatency);
    }

    if (item.avgMemoryMB != null) {
      ranges.memoryMB.min = Math.min(ranges.memoryMB.min, item.avgMemoryMB);
      ranges.memoryMB.max = Math.max(ranges.memoryMB.max, item.avgMemoryMB);
    }

    if (item.avgDOMNodes != null) {
      ranges.domNodes.min = Math.min(ranges.domNodes.min, item.avgDOMNodes);
      ranges.domNodes.max = Math.max(ranges.domNodes.max, item.avgDOMNodes);
    }

    if (item.avgFCP != null) {
      ranges.fcp.min = Math.min(ranges.fcp.min, item.avgFCP);
      ranges.fcp.max = Math.max(ranges.fcp.max, item.avgFCP);
    }
  }

  // Нормализация и расчет BIPI
  const bipiResults = [];

  for (const item of summary) {
    let bipi = 0;

    if (item.avgFPS != null && ranges.fps.max !== ranges.fps.min) {
      const normalized = (item.avgFPS - ranges.fps.min) / (ranges.fps.max - ranges.fps.min);
      bipi += weights.fps * normalized;
    }

    if (item.avgInputLatency != null && ranges.inputLatency.max !== ranges.inputLatency.min) {
      const normalized =
        (ranges.inputLatency.max - item.avgInputLatency) / (ranges.inputLatency.max - ranges.inputLatency.min);
      bipi += weights.inputLatency * normalized;
    }

    if (item.avgMemoryMB != null && ranges.memoryMB.max !== ranges.memoryMB.min) {
      const normalized = (ranges.memoryMB.max - item.avgMemoryMB) / (ranges.memoryMB.max - ranges.memoryMB.min);
      bipi += weights.memoryMB * normalized;
    }

    if (item.avgDOMNodes != null && ranges.domNodes.max !== ranges.domNodes.min) {
      const normalized = (ranges.domNodes.max - item.avgDOMNodes) / (ranges.domNodes.max - ranges.domNodes.min);
      bipi += weights.domNodes * normalized;
    }

    if (item.avgFCP != null && ranges.fcp.max !== ranges.fcp.min) {
      const normalized = (ranges.fcp.max - item.avgFCP) / (ranges.fcp.max - ranges.fcp.min);
      bipi += weights.fcp * normalized;
    }

    bipiResults.push({
      page: item.page,
      bipi: bipi
    });
  }

  // Сортиовка по убыванию BIPI
  bipiResults.sort((a, b) => b.bipi - a.bipi);

  console.log('\nBI Performance Index (BIPI):');
  const bipiTable = bipiResults.map((item) => ({
    page: item.page,
    bipi: item.bipi.toFixed(4)
  }));

  console.table(bipiTable);
}
