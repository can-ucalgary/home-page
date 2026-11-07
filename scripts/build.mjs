import { mkdir, copyFile, cp, writeFile, rm } from 'node:fs/promises';

// Clear generated output so moved assets do not leave obsolete public files.
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(file, `dist/${file}`);
}
await cp('assets', 'dist/assets', { recursive: true });
await cp('data', 'dist/data', { recursive: true });
for (const page of ['events', 'benefits']) {
  await cp(page, `dist/${page}`, { recursive: true });
}
await writeFile('dist/.nojekyll', '');
console.log('Static site ready in dist/');
