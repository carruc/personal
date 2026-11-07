// Keep the profile column aligned with the rendered name, including font loading.
const name = document.querySelector('.site-name');
if (name && document.querySelector('.profile-sidebar')) {
  const alignProfile = () => {
    document.documentElement.style.setProperty('--profile-column-width', `${name.getBoundingClientRect().width}px`);
  };
  new ResizeObserver(alignProfile).observe(name);
  document.fonts.ready.then(alignProfile);
  alignProfile();
}

const bulletIcons = ['leaf', 'lily', 'hexagon', 'flower'];
for (const item of document.querySelectorAll('ul > li')) {
  if (getComputedStyle(item).listStyleType === 'none') continue;
  const icon = bulletIcons[Math.floor(Math.random() * bulletIcons.length)];
  item.style.listStyleImage = `url("/assets/figures/pond-${icon}.svg?v=3")`;
}
