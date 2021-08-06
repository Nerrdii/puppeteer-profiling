import { Page } from 'puppeteer';

export async function countObjects(page: Page, prototype: string) {
  const prototypeHandle = await page.evaluateHandle((p) => eval(p), prototype);
  const objectsHandle = await page.queryObjects(prototypeHandle);
  const result = await page.evaluate((instances) => {
    return instances.length;
  }, objectsHandle);

  await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()]);

  return result;
}
