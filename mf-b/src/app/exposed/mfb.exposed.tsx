import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from '../App';
import '../../styles.css';

export function mount(element: HTMLElement): () => void {
  const root: Root = createRoot(element);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return () => {
    root.unmount();
  };
}

export { App };
