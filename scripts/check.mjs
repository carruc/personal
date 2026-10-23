import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { XMLValidator } from 'fast-xml-parser';

const root = path.resolve(process.argv[2] || '_site');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk(root);
const pages = files.filter(file => file.endsWith('.html') && !path.relative(root, file).startsWith('assets/'));
const canonicals = new Set();
async function exists(file) { try { return await stat(file); } catch { return null; } }
async function checkUrl(raw, from) {
  if (!raw || /^(https?:|mailto:|tel:|data:|\/\/)/.test(raw)) return;
  const current = '/' + path.relative(root, from).replaceAll(path.sep, '/').replace(/index\.html$/, '');
  const url = new URL(raw, `https://local.test${current}`);
  let target = path.join(root, decodeURIComponent(url.pathname));
  const info = await exists(target);
  if (info?.isDirectory()) target = path.join(target, 'index.html');
  assert.ok(await exists(target), `${path.relative(root, from)}: broken URL ${raw}`);
  if (url.hash && target.endsWith('.html')) {
    const $ = load(await readFile(target, 'utf8'));
    assert.ok($('[id]').toArray().some(el => $(el).attr('id') === decodeURIComponent(url.hash.slice(1))), `Missing anchor ${raw}`);
  }
}
for (const file of pages) {
  const $ = load(await readFile(file, 'utf8'));
  assert.ok($('title').text().trim(), `Missing title: ${file}`);
  assert.ok($('meta[name="description"]').attr('content'), `Missing description: ${file}`);
  const canonical = $('link[rel="canonical"]').attr('href');
  const refresh = $('meta[http-equiv="refresh"]').attr('content');
  if (refresh) {
    const target = refresh.match(/^0; url=(\/[^;]+)$/)?.[1];
    assert.ok(target, `Invalid redirect: ${file}`);
    await checkUrl(target, file);
    assert.equal(canonical, new URL(target, canonical).href, `Redirect canonical mismatch: ${file}`);
  } else {
    assert.ok(canonical && !canonicals.has(canonical), `Missing or duplicate canonical: ${file}`);
    canonicals.add(canonical);
  }
  for (const el of $('[href], [src]').toArray()) {
    await checkUrl($(el).attr('href') || $(el).attr('src'), file);
  }
}
// Check fonts and images referenced by the CSS actually loaded by the site.
for (const css of ['assets/stylesheets/main_free.css', 'assets/stylesheets/site.css']) {
  const file = path.join(root, css);
  for (const match of (await readFile(file, 'utf8')).matchAll(/url\(["']?([^"')]+)["']?\)/g)) await checkUrl(match[1], file);
}
for (const name of ['feed.xml', 'sitemap.xml']) {
  assert.equal(XMLValidator.validate(await readFile(path.join(root, name), 'utf8')), true, `${name} must be valid XML`);
}
for (const name of ['src', 'node_modules', 'examples', 'scripts', 'package.json', 'README.md']) assert.equal(await exists(path.join(root, name)), null, `Source leaked: ${name}`);
console.log(`Checked ${pages.length} HTML pages, links, stylesheet assets, XML, and deployment isolation.`);
