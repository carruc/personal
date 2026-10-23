// Research widgets are scoped to their root, allowing multiple instances per page.
for (const widget of document.querySelectorAll('[data-selector]')) {
  const select = widget.querySelector('[data-select]');
  const panels = [...widget.querySelectorAll('[data-panel]')];
  const update = () => panels.forEach((panel, index) => { panel.hidden = index !== Number(select.value); });
  select.addEventListener('change', update);
  update();
}
for (const widget of document.querySelectorAll('[data-comparison]')) {
  const range = widget.querySelector('[data-compare]');
  const update = () => {
    widget.style.setProperty('--comparison-position', `${range.value}%`);
    range.setAttribute('aria-valuetext', `${range.value}% before image visible`);
  };
  range.addEventListener('input', update);
  update();
}
for (const widget of document.querySelectorAll('[data-gallery]')) {
  const slides = [...widget.querySelectorAll('[data-slide]')];
  let current = 0;
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    widget.querySelector('[data-status]').textContent = `${current + 1} / ${slides.length}`;
  };
  widget.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
  widget.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
  show(0);
}
