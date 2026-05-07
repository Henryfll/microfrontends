import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from './App';

let root: Root | null = null;

export function mount(element: HTMLElement): void {
  root = createRoot(element);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export function unmount(_element: HTMLElement): void {
  if (root) {
    root.unmount();
    root = null;
  }
}
