/* ── SHOP PAGE ── */

const shopProducts = [
  {
    id: '1',
    name: 'POCKET BLUSH',
    sub: 'Soft Balm Blush',
    price: 23000,
    badge: '',
    cat: ['all', 'best', 'face'],
    img: 'images/ode pocket blush_close.png',
    contain: true,
    hoverContain: true,
    hoverSlides: [
      { img: 'images/fig mousse_hover.png',   label: 'Fig Mousse',  price: 23000 },
      { img: 'images/fig mousse hover 2.jpg', label: 'Cherry Kiss', price: 23000 },
    ],
    colors: [
      { label: 'Fig Mousse',   color: '#c47a7a' },
      { label: 'Coconut Butter', color: '#d4a882' },
      { label: 'Bare Plum',    color: '#9e6878' },
      { label: 'Cherry Kiss',  color: '#8b2a2a' },
    ],
  },
  {
    id: '2',
    name: 'POCKET TINT',
    sub: 'Dewy Lip Tint',
    price: 18000,
    badge: '',
    cat: ['all', 'best', 'lip'],
    img: 'images/tint_pinkguava.png',
    hoverImg: 'images/ode pt model.png',
    contain: true,
    imgPadding: '100px 115px',
    colors: [
      { label: 'Pink Guava',       color: '#e8a0b4' },
      { label: 'Tangerine Pop', color: '#e8904a' },
      { label: 'Fig Jam',        color: '#b46870' },
    ],
  },
  {
    id: '3',
    name: 'SOLID PERFUME STICK',
    sub: 'Pocket Perfume Stick',
    price: 25000,
    badge: '',
    cat: ['all', 'fragrance'],
    img: 'images/ode solid perfume stick .png',
    hoverImg: 'images/ode sp model new.png',
    contain: true,
    imgPadding: '52px 44px',
    colors: [
      { label: 'Woody Fig', color: '#c8b4a0' },
      { label: 'Fig',       color: '#a07060' },
      { label: 'Coconut',   color: '#e8d8c0' },
    ],
  },
  {
    id: '4',
    name: 'COCONUT BREEZE',
    sub: 'Coconut Body Mist',
    price: 22000,
    badge: 'NEW',
    cat: ['all', 'new', 'body'],
    img: 'images/ode body mist_nobg.png',
    hoverImg: 'images/ode body mist 2.jpg',
    contain: true,
    colors: [],
  },
  {
    id: '5',
    name: 'SPF EYE PATCH',
    sub: 'SPF Eye Patch',
    price: 19000,
    badge: 'NEW',
    cat: ['all', 'new', 'face'],
    img: 'images/ode eye patch_nobg.png',
    hoverImg: 'images/ode spf eye patch.jpg',
    contain: true,
    colors: [],
  },
  {
    id: '6',
    name: 'POUCH',
    sub: 'ODE Pouch',
    price: 28000,
    badge: '',
    cat: ['all', 'etc'],
    img: 'images/ode pouch_nobg.png',
    hoverImg: 'images/ode pouch model.png',
    contain: true,
    colors: [],
  },
  {
    id: '7',
    name: 'MIRROR',
    sub: '',
    price: 5000,
    badge: '',
    cat: ['all', 'etc'],
    img: 'images/ode image.png',
    hoverImg: 'images/ode mirror.png',
    contain: true,
    hoverContain: true,
    colors: [],
  },
];

let activeFilter = 'all';
let activeSort   = 'featured';

const gridEl   = document.getElementById('shop-grid');
const countEl  = document.getElementById('shop-count');
const sortEl   = document.getElementById('shop-sort-select');

/* read ?filter= and ?search= from URL */
const urlParams = new URLSearchParams(location.search);
const urlFilter = urlParams.get('filter');
if (urlFilter) activeFilter = urlFilter;
let activeSearch = urlParams.get('search') || '';

function getFiltered() {
  let list = activeFilter === 'all'
    ? shopProducts
    : shopProducts.filter(p => p.cat.includes(activeFilter));

  if (activeSearch) {
    const q = activeSearch.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sub.toLowerCase().includes(q) ||
      (p.colors || []).some(c => c.label.toLowerCase().includes(q))
    );
  }

  if (activeSort === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price);
  if (activeSort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
  if (activeSort === 'name')       list = [...list].sort((a,b) => a.name.localeCompare(b.name));

  return list;
}

function renderGrid() {
  const list = getFiltered();
  countEl.textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    gridEl.innerHTML = `<div class="shop-empty">No products found.</div>`;
    return;
  }

  gridEl.innerHTML = list.map(p => {
    const swatchesHtml = p.colors.length > 1
      ? `<div class="shop-card-swatches">${p.colors.map(c =>
          `<span class="shop-card-swatch" style="background:${c.color}" title="${c.label}"></span>`
        ).join('')}</div>`
      : '';
    const badgeHtml = p.badge
      ? `<span class="shop-card-badge${p.badge === 'NEW' ? ' new-badge' : ''}">${p.badge}</span>`
      : '';
    let hoverHtml = '';
    if (p.hoverSlides && p.hoverSlides.length) {
      hoverHtml = p.hoverSlides.map((s, i) => `
        <div class="card-hover-slide slide-${i}">
          <img src="${s.img}" alt="${p.name} - ${s.label}" loading="lazy" class="card-hover-slide-img${p.hoverContain ? ' contain' : ''}" />
          <div class="card-hover-overlay">
            <span class="card-hover-name">${p.name} <em>${s.label}</em></span>
            <button class="card-quick-add" type="button"
              data-id="${p.id}" data-name="${p.name}" data-color="${s.label}" data-price="${s.price}" data-img="${s.img}">
              ADD TO CART
            </button>
          </div>
        </div>`).join('');
    } else if (p.hoverImg) {
      hoverHtml = `<img src="${p.hoverImg}" alt="${p.name}" loading="lazy" class="card-hover-img${p.hoverContain ? ' contain' : ''}" />`;
    }
    const wished = wishHas(p.id);
    const wishBtnHtml = `
        <button class="shop-card-wish${wished ? ' active' : ''}" data-id="${p.id}" type="button" aria-label="관심상품">
          <svg class="heart-line" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#9e6878" stroke-width="1.4"/></svg>
          <svg class="heart-fill" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#9e6878"/></svg>
        </button>`;
    return `
      <a class="shop-card" href="product.html?id=${p.id}">
        <div class="shop-card-img-wrap"${p.cardBg ? ` style="background:${p.cardBg}"` : ''}>
          <img src="${p.img}" alt="${p.name}" loading="lazy" class="card-main-img${p.contain ? ' contain' : ''}"${p.imgPadding ? ` style="padding:${p.imgPadding}"` : ''} />
          ${hoverHtml}
          ${badgeHtml}
          ${wishBtnHtml}
        </div>
        <div class="shop-card-name">${p.name}</div>
        <div class="shop-card-sub">${p.sub}</div>
        <div class="shop-card-price">${p.price.toLocaleString()}원</div>
        ${swatchesHtml}
      </a>`;
  }).join('');
}

/* filter pills */
document.querySelectorAll('.filter-pill').forEach(btn => {
  if (btn.dataset.filter === activeFilter) btn.classList.add('active');
  else btn.classList.remove('active');

  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('active', b === btn));
    renderGrid();
  });
});

sortEl.addEventListener('change', () => {
  activeSort = sortEl.value;
  renderGrid();
});

/* quick add to cart (event delegation, works for re-rendered cards) */
gridEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-quick-add');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();

  cartAdd({
    key: `${btn.dataset.id}-${btn.dataset.color}`,
    id: btn.dataset.id,
    name: btn.dataset.name,
    color: btn.dataset.color,
    price: Number(btn.dataset.price),
    img: btn.dataset.img,
    qty: 1,
  });

  const original = btn.textContent;
  btn.textContent = 'ADDED';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('added');
  }, 1200);
});

/* wishlist toggle on cards */
gridEl.addEventListener('click', (e) => {
  const wb = e.target.closest('.shop-card-wish');
  if (!wb) return;
  e.preventDefault();
  e.stopPropagation();
  const added = wishToggle(wb.dataset.id);
  wb.classList.toggle('active', added);
});

/* init */
renderGrid();
