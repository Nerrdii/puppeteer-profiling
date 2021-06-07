const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  await page.goto('http://localhost:4200');

  await client.send('HeapProfiler.enable');
  await client.send('HeapProfiler.startSampling');
  await client.send('HeapProfiler.takeHeapSnapshot', { reportProgress: true });
  // let response = await client.send('HeapProfiler.stopSampling');

  // writeToFile(response);

  // await client.send('HeapProfiler.startSampling');

  for (let i = 0; i < 6; i++) {
    let selector = '#serviceLeak';
    await page.waitForSelector(selector);
    await page.click(selector);

    await page.waitForTimeout(100);

    selector = '#home';
    await page.waitForSelector(selector);
    await page.click(selector);
  }

  const response = await client.send('HeapProfiler.stopSampling');

  writeToFile(response);

  await client.detach();
  await browser.close();
})();

const writeToFile = (response) => {
  const filename = `out/profile-${Date.now()}.heapprofile`;
  const string = JSON.stringify(response.profile, null, 2);
  fs.writeFileSync(filename, string);
};
