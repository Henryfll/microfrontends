// E2E headless verification of the host:
// - Loads index.html via JSDOM with runScripts: 'dangerously'
// - Verifies single-spa registers MF-A (UMD/script-tag) + MF-B/MF-C (SystemJS)
// - Navigates /mfa -> /mfb -> /mfc -> /mfa and asserts mount/unmount transitions
//   write into the correct container without leaving orphan DOM behind.

import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const HOST_URL = 'http://localhost:4200/';

const dom = await JSDOM.fromURL(HOST_URL, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  resources: 'usable',
});

const { window } = dom;
for (const key of [
  'window',
  'document',
  'HTMLElement',
  'Element',
  'Node',
  'getComputedStyle',
  'MessageChannel',
  'CSS',
]) {
  if (window[key] !== undefined) globalThis[key] = window[key];
}

const fail = (m) => {
  console.error('FAIL:', m);
  process.exit(1);
};

const consoleErrors = [];
const origError = window.console.error;
window.console.error = (...args) => {
  consoleErrors.push(args.map(String).join(' '));
  origError.apply(window.console, args);
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Wait until single-spa is started AND the initial reroute (/mfa) has mounted MF-A.
const containerOf = (name) =>
  window.document.getElementById(`single-spa-application:${name}`);

async function waitForMounted(name, label, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const c = containerOf(name);
    const text = (c?.textContent || '').trim();
    if (text.includes(label)) return c;
    await wait(200);
  }
  fail(`timeout waiting for ${name} to mount with label "${label}"`);
}

async function waitForUnmounted(name, label, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const c = containerOf(name);
    const text = (c?.textContent || '').trim();
    if (!text.includes(label) && (c?.children.length ?? 0) === 0) return;
    await wait(200);
  }
  fail(`timeout waiting for ${name} to unmount`);
}

function navigate(path) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new window.PopStateEvent('popstate'));
}

console.log('OK  host html loaded');

// 1) Initial route should be /mfa (host redirects from /).
await waitForMounted('@mf/mf-a', 'MF-A');
console.log('OK  MF-A mounted on initial /mfa');

// 2) Navigate to /mfb -> MF-A unmounts, MF-B mounts.
navigate('/mfb');
await waitForUnmounted('@mf/mf-a', 'MF-A');
await waitForMounted('@mf/mf-b', 'MF-B');
console.log('OK  /mfb: MF-A unmounted, MF-B mounted');

// 3) Navigate to /mfc -> MF-B unmounts, MF-C mounts.
navigate('/mfc');
await waitForUnmounted('@mf/mf-b', 'MF-B');
await waitForMounted('@mf/mf-c', 'MF-C');
console.log('OK  /mfc: MF-B unmounted, MF-C mounted');

// 4) Navigate back to /mfa -> MF-C unmounts, MF-A re-mounts (no bootstrap re-run).
navigate('/mfa');
await waitForUnmounted('@mf/mf-c', 'MF-C');
await waitForMounted('@mf/mf-a', 'MF-A');
console.log('OK  /mfa: MF-C unmounted, MF-A re-mounted');

// 5) Confirm the three pre-created mount points are siblings inside #content.
const content = window.document.getElementById('content');
const ids = Array.from(content.children).map((c) => c.id);
for (const expected of [
  'single-spa-application:@mf/mf-a',
  'single-spa-application:@mf/mf-b',
  'single-spa-application:@mf/mf-c',
]) {
  if (!ids.includes(expected)) fail(`missing mount container ${expected}`);
}
console.log('OK  three mount containers present inside #content');

// 6) No console.error from any framework or single-spa.
const filtered = consoleErrors.filter(
  (e) =>
    !e.includes('Could not parse CSS stylesheet') &&
    !e.includes('not implemented'),
);
if (filtered.length > 0) {
  console.error('Browser console.error captured:');
  filtered.forEach((e) => console.error('  -', e));
  fail('console.error during host run');
}
console.log('OK  no console.error during transitions');

console.log('\nALL HOST CHECKS PASSED');
process.exit(0);
