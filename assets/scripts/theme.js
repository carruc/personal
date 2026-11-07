(() => {
  const root = document.documentElement;
  const storageKey = 'site-theme';

  try {
    if (localStorage.getItem(storageKey) === 'dark') root.dataset.theme = 'dark';
  } catch {
    // The toggle still works when storage is unavailable.
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    toggle.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
    toggle.hidden = false;

    toggle.addEventListener('click', () => {
      const dark = root.dataset.theme !== 'dark';
      root.dataset.theme = dark ? 'dark' : 'light';
      toggle.setAttribute('aria-pressed', String(dark));
      try {
        localStorage.setItem(storageKey, root.dataset.theme);
      } catch {
        // The current page still reflects the selection.
      }
    });
  });
})();
