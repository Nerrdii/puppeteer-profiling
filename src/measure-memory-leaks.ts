import { resolve } from 'path';
import { launch } from 'puppeteer';

import Config from './common/config';
import { default as SimpleParser } from './lib/heap-snapshot-parser';

(async () => {
  const configFileSource = resolve(process.argv[2]);
  const config = Config.FromSource(configFileSource);
  const { url, iterations, steps, timeout } = config;

  const browser = await launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  const navigationPromise = page.waitForNavigation();
  await page.goto(url);

  await navigationPromise;

  const parser = new SimpleParser(client);

  const first = await parser.takeSnapshot();

  for (let i = 0; i < iterations; i++) {
    for (const step of steps) {
      await new Promise<void>(async (resolve, reject) => {
        const interval = setInterval(async () => {
          const result = await page.evaluate(step.check);
          if (result) {
            clearInterval(interval);
            await page.evaluate(step.next);
            resolve();
          }
        }, timeout);
      });
    }
  }

  const second = await parser.takeSnapshot();

  const diffs = parser.compare(first, second);

  console.table(diffs);

  await browser.close();
})();
