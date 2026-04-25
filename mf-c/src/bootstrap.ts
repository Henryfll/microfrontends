import { createApp } from 'vue';
import App from './app/App.vue';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

createApp(App).mount(container);
