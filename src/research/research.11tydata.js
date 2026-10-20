import { readFileSync } from 'node:fs';
export default {
  layout: 'detail.njk', section: 'research',
  eleventyComputed: {
    permalink: data => {
      const body = readFileSync(data.page.inputPath, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '').trim();
      return (data.draft && !data.preview) || !body ? false : `/research/${data.page.fileSlug}/`;
    }
  }
};
