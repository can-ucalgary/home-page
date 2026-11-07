import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { transformWithOxc } from 'vite';

const errors = [];
for (const page of ['index.html', 'events/index.html', 'benefits/index.html']) {
  const html = readFileSync(page, 'utf8');
  if (!html.includes('id="root"') || !/<script type="module"/.test(html)) errors.push(page + ': missing React entry');
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(page + ': missing title');
  for (const [, value] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (!/^(https?:|mailto:|#)/.test(value) && !existsSync(resolve(dirname(page), value))) errors.push(page + ': missing ' + value);
  }
}
function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? sourceFiles(directory + '/' + entry.name) : [directory + '/' + entry.name]);
}
for (const file of sourceFiles('src').filter(file => /\.(jsx|js)$/.test(file))) {
  const code = readFileSync(file, 'utf8');
  try { await transformWithOxc(code, file); } catch (error) { errors.push(file + ': ' + error.message); }
  for (const [, imported] of code.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
    if (!existsSync(resolve(dirname(file), imported))) errors.push(file + ': missing import ' + imported);
  }
}
const validDate = value => value === null || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value);
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
function validURL(value, protocols) {
  try { return protocols.includes(new URL(value, 'https://example.invalid/').protocol); }
  catch { return false; }
}
function validLocalImage(value) {
  if (!nonEmpty(value) || !value.startsWith('assets/') || !existsSync(resolve(value))) return false;
  const bytes = readFileSync(value);
  return bytes.length > 8 && (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255));
}
for (const name of ['events', 'partners']) {
  try {
    const items = JSON.parse(readFileSync(`data/${name}.json`, 'utf8'));
    if (!Array.isArray(items)) throw new Error('Expected an array');
    items.forEach((item, index) => {
      if (name === 'events') {
        if (![item.title, item.category, item.description].every(nonEmpty) || !validDate(item.date)) throw new Error(`Invalid event at index ${index}`);
        if (item.url !== null && (!nonEmpty(item.url) || !validURL(item.url, ['https:', 'http:', 'mailto:']))) throw new Error(`Invalid event URL at index ${index}`);
        if (item.poster && !validLocalImage(item.poster)) throw new Error(`Invalid local event poster at index ${index}`);
      } else {
        if (!nonEmpty(item.name) || !validLocalImage(item.logo) || (item.image && !validLocalImage(item.image))) throw new Error(`Invalid partner name or local image at index ${index}`);
        if (item.url !== null && (!nonEmpty(item.url) || !validURL(item.url, ['https:', 'http:']))) throw new Error(`Invalid partner URL at index ${index}`);
      }
    });
  } catch (error) { errors.push(`${name}.json: ${error.message}`); }
}
try {
  const { pass, merchants } = JSON.parse(readFileSync('data/benefits.json', 'utf8'));
  if (!pass || !nonEmpty(pass.title) || !nonEmpty(pass.description) || !validLocalImage(pass.image) || !validURL(pass.purchaseUrl, ['https:']) || !validDate(pass.validFrom) || !validDate(pass.validUntil) || !pass.validFrom || !pass.validUntil || pass.validUntil < pass.validFrom || !Number.isInteger(pass.year) || !nonEmpty(pass.instructions) || !Array.isArray(pass.eligibility) || !pass.eligibility.every(nonEmpty) || !Array.isArray(merchants)) throw new Error('Invalid pass information');
  merchants.forEach((item, index) => {
    if (!nonEmpty(item.name) || !nonEmpty(item.category) || !nonEmpty(item.discount) || !validLocalImage(item.image)) throw new Error(`Invalid merchant or image at index ${index}`);
    for (const field of ['website', 'mapUrl']) if (item[field] !== null && (!nonEmpty(item[field]) || !validURL(item[field], ['http:', 'https:']))) throw new Error(`Invalid merchant ${field} at index ${index}`);
  });
} catch (error) { errors.push(`Benefits/assets: ${error.message}`); }
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Passed: React entrypoints, component syntax/imports, local images, and JSON content validation.');
