# puppeteer-profiling

## Lighthouse Report

### Install http-server globally

`npm i -g http-server`

### Build Angular app and serve

`ng build && http-server dist/simple-app --proxy http://localhost:8080?`

### Run script

`node lighthouse-report.js`

Output will be generated in `out/` and can be opened in browser.

To change performance score, go to `memory-leak.component.ts` and comment/uncomment code in `ngOnInit`. Repeat the above steps to view difference.
