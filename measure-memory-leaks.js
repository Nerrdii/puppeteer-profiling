const puppeteer = require('puppeteer');

// Helper by @chrisguttandin
const countObjects = async (page) => {
  const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
  const objectsHandle = await page.queryObjects(prototypeHandle);
  const numberOfObjects = await page.evaluate(
    (instances) => instances.length,
    objectsHandle
  );

  await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()]);

  return numberOfObjects;
};

(async () => {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto('http://localhost:4200/posts');

  await navigationPromise;

  const numberOfObjects = await countObjects(page);
  console.log(numberOfObjects);

  // let selector = '#serviceLeak';
  // await page.waitForSelector(selector);
  // await page.click(selector);

  // await page.waitForTimeout(1000);

  // selector = '#home';
  // await page.waitForSelector(selector);
  // await page.click(selector);

  const numberOfObjectsAfter = await countObjects(page);
  console.log(numberOfObjectsAfter);

  await context.close();

  // console.log(await countObjects(page));

  // Check if the number of retained objects is expected
  // expect(await countObjects(page)).to.equal(0);

  await browser.close();
})();
