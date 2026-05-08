// Headless verification of single-spa lifecycle (bootstrap/mount/unmount)
// for MF-B. Loads the SystemJS bundle served on http://localhost:4202/main.js
// inside a JSDOM window, evaluates it through a minimal System.register shim,
// then calls each lifecycle function and asserts the DOM is mutated on mount
// and cleaned up on unmount.

import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const APP_NAME = '@mf/mf-b';
const BUNDLE_URL = 'http://localhost:4202/main.js';

const dom = new JSDOM(
  `<!doctype html><html><body>
     <div id="single-spa-application:${APP_NAME}"></div>
   </body></html>`,
  {
    url: 'http://localhost:4200/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
  }
);

const { window } = dom;
for (const key of [
  'window',
  'document',
  'HTMLElement',
  'Element',
  'Node',
  'getComputedStyle',
  'MessageChannel',
]) {
  if (window[key] !== undefined) globalThis[key] = window[key];
}

// Minimal System.register shim — captures the factory, runs it to collect
// the module exports.
const moduleExports = {};
window.System = {
  register(_deps, declare) {
    const exportFn = (nameOrObj, value) => {
      if (typeof nameOrObj === 'object') Object.assign(moduleExports, nameOrObj);
      else moduleExports[nameOrObj] = value;
    };
    const contextHook = { import: () => Promise.resolve({}), meta: { url: BUNDLE_URL } };
    const declared = declare(exportFn, contextHook);
    declared.execute();
  },
};

const bundleSource = await (await fetch(BUNDLE_URL)).text();
const scriptEl = window.document.createElement('script');
scriptEl.textContent = bundleSource;
window.document.body.appendChild(scriptEl);

const fail = (m) => { console.error('FAIL:', m); process.exit(1); };
if (typeof moduleExports.bootstrap !== 'function') fail('bootstrap missing');
if (typeof moduleExports.mount !== 'function') fail('mount missing');
if (typeof moduleExports.unmount !== 'function') fail('unmount missing');
console.log('OK  exports: bootstrap, mount, unmount');

const props = { name: APP_NAME, singleSpa: {}, mountParcel: () => {} };

await moduleExports.bootstrap(props);
console.log('OK  bootstrap()');

await moduleExports.mount(props);
const container = window.document.getElementById(`single-spa-application:${APP_NAME}`);
const titleText = container?.textContent || '';
if (!titleText.includes('MF-B')) fail('mount() rendered without MF-B title');
if (!container.children.length) fail('mount() did not insert any DOM');
console.log('OK  mount()  rendered React tree with MF-B content');

await moduleExports.unmount(props);
const remaining = container.children.length;
const remainingText = (container.textContent || '').trim();
if (remaining > 0 || remainingText.includes('MF-B')) {
  fail(`unmount() did not clear DOM (children=${remaining}, text="${remainingText}")`);
}
console.log('OK  unmount() cleaned DOM');

console.log('\nALL LIFECYCLE CHECKS PASSED');
process.exit(0);
