const lenis = new Lenis({
  lerp: 0.08,
  smoothTouch: false,
});

lenis.on('scroll', () => {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
