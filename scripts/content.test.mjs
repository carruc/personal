import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, symlink, writeFile, readFile, rm, access, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'cheerio';

const repo = process.cwd();
const cli = path.join(repo, 'node_modules/@11ty/eleventy/cmd.cjs');
test('production and preview content flows', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'personal-site-'));
  const read = file => readFile(path.join(dir, '_site', file), 'utf8');
  const build = (preview = false) => execFileSync(process.execPath, [cli], { cwd: dir, env: { ...process.env, SITE_PREVIEW: preview ? '1' : '0' }, stdio: 'pipe' });
  try {
    await cp(path.join(repo, 'src'), path.join(dir, 'src'), { recursive: true });
    await cp(path.join(repo, 'lib'), path.join(dir, 'lib'), { recursive: true });
    await cp(path.join(repo, 'scripts'), path.join(dir, 'scripts'), { recursive: true });
    await cp(path.join(repo, 'eleventy.config.js'), path.join(dir, 'eleventy.config.js'));
    await writeFile(path.join(dir, 'package.json'), '{"type":"module"}');
    for (const name of ['node_modules', 'assets', 'CNAME']) await symlink(path.join(repo, name), path.join(dir, name));
    await rm(path.join(dir, 'src/legacy'), { recursive: true, force: true });
    for (const file of await readdir(path.join(dir, 'src/articles'))) {
      if (file.endsWith('.md')) await rm(path.join(dir, 'src/articles', file));
    }
    for (const file of await readdir(path.join(dir, 'src/research'))) {
      if (file.endsWith('.md')) await rm(path.join(dir, 'src/research', file));
    }
    build();
    assert.match(await read('articles/index.html'), /No articles published yet/);
    assert.match(await read('research/index.html'), /No research or projects published yet/);
    const article = (title, date, draft = false) => `---\ntitle: "${title}"\nsummary: "A summary with & and <characters>"\ndate: ${date}\ndraft: ${draft}\ntoc: true\nmath: true\n---\n## A heading\n\nText.\n\n\`\`\`python\nprint('hello')\n\`\`\`\n`;
    await writeFile(path.join(dir, 'src/articles/older.md'), article('Older article', '2025-01-01'));
    await writeFile(path.join(dir, 'src/articles/newer.md'), article('Newer & very long article title '.repeat(4), '2026-01-01'));
    await writeFile(path.join(dir, 'src/articles/private.md'), article('Private draft', '2026-02-01', true));
    await writeFile(path.join(dir, 'src/research/listing.md'), '---\ntitle: Listing project\nsummary: Short description\nlinks:\n  code: https://github.com/carruc\n---\n');
    await writeFile(path.join(dir, 'src/research/detail.md'), '---\ntitle: Detailed project\nsummary: Short description\n---\n## Overview\n\nProject details.\n');
    await writeFile(path.join(dir, 'src/research/private.md'), '---\ntitle: Private research\nsummary: Hidden\ndraft: true\n---\nDetails.\n');
    build();
    const listing = await read('articles/index.html');
    assert.ok(listing.indexOf('Newer &amp;') < listing.indexOf('Older article'));
    assert.doesNotMatch(listing, /Private draft/);
    await assert.rejects(access(path.join(dir, '_site/articles/private/index.html')));
    await assert.rejects(access(path.join(dir, '_site/research/private/index.html')));
    const research = load(await read('research/index.html'));
    assert.equal(research('a[href="/research/listing/"]').length, 0);
    assert.equal(research('a[href="/research/detail/"]').length, 1);
    const detail = await read('articles/newer/index.html');
    assert.match(detail, /id="a-heading"/);
    assert.match(detail, /token keyword/);
    assert.match(detail, /mathjax@3/);
    assert.doesNotMatch(await read('index.html'), /mathjax@3|toc\.js/);
    for (const xml of ['feed.xml', 'sitemap.xml']) assert.doesNotMatch(await read(xml), /private/);
    execFileSync(process.execPath, [path.join(repo, 'scripts/check.mjs'), path.join(dir, '_site')], { stdio: 'pipe' });
    build(true);
    assert.match(await read('articles/private/index.html'), /Draft · local preview/);
    assert.match(await read('research/private/index.html'), /Private research/);
    for (const xml of ['feed.xml', 'sitemap.xml']) assert.doesNotMatch(await read(xml), /private/);
    const staleDirectory = path.join(dir, '_site/assets/stale/nested');
    await mkdir(staleDirectory, { recursive: true });
    await writeFile(path.join(staleDirectory, 'removed.txt'), 'Stale output');
    execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: dir, stdio: 'pipe' });
    await assert.rejects(access(path.join(dir, '_site/assets/stale')));
    await assert.rejects(access(path.join(dir, '_site/articles/private/index.html')));
    await assert.rejects(access(path.join(dir, '_site/research/private/index.html')));
    await writeFile(path.join(dir, 'src/articles/no-date.md'), '---\ntitle: Missing date\nsummary: Needs a date\n---\nText');
    assert.throws(() => build());
    await rm(path.join(dir, 'src/articles/no-date.md'));
    // Invalid published content must fail rather than silently generating incomplete pages.
    await writeFile(path.join(dir, 'src/articles/invalid.md'), '---\ntitle: Incomplete\n---\nText');
    assert.throws(() => build());
  } finally { await rm(dir, { recursive: true, force: true }); }
});
