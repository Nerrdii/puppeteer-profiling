const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto('http://localhost:4200');
  await page.setViewport({ width: 1440, height: 714 });

  await navigationPromise;
  await page.waitForSelector(selector);
  await page.tracing.start({
    path: `out/user-trace-${Date.now()}.json`,
    screenshots: true,
  });
  const selector = '#posts';
  await page.click(selector);
  await page.tracing.stop();

  await browser.close();
})();
