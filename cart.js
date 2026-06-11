/* ── ODE SHARED CART ── */
const FREE_SHIPPING_THRESHOLD = 50000;

const PRODUCT_MAP = {
  '1': { name:'POCKET BLUSH',         img:'images/blush_figmousse.png',          price:23000, defaultColor:'Fig Mousse'   },
  '2': { name:'POCKET TINT',         img:'images/tint_pinkguava.png',           price:18000, defaultColor:'Pink Guava'   },
  '3': { name:'SOLID PERFUME STICK', img:'images/ode solid perfume stick .png', price:25000, defaultColor:'Woody Fig'    },
  '4': { name:'COCONUT BREEZE',      img:'images/ode body mist 1.png',          price:22000, defaultColor:'Coconut'      },
  '5': { name:'SPF EYE PATCH',       img:'images/ode eye patch_nobg.png',       price:19000, defaultColor:'Original'     },
  '6': { name:'POUCH',               img:'images/ode pouch_nobg.png',           price:28000, defaultColor:'Clear'        },
};

/* ── storage ── */
function loadBag()  { try { return JSON.parse(localStorage.getItem('ode_bag') || '[]'); } catch { return []; } }
function saveBag(b) { localStorage.setItem('ode_bag', JSON.stringify(b)); }

function getBagTotal() { return loadBag().reduce((s,i) => s + i.price * i.qty, 0); }
function getBagCount() { return loadBag().reduce((s,i) => s + i.qty, 0); }

function updateAllCounts() {
  document.querySelectorAll('.bag-count-el').forEach(el => el.textContent = getBagCount());
}

/* ── add to bag (called by each page) ── */
function cartAdd({ key, id, name, color, price, img, qty = 1 }) {
  const b = loadBag();
  const existing = b.find(i => i.key === key);
  if (existing) existing.qty += qty;
  else b.push({ key, id, name, color, price, img, qty });
  saveBag(b);
  updateAllCounts();
}

/* ── render ── */
function renderBag() {
  const b        = loadBag();
  const bagBody  = document.getElementById('bag-body');
  const bagFooter= document.getElementById('bag-footer');
  const hdr      = document.querySelector('.bag-header-count');
  if (!bagBody) return;

  const total = getBagTotal();
  const count = getBagCount();

  if (hdr) hdr.textContent = `${count} ITEM${count !== 1 ? 'S' : ''}`;

  /* shipping bar */
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const pct       = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const shBar     = document.getElementById('bag-shipping-bar');
  if (shBar) {
    shBar.innerHTML = `
      <div class="shipping-track"><div class="shipping-fill" style="width:${pct}%"></div></div>
      <p class="shipping-msg">${remaining > 0
        ? `<strong>${remaining.toLocaleString()}원</strong> 더 구매하면 무료배송`
        : `<span style="color:#2b2420;font-weight:500">무료배송 달성!</span>`}</p>`;
  }

  /* items */
  if (!b.length) {
    bagBody.innerHTML = '<p class="bag-empty">장바구니가 비어 있습니다.</p>';
    bagFooter.innerHTML = '';
    appendRecommend(bagBody, []);
    return;
  }

  bagBody.innerHTML = b.map((item, idx) => `
    <div class="bag-item">
      <a href="product.html?id=${item.id}" class="bag-item-img-wrap">
        <img class="bag-item-img" src="${item.img || ''}" alt="${item.name}" />
      </a>
      <div class="bag-item-info">
        <span class="bag-item-name">${item.name}</span>
        <span class="bag-item-color">${item.color || ''}</span>
        <div class="bag-item-qty-row">
          <button class="bag-qty-btn" data-action="minus" data-idx="${idx}">−</button>
          <span class="bag-item-qty-num">${item.qty}</span>
          <button class="bag-qty-btn" data-action="plus"  data-idx="${idx}">+</button>
        </div>
      </div>
      <div class="bag-item-right">
        <span class="bag-item-price">${(item.price * item.qty).toLocaleString()}원</span>
        <button class="bag-item-remove" data-idx="${idx}">✕</button>
      </div>
    </div>`).join('');

  bagBody.querySelectorAll('.bag-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const b2 = loadBag();
      const i  = +btn.dataset.idx;
      if (btn.dataset.action === 'plus') { b2[i].qty++; }
      else if (b2[i].qty > 1)           { b2[i].qty--; }
      else                               { b2.splice(i, 1); }
      saveBag(b2);
      updateAllCounts();
      renderBag();
    });
  });

  bagBody.querySelectorAll('.bag-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const b2 = loadBag();
      b2.splice(+btn.dataset.idx, 1);
      saveBag(b2);
      updateAllCounts();
      renderBag();
    });
  });

  appendRecommend(bagBody, b);

  bagFooter.innerHTML = `
    <div class="bag-subtotal-row">
      <span class="bag-subtotal-label">subtotal</span>
      <span class="bag-subtotal-amt">${total.toLocaleString()}원</span>
    </div>
    <p class="bag-note">*배송비 및 할인은 결제 시 적용됩니다.</p>
    <button class="bag-checkout">CHECKOUT</button>`;
}

function appendRecommend(bagBody, currentBag) {
  const inBagIds = currentBag.map(i => i.id);
  const recs = Object.entries(PRODUCT_MAP)
    .filter(([id]) => !inBagIds.includes(id))
    .slice(0, 2);
  if (!recs.length) return;

  const div = document.createElement('div');
  div.className = 'bag-recommend';
  div.innerHTML = `
    <p class="bag-rec-title">Complete your ODE <strong>ROUTINE</strong></p>
    ${recs.map(([id, p]) => `
      <div class="bag-rec-item" data-id="${id}">
        <a href="product.html?id=${id}" class="bag-rec-img-wrap">
          <img src="${p.img}" alt="${p.name}" />
        </a>
        <div class="bag-rec-info">
          <span class="bag-rec-name">${p.name}</span>
          <span class="bag-rec-color">${p.defaultColor}</span>
        </div>
        <button class="bag-rec-add"
          data-id="${id}"
          data-name="${p.name}"
          data-color="${p.defaultColor}"
          data-price="${p.price}"
          data-img="${p.img}">
          ADD — ${p.price.toLocaleString()}원
        </button>
      </div>`).join('')}`;

  div.querySelectorAll('.bag-rec-add').forEach(btn => {
    btn.addEventListener('click', () => {
      cartAdd({
        key:   `${btn.dataset.id}_0`,
        id:    btn.dataset.id,
        name:  btn.dataset.name,
        color: btn.dataset.color,
        price: +btn.dataset.price,
        img:   btn.dataset.img,
        qty:   1,
      });
      renderBag();
    });
  });

  bagBody.appendChild(div);
}

/* ── open / close ── */
function openBag() {
  document.getElementById('bag-overlay')?.classList.add('open');
  document.getElementById('bag-sidebar')?.classList.add('open');
  renderBag();
}
function closeBag() {
  document.getElementById('bag-overlay')?.classList.remove('open');
  document.getElementById('bag-sidebar')?.classList.remove('open');
}

/* ── init ── */
document.addEventListener('DOMContentLoaded', () => {
  updateAllCounts();

  document.getElementById('bag-btn')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('bag-sidebar')?.classList.contains('open') ? closeBag() : openBag();
  });
  document.getElementById('bag-close')?.addEventListener('click', closeBag);
  document.getElementById('bag-overlay')?.addEventListener('click', closeBag);

  /* hamburger */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.mobile-menu-link').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const q = mobileSearchInput.value.trim();
          if (q) location.href = `shop.html?search=${encodeURIComponent(q)}`;
        }
      });
    }
  }
});
