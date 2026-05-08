import { h, createApp } from 'vue';
import singleSpaVue from 'single-spa-vue';
import App from './app/App.vue';
import './styles.css';

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(App),
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
