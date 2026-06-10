const productData = {
  '1': {
    name: 'COCONUT BUTTER',
    sub: 'Soft Balm Blush',
    price: 23000,
    reviews: 1284,
    badge: 'BEST',
    desc: '자연스럽게 스며드는 크림 블러셔. 손가락으로 가볍게 두드려 발색하면 생기 있는 혈색을 연출할 수 있어요. 하루 종일 촉촉하게 유지되는 밤 타입 포뮬러.',
    colors: [
      { label: '피그 무스',     color: '#c47a7a', images: ['images/blush_figmousse.png', 'images/ode pb model.png'] },
      { label: 'Coconut Butter', color: '#e8b4a0', images: ['images/coconut pocket blush 1.png', 'images/coconut blush_model.jpg'] },
      { label: '체리',          color: '#9e3a3a', images: ['images/cherry collection.jpg'] },
      { label: '워터멜론',      color: '#e87070', images: ['images/watermelon collection.jpg'] },
    ]
  },
  '2': {
    name: 'POCKET TINT',
    sub: 'Dewy Lip Tint',
    price: 18000,
    reviews: 876,
    badge: '',
    desc: '물광 입술을 완성하는 듀이 립 틴트. 가볍게 밀착되어 오래도록 선명한 발색이 유지되고, 촉촉한 보습막이 입술을 편안하게 감싸줍니다.',
    colors: [
      { label: '핑크 구아바', color: '#e8a0b4', images: ['images/ode lip tint.png', 'images/ode pt model.png'] },
      { label: '탠저린',     color: '#e8904a', badge: 'NEW', images: ['images/tangerine collection.jpg'] },
      { label: '피그',       color: '#b46870', images: ['images/fig collection.jpg'] },
    ]
  },
  '4': {
    name: 'COCONUT BREEZE',
    sub: 'Coconut Body Mist',
    price: 22000,
    reviews: 318,
    badge: 'NEW',
    desc: '코코넛 향이 은은하게 퍼지는 바디 미스트. 가볍게 뿌리면 촉촉한 수분막이 형성되어 하루 종일 부드러운 피부와 향을 유지할 수 있어요.',
    colors: [
      { label: '코코넛', color: '#d4c4a8', images: ['images/ode body mist.jpg', 'images/ode body mist 1.png'] },
    ]
  },
  '5': {
    name: 'SPF EYE PATCH',
    sub: 'SPF Eye Patch',
    price: 19000,
    reviews: 204,
    badge: 'NEW',
    desc: '눈가를 자외선으로부터 보호하는 SPF 아이 패치. 촉촉한 밀착감으로 눈가 피부를 진정시키고 선케어까지 한 번에 해결해요.',
    colors: [
      { label: '기본', color: '#e0d8cc', images: ['images/ode spf eye patch.jpg', 'images/ode eye patch_nobg.png'] },
    ]
  },
  '6': {
    name: 'POUCH',
    sub: 'ODE Pouch',
    price: 28000,
    reviews: 156,
    badge: '',
    desc: 'ODE의 제품을 담기 위해 디자인된 투명 파우치. 간편하게 수납하고 어디든 가볍게 들고 다닐 수 있어요.',
    colors: [
      { label: '클리어', color: '#d8d0c8', images: ['images/ode pouch.jpg', 'images/ode pouch model.png'] },
    ]
  },
  '3': {
    name: 'SOLID PERFUME STICK',
    sub: 'Pocket Perfume Stick',
    price: 25000,
    reviews: 542,
    badge: '',
    desc: '고체 타입의 포켓 퍼퓸 스틱. 언제 어디서나 부담 없이 향을 더할 수 있는 여행 친화적인 퍼퓸. 피부에 살짝 문질러 은은하게 지속되는 향을 즐겨보세요.',
    colors: [
      { label: '우디 피그', color: '#c8b4a0', images: ['images/ode solid perfume stick .png', 'images/ode sp model new.png'] },
      { label: '무화과',   color: '#a07060', images: ['images/fig collection.jpg'] },
      { label: '코코넛',   color: '#e8d8c0', images: ['images/coconut collection.jpg'] },
    ]
  }
};

/* URL 파라미터 */
const params = new URLSearchParams(location.search);
const id = params.get('id') || '1';
const colorParam = parseInt(params.get('color') || '0', 10);
const product = productData[id];
if (!product) location.href = 'index.html';

document.title = `${product.name} — ODE`;
document.getElementById('detail-name').textContent = product.name;
document.getElementById('detail-sub').textContent = product.sub;
document.getElementById('detail-price').textContent = product.price.toLocaleString() + '원';
document.getElementById('rating-count').textContent = `(${product.reviews.toLocaleString()}개 리뷰)`;
document.getElementById('detail-desc').textContent = product.desc;

if (product.badge) {
  const b = document.createElement('span');
  b.className = 'detail-badge' + (product.badge === 'NEW' ? ' new' : '');
  b.textContent = product.badge;
  document.getElementById('detail-badges').appendChild(b);
}

/* ── 이미지 갤러리 ── */
let currentIdx = 0;
let activeColorIdx = colorParam;
let autoTimer = null;

const mainImg  = document.getElementById('gallery-active-img');
const thumbsEl = document.getElementById('gallery-thumbs');

function setImage(idx) {
  currentIdx = idx;
  const src = product.colors[activeColorIdx].images[idx];
  mainImg.style.opacity = '0';
  setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 200);
  thumbsEl.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
}

function loadColorImages(colorIdx) {
  activeColorIdx = colorIdx;
  currentIdx = 0;
  thumbsEl.innerHTML = '';
  const images = product.colors[colorIdx].images;
  images.forEach((src, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumb' + (i === 0 ? ' active' : '');
    thumb.innerHTML = `<img src="${src}" alt="" />`;
    thumb.addEventListener('click', () => { setImage(i); resetAuto(); });
    thumbsEl.appendChild(thumb);
  });
  mainImg.src = images[0];
  mainImg.style.opacity = '1';
  resetAuto();
}

function nextImage() {
  const total = product.colors[activeColorIdx].images.length;
  setImage((currentIdx + 1) % total);
}
function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextImage, 5000);
}


/* ── 컬러 선택 공통 함수 ── */
function selectColor(idx) {
  activeColorIdx = idx;
  const c = product.colors[idx];

  /* 드롭다운 업데이트 */
  document.getElementById('color-dropdown-dot').style.background = c.color;
  document.getElementById('color-dropdown-selected').textContent = c.label;
  const btnBadgeEl = document.getElementById('color-dropdown-btn-badge');
  if (btnBadgeEl) {
    if (c.badge) { btnBadgeEl.textContent = c.badge; btnBadgeEl.style.display = 'inline-block'; }
    else { btnBadgeEl.style.display = 'none'; }
  }
  dropdownItemEls.forEach((el, i) => el.classList.toggle('active', i === idx));
  document.getElementById('color-dropdown-list').classList.remove('open');

  /* 스와치 업데이트 */
  swatchEls.forEach((el, i) => el.classList.toggle('active', i === idx));

  /* 이미지 로드 */
  loadColorImages(idx);
}

/* ── 컬러 드롭다운 ── */
const dropdownBtn  = document.getElementById('color-dropdown-btn');
const dropdownList = document.getElementById('color-dropdown-list');

const dropdownItemEls = [];
product.colors.forEach((c, i) => {
  const item = document.createElement('div');
  item.className = 'color-dropdown-item' + (i === activeColorIdx ? ' active' : '');
  item.innerHTML = `<span class="color-dropdown-item-dot" style="background:${c.color}"></span>${c.label}${c.badge ? `<span class="color-item-badge">${c.badge}</span>` : ''}`;
  item.addEventListener('click', () => selectColor(i));
  dropdownList.appendChild(item);
  dropdownItemEls.push(item);
});

dropdownBtn.addEventListener('click', () => dropdownList.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!dropdownBtn.closest('.color-dropdown-wrap').contains(e.target)) {
    dropdownList.classList.remove('open');
  }
});

/* 드롭다운 초기값 */
const initColor = product.colors[activeColorIdx];
document.getElementById('color-dropdown-dot').style.background = initColor.color;
document.getElementById('color-dropdown-selected').textContent = initColor.label;
const initBadgeEl = document.getElementById('color-dropdown-btn-badge');
if (initBadgeEl) {
  if (initColor.badge) { initBadgeEl.textContent = initColor.badge; initBadgeEl.style.display = 'inline-block'; }
  else { initBadgeEl.style.display = 'none'; }
}

/* ── 스와치 ── */
const optEl = document.getElementById('detail-options');
const swatchLabel = document.createElement('p');
swatchLabel.className = 'option-label';
swatchLabel.textContent = '컬러';
optEl.appendChild(swatchLabel);

const swatchWrap = document.createElement('div');
swatchWrap.className = 'option-swatches';
const swatchEls = [];
product.colors.forEach((c, i) => {
  const wrap = document.createElement('div');
  wrap.className = 'swatch-wrap';

  const s = document.createElement('div');
  s.className = 'swatch' + (i === activeColorIdx ? ' active' : '');
  s.style.background = c.color;
  s.title = c.label;
  s.addEventListener('click', () => selectColor(i));
  wrap.appendChild(s);
  swatchEls.push(s);

  if (c.badge) {
    const b = document.createElement('span');
    b.className = 'swatch-badge';
    b.textContent = c.badge;
    wrap.appendChild(b);
  }

  swatchWrap.appendChild(wrap);
});
optEl.appendChild(swatchWrap);

/* 초기 이미지 로드 */
loadColorImages(activeColorIdx);

/* ── 수량 + 합계 ── */
let qty = 1;
const qtyNum  = document.getElementById('qty-num');
const totalEl = document.getElementById('detail-total');

function updateTotal() {
  totalEl.textContent = (product.price * qty).toLocaleString() + '원';
}
updateTotal();

document.getElementById('qty-minus').addEventListener('click', () => {
  if (qty > 1) { qty--; qtyNum.textContent = qty; updateTotal(); }
});
document.getElementById('qty-plus').addEventListener('click', () => {
  qty++; qtyNum.textContent = qty; updateTotal();
});

/* ── TOAST ── */
const toastEl = document.getElementById('toast');
let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

/* ── CTA ── */
document.getElementById('btn-cart').addEventListener('click', () => {
  const color = product.colors[activeColorIdx];
  cartAdd({
    key:   `${id}_${activeColorIdx}`,
    id,
    name:  product.name,
    color: color.label,
    price: product.price,
    img:   color.images[0],
    qty,
  });
  openBag();
});
document.getElementById('btn-buy').addEventListener('click', () => {
  showToast('바로구매 페이지로 이동합니다.');
});
