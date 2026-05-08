// Headless verification of single-spa lifecycle (bootstrap/mount/unmount).
// Loads the UMD bundle served on http://localhost:4201/main.js inside a JSDOM
// window, then calls each lifecycle function and asserts the DOM is mutated
// on mount and cleaned up on unmount.

import { JSDOM, ResourceLoader } from 'jsdom';

const APP_NAME = '@mf/mf-a';
const BUNDLE_URL = 'http://localhost:4201/main.js';

const dom = new JSDOM(
  `<!doctype html><html><body>
     <div id="single-spa-application:${APP_NAME}"></div>
   </body></html>`,
  {
    url: 'http://localhost:4200/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: new ResourceLoader(),
  }
);

const { window } = dom;
// Mirror the JSDOM window onto globalThis (skip read-only props like navigator).
for (const key of [
  'window',
  'document',
  'HTMLElement',
  'Element',
  'Node',
  'getComputedStyle',
]) {
  globalThis[key] = window[key];
}

const bundleSource = await (await fetch(BUNDLE_URL)).text();
const scriptEl = window.document.createElement('script');
scriptEl.textContent = bundleSource;
window.document.body.appendChild(scriptEl);

// UMD with libraryName 'mf-a' attaches the exports to window['mf-a']
const lifecycles = window['mf-a'];
if (!lifecycles) throw new Error('UMD library window["mf-a"] not exposed');

const fail = (m) => { console.error('FAIL:', m); process.exit(1); };
if (typeof lifecycles.bootstrap !== 'function') fail('bootstrap missing');
if (typeof lifecycles.mount !== 'function') fail('mount missing');
if (typeof lifecycles.unmount !== 'function') fail('unmount missing');
console.log('OK  exports: bootstrap, mount, unmount');

const props = { name: APP_NAME, singleSpa: {}, mountParcel: () => {} };

await lifecycles.bootstrap(props);
console.log('OK  bootstrap()');

await lifecycles.mount(props);
const container = window.document.getElementById(`single-spa-application:${APP_NAME}`);
const root = container?.querySelector('app-root');
if (!root) fail('mount() did not insert <app-root>');
const titleText = container.textContent || '';
if (!titleText.includes('MF-A')) fail('mount() rendered without MF-A title');
console.log('OK  mount()  rendered <app-root> with content');

await lifecycles.unmount(props);
const stillThere = container.querySelector('app-root');
if (stillThere && stillThere.innerHTML.trim().length > 0) {
  fail('unmount() did not clear app DOM');
}
console.log('OK  unmount() cleaned DOM');

console.log('\nALL LIFECYCLE CHECKS PASSED');
process.exit(0);
