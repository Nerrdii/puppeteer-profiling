const fs = require('fs');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

const chromeLauncher = require('chrome-launcher');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const request = require('request');
const util = require('util');

const options = {
  logLevel: 'info',
  disableDeviceEmulation: true,
  chromeFlags: ['--disable-mobile-emulation'],
};

async function lighthouseFromPuppeteer(url, options, config = null) {
  const chrome = await chromeLauncher.launch(options);
  options.port = chrome.port;

  const resp = await util.promisify(request)(
    `http://localhost:${options.port}/json/version`
  );
  const { webSocketDebuggerUrl } = JSON.parse(resp.body);
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });

  const { lhr } = await lighthouse(url, options, config);
  await browser.disconnect();
  await chrome.kill();

  const html = reportGenerator.generateReport(lhr, 'html');
  fs.writeFile(
    `out/lighthouse-report-${Date.now()}.html`,
    html,
    function (err) {
      if (err) throw err;
    }
  );
}

lighthouseFromPuppeteer('http://localhost:8080/memory-leak', options);
