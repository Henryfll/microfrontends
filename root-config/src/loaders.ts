import type { LifeCycles } from 'single-spa';

declare global {
  interface Window {
    System: { import: (name: string) => Promise<unknown> };
    'mf-a'?: LifeCycles;
  }
}

const ANGULAR_MF_URL = 'http://localhost:4201/main.js';
let angularLoadPromise: Promise<LifeCycles> | null = null;

export const loadAngularMF = (): Promise<LifeCycles> => {
  if (window['mf-a']) return Promise.resolve(window['mf-a']);
  if (angularLoadPromise) return angularLoadPromise;

  angularLoadPromise = new Promise<LifeCycles>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = ANGULAR_MF_URL;
    script.onload = () => {
      const lifecycles = window['mf-a'];
      if (!lifecycles) {
        reject(new Error(`window["mf-a"] not exposed by ${ANGULAR_MF_URL}`));
        return;
      }
      resolve(lifecycles);
    };
    script.onerror = () => reject(new Error(`Failed to load ${ANGULAR_MF_URL}`));
    document.head.appendChild(script);
  });

  return angularLoadPromise;
};

export const loadSystemMF = (name: string): Promise<LifeCycles> =>
  window.System.import(name) as Promise<LifeCycles>;
