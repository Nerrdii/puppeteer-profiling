const puppeteer = require('puppeteer');

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
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto('http://localhost:4200');

  await navigationPromise;

  await page.waitForSelector('#home');

  const numberOfObjects = await countObjects(page, 'rxjs.Subscriber.prototype');
  console.log(numberOfObjects);

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
  console.log(numberOfObjectsAfter);

  await browser.close();
})();
