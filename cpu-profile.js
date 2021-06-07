const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  await client.send('Profiler.enable');
  await client.send('Profiler.start');

  await page.goto('http://localhost:4200/posts');

  const response = await client.send('Profiler.stop');

  const filename = `out/profile-${Date.now()}.cpuprofile`;
  const string = JSON.stringify(response.profile, null, 2);
  fs.writeFileSync(filename, string);

  await client.detach();
  await browser.close();
})();
