import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';

// Used only at build time to prerender static HTML. Never deployed.
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
