const toc = document.querySelector('#article-toc');
const headings = [...document.querySelectorAll('.prose h2, .prose h3')].filter(heading => heading.id);
if (toc && headings.length) {
  const list = document.createElement('ul');
  for (const heading of headings) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    if (heading.tagName === 'H3') item.classList.add('toc-subsection');
    item.append(link);
    list.append(item);
  }
  toc.append(list);
  toc.hidden = false;

  const links = [...list.querySelectorAll('a')];
  let activeIndex = -1;
  let scheduled = false;
  const updateCurrentSection = () => {
    scheduled = false;
    // Match the heading scroll offset; the last heading passed owns the section.
    const offset = parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 24;
    let nextIndex = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= offset + 1) nextIndex = index;
    });
    // At the bottom, the final section may be too short to reach the top.
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      nextIndex = headings.length - 1;
    }
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;
    links.forEach((link, index) => {
      if (index === activeIndex) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    // Keep the active entry visible within long, independently scrolling indexes.
    if (toc.scrollHeight > toc.clientHeight && getComputedStyle(toc).position === 'sticky') {
      const link = links[activeIndex];
      const bounds = toc.getBoundingClientRect();
      const itemBounds = link.getBoundingClientRect();
      if (itemBounds.top < bounds.top) toc.scrollTop -= bounds.top - itemBounds.top + 8;
      else if (itemBounds.bottom > bounds.bottom) toc.scrollTop += itemBounds.bottom - bounds.bottom + 8;
    }
  };
  const scheduleUpdate = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateCurrentSection);
    }
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  new ResizeObserver(scheduleUpdate).observe(document.querySelector('.prose'));
  updateCurrentSection();
}
