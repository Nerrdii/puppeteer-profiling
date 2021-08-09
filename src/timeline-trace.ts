import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.tracing.start({
    path: `out/trace-${Date.now()}.json`,
    screenshots: true,
  });
  await page.goto('http://localhost:4200/posts');
  await page.tracing.stop();
  await browser.close();
})();
