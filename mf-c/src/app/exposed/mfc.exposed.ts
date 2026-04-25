import { createApp, App as VueApp } from 'vue';
import App from '../App.vue';
import '../../styles.css';

export function mount(element: HTMLElement): () => void {
  const app: VueApp = createApp(App);
  app.mount(element);
  return () => {
    app.unmount();
  };
}

export { App };
