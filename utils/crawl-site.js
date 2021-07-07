const puppeteer = require('puppeteer');

let BASE_URL;

const crawledPages = new Map();
const MAX_DEPTH = 2; // Subpage depth to crawl site.

function collectAllSameOriginAnchorsDeep(sameOrigin = true) {
  const allElements = [];

  const findAllElements = (nodes) => {
    for (let i = 0, el; (el = nodes[i]); ++i) {
      allElements.push(el);
      // If the element has a shadow root, dig deeper.
      if (el.shadowRoot) {
        findAllElements(el.shadowRoot.querySelectorAll('*'));
      }
    }
  };

  findAllElements(document.querySelectorAll('*'));

  const filtered = allElements
    .filter((el) => el.localName === 'a' && el.href) // element is an anchor with an href.
    .filter((el) => el.href !== location.href) // link doesn't point to page's own URL.
    .filter((el) => {
      if (sameOrigin) {
        return new URL(location.href).origin === new URL(el.href).origin;
      }
      return true;
    })
    .map((a) => a.href);

  return Array.from(new Set(filtered));
}

async function crawl(browser, page, depth = 0) {
  if (depth > MAX_DEPTH) {
    return;
  }

  // If we've already crawled the URL, we know its children.
  if (crawledPages.has(page.url)) {
    console.log(`Reusing route: ${page.url}`);
    const item = crawledPages.get(page.url);
    page.children = item.children;
    return;
  } else {
    console.log(`Loading: ${page.url}`);

    const newPage = await browser.newPage();
    await newPage.goto(page.url, { waitUntil: 'networkidle2' });

    let anchors = await newPage.evaluate(collectAllSameOriginAnchorsDeep);
    anchors = anchors.filter((a) => a !== BASE_URL); // link doesn't point to start url of crawl.

    page.children = anchors.map((url) => ({ url }));

    crawledPages.set(page.url, page); // cache it.

    await newPage.close();
  }

  // Crawl subpages.
  for (const childPage of page.children) {
    await crawl(browser, childPage, depth + 1);
  }
}

async function crawlSite(url) {
  BASE_URL = url;
  const browser = await puppeteer.launch();

  const root = { url, children: [] };
  await crawl(browser, root);

  await browser.close();

  return root;
}

module.exports = crawlSite;
