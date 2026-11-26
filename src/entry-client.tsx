import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

// The HTML is prerendered at build time (scripts/prerender.js);
// React only attaches to it here.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
);
