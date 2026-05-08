import {
  mergeApplicationConfig,
  provideZonelessChangeDetection,
  type ApplicationConfig,
} from '@angular/core';
import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';
import { singleSpaAngular } from 'single-spa-angular';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { singleSpaProps } from './single-spa/single-spa-props';

const singleSpaConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection()],
};

const lifecycles = singleSpaAngular({
  bootstrapFunction: (props) => {
    singleSpaProps.set(props);
    const platformRef = platformBrowser();
    return bootstrapApplication(App, mergeApplicationConfig(appConfig, singleSpaConfig), {
      platformRef,
    });
  },
  NgZone: 'noop',
  template: '<app-root />',
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
