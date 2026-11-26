// Build step: inject the server-rendered HTML into dist/index.html so the
// page is readable without JavaScript (search engines, link previews, speed).
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const indexPath = `${root}dist/index.html`;
const ssrDir = `${root}dist-ssr`;
const placeholder = '<!--app-html-->';

const { render } = await import(`${ssrDir}/entry-server.js`);
const template = await readFile(indexPath, 'utf8');

if (!template.includes(placeholder)) {
  throw new Error(`Placeholder ${placeholder} not found in dist/index.html`);
}

await writeFile(indexPath, template.replace(placeholder, render()));
await rm(ssrDir, { recursive: true, force: true });
console.log('Prerendered dist/index.html');
