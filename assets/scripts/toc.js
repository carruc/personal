const toc = document.querySelector('#article-toc');
const headings = [...document.querySelectorAll('.prose h2, .prose h3')].filter(heading => heading.id);
if (toc && headings.length) {
  const title = document.createElement('p');
  title.textContent = 'On this page';
  const list = document.createElement('ul');
  for (const heading of headings) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    item.append(link);
    list.append(item);
  }
  toc.append(title, list);
  toc.hidden = false;
}
