/* ── LENIS SMOOTH SCROLL ── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: false,
  prevent: (node) =>
    node.hasAttribute('data-lenis-prevent') ||
    node.classList.contains('ab-products__list') ||
    node.classList.contains('shop-filter-pills') ||
    node.tagName === 'SELECT',
});

if (typeof ScrollTrigger !== 'undefined') {
  lenis.on('scroll', () => ScrollTrigger.update());
}

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
