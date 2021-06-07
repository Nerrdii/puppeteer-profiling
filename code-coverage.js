const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Gather coverage for JS and CSS files
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ]);

  await page.goto('http://localhost:4200');

  // Stops the coverage gathering
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  pti.write([...jsCoverage, ...cssCoverage], {
    includeHostname: true,
    storagePath: './.nyc_output',
  });

  await browser.close();
})();
