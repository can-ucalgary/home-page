import { cp, writeFile } from 'node:fs/promises';
import { build } from 'vite';

// Vite empties dist/ and builds three real HTML entrypoints for GitHub Pages.
await build();
// Keep existing editable content and image paths; no duplicate public/ tree.
await cp('assets', 'dist/assets', { recursive: true });
await cp('data', 'dist/data', { recursive: true });
await writeFile('dist/.nojekyll', '');
console.log('React website ready in dist/ (home, events, and benefits).');
