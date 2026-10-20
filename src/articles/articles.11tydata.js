export default {
  layout: 'detail.njk', section: 'articles',
  eleventyComputed: {
    permalink: data => data.draft && !data.preview ? false : `/articles/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: data => Boolean(data.draft && !data.preview)
  }
};
