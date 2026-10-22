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
