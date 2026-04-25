import { createApplication } from '@angular/platform-browser';
import { ApplicationRef, createComponent, EnvironmentInjector, Type } from '@angular/core';
import { App } from '../app';
import { appConfig } from '../app.config';

let appRefPromise: Promise<ApplicationRef> | null = null;

function ensureApp(): Promise<ApplicationRef> {
  if (!appRefPromise) {
    appRefPromise = createApplication(appConfig);
  }
  return appRefPromise;
}

export async function mount(element: HTMLElement): Promise<() => void> {
  const appRef = await ensureApp();
  const componentRef = createComponent(App as Type<unknown>, {
    environmentInjector: appRef.injector as EnvironmentInjector,
    hostElement: element,
  });
  appRef.attachView(componentRef.hostView);
  return () => {
    appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  };
}

export { App, appConfig };
