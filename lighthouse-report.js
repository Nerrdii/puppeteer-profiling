const fs = require('fs');
const lighthouse = require('lighthouse');
const _ = require('lodash');
const chromeLauncher = require('chrome-launcher');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const isUrl = require('./utils/is-url');
const crawlSite = require('./utils/crawl-site');

const slugify = (url) => {
  return url.replace(/[:\/]/g, '_');
};

const options = {
  logLevel: 'info',
  disableDeviceEmulation: true,
  chromeFlags: ['--disable-mobile-emulation'],
};

async function lighthouseFromPuppeteer(url, options, config = null) {
  const { lhr } = await lighthouse(url, options, config);

  const html = reportGenerator.generateReport(lhr, 'html');
  fs.writeFile(`out/${slugify(url)}_${Date.now()}.html`, html, function (err) {
    if (err) throw err;
  });
}

(async () => {
  const baseUrl = process.argv[2];

  if (!baseUrl) {
    console.log('Must include url to test');
    process.exit(1);
  }

  if (!isUrl(baseUrl)) {
    console.log('Must be a valid url');
    process.exit(1);
  }

  const nestedValues = [];

  function getNestedValues(data, key) {
    for (let k in data) {
      if (typeof data[k] === 'object') {
        getNestedValues(data[k], key);
      } else {
        if (k === key) {
          nestedValues.push(data[k]);
        }
      }
    }
  }

  const data = await crawlSite(baseUrl);

  getNestedValues(data, 'url');
  const uniqUrls = _.uniq(nestedValues);
  console.log(uniqUrls);

  const chrome = await chromeLauncher.launch(options);
  options.port = chrome.port;

  for (const url of uniqUrls) {
    await lighthouseFromPuppeteer(url, options);
  }

  await chrome.kill();
})();
