import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import headers from './security-headers.json' with { type: 'json' };

// security-headers.json is the single source of truth for HTTP security
// headers: CloudFront serves them in production (infra/cdn.tf) and
// `vite preview` serves the same ones, so the e2e tests catch any
// change that would break under the production policy.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    headers: {
      'Content-Security-Policy': headers.contentSecurityPolicy,
      'Referrer-Policy': headers.referrerPolicy,
      'Permissions-Policy': headers.permissionsPolicy,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  },
});
