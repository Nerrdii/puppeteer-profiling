const puppeteer = require('puppeteer');

const isUrl = require('./utils/is-url');

const countObjects = async (page, prototype) => {
  const prototypeHandle = await page.evaluateHandle((p) => eval(p), prototype);
  const objectsHandle = await page.queryObjects(prototypeHandle);
  const result = await page.evaluate((instances) => {
    return {
      count: instances.length,
      objects: _.countBy(instances, (instance) => instance.constructor.name),
    };
  }, objectsHandle);

  await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()]);

  return result;
};

(async () => {
  const url = process.argv[2];

  if (!url) {
    console.log('Must include url to test');
    process.exit(1);
  }

  if (!isUrl(url)) {
    console.log('Must be a valid url');
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto(url);

  await navigationPromise;

  await page.waitForSelector('#home');

  const numberOfObjects = await countObjects(page, 'rxjs.Subscriber.prototype');
  console.log('Before', numberOfObjects);

  await page.evaluate(async () => {
    for (let i = 0; i < 7; i++) {
      let selector = '#memoryLeak';
      document.querySelector(selector).click();

      selector = '#home';
      document.querySelector(selector).click();
    }
  });

  const numberOfObjectsAfter = await countObjects(
    page,
    'rxjs.Subscriber.prototype'
  );
  console.log('After', numberOfObjectsAfter);

  await browser.close();
})();
