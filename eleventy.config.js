import rss from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import anchor from 'markdown-it-anchor';
import { readFileSync } from 'node:fs';

export default function (config) {
  const preview = process.env.ELEVENTY_RUN_MODE === 'serve' || process.env.SITE_PREVIEW === '1';
  config.setNunjucksEnvironmentOptions({ autoescape: true });
  config.addPlugin(rss);
  config.addPlugin(syntaxHighlight);
  config.amendLibrary('md', md => md.use(anchor));
  config.addPassthroughCopy('assets');
  config.addPassthroughCopy('CNAME');
  config.addFilter('isoDate', value => new Date(value).toISOString());
  config.addFilter('displayDate', value => new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value)));
  config.addFilter('absolute', (path, base) => new URL(path, base).href);
  config.addGlobalData('preview', preview);
  for (const kind of ['articles', 'research']) {
    config.addCollection(kind, api => api.getFilteredByGlob(`src/${kind}/*.md`)
      .filter(item => preview || !item.data.draft)
      .sort((a, b) => b.date - a.date || a.fileSlug.localeCompare(b.fileSlug)));
  }
  config.addPreprocessor('validate-content', 'md', (data) => {
    if (!['articles', 'research'].some(kind => data.page.inputPath.startsWith(`./src/${kind}/`))) return;
    for (const key of ['title', 'summary']) {
      if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${data.page.inputPath}: missing ${key}`);
    }
    if (data.page.inputPath.startsWith('./src/articles/') && (!/^---\r?\n[\s\S]*?^date:\s*\S+/m.test(readFileSync(data.page.inputPath, 'utf8')) || !data.date || Number.isNaN(new Date(data.date).valueOf()))) throw new Error(`${data.page.inputPath}: valid date required`);
  });
  return { dir: { input: 'src', output: '_site' }, markdownTemplateEngine: 'njk', htmlTemplateEngine: 'njk' };
}
