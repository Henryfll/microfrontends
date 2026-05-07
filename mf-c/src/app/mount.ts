import { createApp } from 'vue';
import AppComponent from './App.vue';

let app: ReturnType<typeof createApp> | null = null;

export function mount(element: HTMLElement): void {
  app = createApp(AppComponent);
  app.mount(element);
}

export function unmount(_element: HTMLElement): void {
  if (app) {
    app.unmount();
    app = null;
  }
}
