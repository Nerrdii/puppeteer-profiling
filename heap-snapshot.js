const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  await page.goto('http://localhost:4200');

  let chunks = [];
  client.on('HeapProfiler.addHeapSnapshotChunk', ({ chunk }) => {
    chunks.push(chunk);
  });

  await client.send('HeapProfiler.takeHeapSnapshot', { reportProgress: false });

  writeToFile(chunks.join(''));

  for (let i = 0; i < 6; i++) {
    let selector = '#memoryLeak';
    await page.waitForSelector(selector);
    await page.click(selector);

    await page.waitForTimeout(100);

    selector = '#home';
    await page.waitForSelector(selector);
    await page.click(selector);
  }

  chunks = [];
  await client.send('HeapProfiler.takeHeapSnapshot', { reportProgress: false });

  writeToFile(chunks.join(''));

  await client.detach();
  await browser.close();
})();

const writeToFile = (response) => {
  const filename = `out/snapshot-${Date.now()}.heapsnapshot`;
  fs.writeFileSync(filename, response);
};
