gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("expo", "0.16, 1, 0.3, 1");

/* ── MEGA MENU ── */
const megaProducts = [
  { id:'1', name:'POCKET BLUSH',        sub:'Soft Balm Blush',      img:'images/ode pocket blush_close.png',    cat:['all','best','face'],                badge:'BEST' },
  { id:'2', name:'POCKET TINT',         sub:'Dewy Lip Tint',        img:'images/ode lip tint.png',              cat:['all','best','lip'],                 badge:''     },
  { id:'3', name:'SOLID PERFUME STICK', sub:'Pocket Perfume Stick', img:'images/ode solid perfume stick .png',  cat:['all','fragrance'],                  badge:''     },
  { id:'4', name:'BODY MIST',           sub:'Coconut Body Mist',    img:'images/ode body mist 1.png',           cat:['all','body','new'],                 badge:'NEW'  },
  { id:'5', name:'SPF EYE PATCH',       sub:'SPF Eye Patch',        img:'images/ode eye patch_nobg.png',        cat:['all','face','new'],                 badge:'NEW'  },
  { id:'6', name:'POUCH',               sub:'ODE Pouch',            img:'images/ode pouch_nobg.png',            cat:['all','etc','new'],                  badge:'NEW'  },
  { id:'7', name:'COCONUT POCKET BLUSH',sub:'Soft Balm Blush',      img:'images/coconut pocket blush 1.png',    cat:['all','face','new'],                 badge:'NEW'  },
];

const megaMenu     = document.getElementById('mega-menu');
const megaProdsEl  = document.getElementById('mega-products');
const megaTabs     = document.querySelectorAll('.mega-tab');
const navShop      = document.getElementById('nav-shop');

let menuTimer = null;

const collections = [
  { name:'COCONUT COLLECTION',    img:'images/coconut collection.jpg',    badge:'NEW' },
  { name:'FIG COLLECTION',        img:'images/fig collection.jpg' },
  { name:'GUAVA COLLECTION',      img:'images/guava collection.jpg' },
  { name:'TANGERINE COLLECTION',  img:'images/tangerine collection.jpg' },
  { name:'CHERRY COLLECTION',     img:'images/cherry collection.jpg' },
  { name:'WATERMELON COLLECTION', img:'images/watermelon collection.jpg' },
];

const shopAllLabels = {
  all:        'SHOP ALL',
  best:       'SHOP BEST SELLERS',
  new:        'SHOP NEW ARRIVALS',
  lip:        'SHOP LIP',
  face:       'SHOP FACE',
  fragrance:  'SHOP FRAGRANCE',
  body:       'SHOP BODY',
  etc:        'SHOP ETC',
  collection: 'SHOP ALL COLLECTIONS',
};

function renderMegaProducts(cat) {
  const shopAllEl = document.querySelector('.mega-shop-all');
  if (shopAllEl) shopAllEl.textContent = (shopAllLabels[cat] || 'SHOP ALL') + ' →';

  if (cat === 'collection') {
    megaProdsEl.innerHTML = `<div class="mega-collection-grid">
      ${collections.map(c => `
        <div class="mega-col-card">
          <img src="${c.img}" alt="${c.name}" />
          ${c.badge ? `<span class="mega-col-new-badge">${c.badge}</span>` : ''}
        </div>
      `).join('')}
    </div>`;
    return;
  }
  const list = (cat === 'all' ? megaProducts : megaProducts.filter(p => p.cat.includes(cat))).slice(0, 4);
  if (!list.length) {
    megaProdsEl.innerHTML = `<p style="color:var(--text-light);font-size:13px;padding-top:16px;">해당 카테고리의 제품이 없습니다.</p>`;
    return;
  }
  megaProdsEl.innerHTML = list.map(p => `
    <div class="mega-card" data-id="${p.id}">
      ${p.badge ? `<span class="mega-card-badge ${p.badge==='NEW'?'new-badge':''}">${p.badge}</span>` : '<div style="height:20px;margin-bottom:14px"></div>'}
      <img class="mega-card-img" src="${p.img}" alt="${p.name}" />
      <div class="mega-card-name">${p.name}</div>
      <div class="mega-card-sub">${p.sub}</div>
    </div>
  `).join('');
}

function openMega() {
  clearTimeout(menuTimer);
  megaMenu.classList.add('open');
  renderMegaProducts('all');
  megaTabs.forEach(t => t.classList.toggle('active', t.dataset.cat === 'all'));
}

function closeMega() {
  menuTimer = setTimeout(() => megaMenu.classList.remove('open'), 120);
}

navShop.addEventListener('mouseenter', openMega);
navShop.addEventListener('mouseleave', closeMega);

megaMenu.addEventListener('mouseenter', () => clearTimeout(menuTimer));
megaMenu.addEventListener('mouseleave', closeMega);

megaTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    megaTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderMegaProducts(tab.dataset.cat);
  });
});

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
const bag = [];
const bagCountEl  = document.getElementById('bag-count');
const bagSidebar  = document.getElementById('bag-sidebar');
const bagOverlay  = document.getElementById('bag-overlay');
const bagBody     = document.getElementById('bag-body');
const bagFooter   = document.getElementById('bag-footer');
const toast       = document.getElementById('toast');

let sidebarOpen = false;

function openBag() {
  sidebarOpen = true;
  bagOverlay.classList.add('open');
  gsap.to(bagSidebar, { x: 0, duration: 0.55, ease: 'expo' });
  gsap.to(bagOverlay, { backgroundColor: 'rgba(0,0,0,0.28)', duration: 0.4 });
  renderBag();
}

function closeBag() {
  sidebarOpen = false;
  gsap.to(bagSidebar, {
    x: '100%', duration: 0.45, ease: 'power3.in',
    onComplete: () => {
      bagOverlay.classList.remove('open');
      gsap.set(bagOverlay, { backgroundColor: 'rgba(0,0,0,0)' });
    }
  });
}

function updateCount() {
  bagCountEl.textContent = bag.reduce((s, i) => s + i.qty, 0);
}

function renderBag() {
  if (!bag.length) {
    bagBody.innerHTML = '<p class="bag-empty">장바구니가 비어 있습니다.</p>';
    bagFooter.innerHTML = '';
    return;
  }
  bagBody.innerHTML = bag.map((item, idx) => `
    <div class="bag-item">
      <div class="bag-item-left">
        <span class="bag-item-name">${item.name} × ${item.qty}</span>
        <span class="bag-item-price">${(item.price * item.qty).toLocaleString()}원</span>
      </div>
      <button class="bag-item-remove" data-idx="${idx}">✕</button>
    </div>
  `).join('');

  const total = bag.reduce((s, i) => s + i.price * i.qty, 0);
  bagFooter.innerHTML = `
    <div class="bag-total">
      <span>합계</span><span>${total.toLocaleString()}원</span>
    </div>
    <button class="bag-checkout" id="checkout-btn">CHECKOUT</button>
  `;

  bagBody.querySelectorAll('.bag-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      bag.splice(+btn.dataset.idx, 1);
      updateCount();
      renderBag();
    });
  });

  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    alert('결제 페이지로 이동합니다. (데모)');
  });
}

function addToBag(id, name, price) {
  const existing = bag.find(i => i.id === id);
  existing ? existing.qty++ : bag.push({ id, name, price, qty: 1 });
  updateCount();
  showToast(`${name} 담겼습니다.`);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.quick-add').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card    = btn.closest('.product-card');
    const variant = card.querySelector('.product-desc')?.textContent.trim();
    const name    = `${card.dataset.name}${variant ? ' · ' + variant : ''}`;
    addToBag(card.dataset.id, name, +card.dataset.price);
  });
});

document.getElementById('bag-btn').addEventListener('click', e => {
  e.preventDefault();
  sidebarOpen ? closeBag() : openBag();
});
document.getElementById('bag-close').addEventListener('click', closeBag);
bagOverlay.addEventListener('click', closeBag);

/* ── SEARCH ── */
const products = [
  { id: '1', name: 'POCKET BLUSH',        sub: 'Soft Balm Blush' },
  { id: '2', name: 'POCKET TINT',         sub: 'Dewy Lip Tint' },
  { id: '3', name: 'SOLID PERFUME STICK', sub: 'Pocket Perfume Stick' },
  { id: '4', name: 'BODY MIST',           sub: 'Coconut Body Mist' },
  { id: '5', name: 'SPF EYE PATCH',       sub: 'SPF Eye Patch' },
  { id: '6', name: 'POUCH',               sub: 'ODE Pouch' },
  { id: '7', name: 'COCONUT POCKET BLUSH',sub: 'Soft Balm Blush' },
];

const navSearch    = document.getElementById('nav-search');
const navLabel     = document.getElementById('nav-search-label');
const navInput     = document.getElementById('nav-search-input');

const navResultsEl = document.createElement('div');
navResultsEl.className = 'nav-search-results';
navSearch.appendChild(navResultsEl);

function openNavSearch() {
  navSearch.classList.add('active');
  setTimeout(() => navInput.focus(), 350);
}
function closeNavSearch() {
  navSearch.classList.remove('active', 'has-text');
  navInput.value = '';
  navResultsEl.classList.remove('show');
  navResultsEl.innerHTML = '';
}

function runNavSearch(q) {
  const query = q.trim().toLowerCase();
  if (!query) { navResultsEl.classList.remove('show'); navResultsEl.innerHTML = ''; return; }
  const matched = products.filter(p =>
    p.name.toLowerCase().includes(query) || p.sub.toLowerCase().includes(query)
  );
  navResultsEl.classList.add('show');
  if (!matched.length) {
    navResultsEl.innerHTML = `<div class="nav-search-no-result">검색 결과가 없습니다.</div>`;
    return;
  }
  navResultsEl.innerHTML = matched.map(p => `
    <div class="nav-search-result-item">
      <div class="nav-search-result-name">${p.name}</div>
      <div class="nav-search-result-sub">${p.sub}</div>
    </div>
  `).join('');
}

navLabel.addEventListener('click', openNavSearch);
navInput.addEventListener('input', e => {
  navSearch.classList.toggle('has-text', e.target.value.length > 0);
  runNavSearch(e.target.value);
});
navInput.addEventListener('keydown', e => { if (e.key === 'Escape') closeNavSearch(); });
document.addEventListener('click', e => {
  if (!navSearch.contains(e.target)) closeNavSearch();
});

/* ── SUMMER SWIPER ── */
new Swiper('.summer-swiper', {
  slidesPerView: 3,
  spaceBetween: 3,
  loop: true,
  speed: 700,
  grabCursor: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
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
