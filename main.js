gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("expo", "0.16, 1, 0.3, 1");


/* ── FILM GRAIN ── */
(function () {
  const canvas = document.getElementById('hero-grain');
  const ctx    = canvas.getContext('2d');
  let   animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function drawGrain() {
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data      = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(drawGrain);
  }

  resize();
  window.addEventListener('resize', resize);
  drawGrain();
})();

/* ── CURSOR ── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.set(cursor, { x: mx, y: my }); // 점은 즉시 이동
});

(function followLoop() {
  fx += (mx - fx) * 0.15;
  fy += (my - fy) * 0.15;
  gsap.set(follower, { x: fx, y: fy });
  requestAnimationFrame(followLoop);
})();

/* ── LOADER ── */
document.getElementById('loader').style.display = 'none';
startHeroAnim();

/* ── HERO ANIMATION ── */
function startHeroAnim() {
  gsap.to('#header', { opacity: 1, duration: 0.6, ease: 'power2.out' });

  const tl = gsap.timeline({ defaults: { ease: 'expo' } });
  tl.to('#hero-tag',  { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to('.hero-title .line', { y: '0%', duration: 1, stagger: 0.12 }, 0.2)
    .to('#hero-sub',  { opacity: 1, duration: 0.8 }, 0.55)
    .to('#hero-cta',  { opacity: 1, duration: 0.7 }, 0.7)
    .to('#hero-scroll', { opacity: 1, duration: 0.7 }, 0.9);

  /* hero parallax */
  gsap.to('#hero-img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}


/* ── SCROLL REVEALS ── */
/* section tags */
gsap.utils.toArray('.reveal-tag').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 16, duration: 0.7,
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});
gsap.utils.toArray('.reveal-title').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 20, duration: 0.8,
    scrollTrigger: { trigger: el, start: 'top 86%' }
  });
});

/* product cards stagger */
gsap.utils.toArray('.reveal-card').forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    y: 48,
    duration: 0.9,
    ease: 'expo',
    delay: i * 0.12,
    scrollTrigger: { trigger: '.product-grid', start: 'top 80%' }
  });
});

/* summer banner */
ScrollTrigger.create({
  trigger: '.summer-banner',
  start: 'top 80%',
  onEnter: () => {
    gsap.to('.summer-left', { opacity: 1, x: 0, duration: 0.9, ease: 'expo' });
    gsap.to('.summer-right', { opacity: 1, duration: 0.9, ease: 'expo', delay: 0.15 });
  }
});

/* collection */
gsap.utils.toArray('.col-reveal').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'expo',
    delay: i * 0.15,
    scrollTrigger: { trigger: '.collection', start: 'top 72%' }
  });
});
gsap.to('.collection-title', {
  opacity: 1, y: 0, duration: 1, ease: 'expo',
  scrollTrigger: { trigger: '.collection', start: 'top 72%' }
});

/* about */
gsap.utils.toArray('.about-reveal').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'expo',
    delay: i * 0.15,
    scrollTrigger: { trigger: '.about', start: 'top 78%' }
  });
});

/* ── HEADER SCROLL ── */
const header = document.getElementById('header');
ScrollTrigger.create({
  start: 'top -60',
  onUpdate: self => {
    header.style.borderBottomColor = self.progress > 0
      ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.06)';
  }
});

/* ── BAG ── */
const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.quick-add').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card  = btn.closest('.product-card');
    const pid   = card.dataset.id;
    const p     = PRODUCT_MAP[pid];
    if (!p) return;
    cartAdd({
      key:   `${pid}_0`,
      id:    pid,
      name:  p.name,
      color: p.defaultColor,
      price: +card.dataset.price,
      img:   p.img,
      qty:   1,
    });
    openBag();
  });
});


/* ── SUMMER SWIPER ── */
new Swiper('.summer-swiper', {
  loop: true,
  speed: 700,
  grabCursor: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 3,
    },
  },
});

/* smooth nav scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { duration: 1.2, scrollTo: { y: target, offsetY: 60 }, ease: 'expo' });
  });
});
