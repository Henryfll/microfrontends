import 'zone.js';
import { ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';
import { appConfig } from './app.config';

let appRef: ApplicationRef | null = null;

export async function mount(element: HTMLElement): Promise<void> {
  const host = document.createElement('app-root');
  element.appendChild(host);
  appRef = await bootstrapApplication(App, appConfig);
}

export function unmount(_element: HTMLElement): void {
  if (appRef) {
    appRef.destroy();
    appRef = null;
  }
}
