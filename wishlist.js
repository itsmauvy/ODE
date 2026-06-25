/* ── WISHLIST PAGE — reuses cartAdd() from cart.js ── */

/* product catalog (matches shop.js) */
const WISH_CATALOG = {
  '1': { name: 'POCKET BLUSH',         sub: 'Soft Balm Blush',     price: 23000, img: 'images/ode pocket blush_close.png', color: 'Fig Mousse' },
  '2': { name: 'POCKET TINT',          sub: 'Dewy Lip Tint',       price: 18000, img: 'images/tint_pinkguava.png',          color: 'Pink Guava' },
  '3': { name: 'SOLID PERFUME STICK',  sub: 'Pocket Perfume Stick',price: 25000, img: 'images/ode solid perfume stick .png',color: 'Woody Fig' },
  '4': { name: 'COCONUT BREEZE',       sub: 'Coconut Body Mist',   price: 22000, img: 'images/ode body mist_nobg.png',       color: 'Coconut' },
  '5': { name: 'SPF EYE PATCH',        sub: 'SPF Eye Patch',       price: 19000, img: 'images/ode eye patch_nobg.png',       color: 'Original' },
  '6': { name: 'POUCH',                sub: 'ODE Pouch',           price: 28000, img: 'images/ode pouch_nobg.png',           color: 'Clear' },
  '7': { name: 'MIRROR',               sub: 'ODE Mirror',          price: 5000,  img: 'images/ode mirror.png',              color: 'Silver' },
};

/* 위시리스트 저장/조회는 wish.js (wishLoad/wishSave/wishHas/wishToggle) 사용 */

const wishGrid  = document.getElementById('wish-grid');
const wishCountEl = document.getElementById('wish-count');

function renderWish() {
  const ids = wishLoad().filter(id => WISH_CATALOG[id]);
  wishCountEl.textContent = ids.length ? `${ids.length} item${ids.length !== 1 ? 's' : ''} saved` : '';

  if (!ids.length) {
    wishGrid.innerHTML = `
      <div class="wish-empty">
        <div class="wish-empty-heart">♡</div>
        <p class="wish-empty-text">No saved items yet.</p>
        <a href="shop.html" class="wish-empty-btn">EXPLORE PRODUCTS</a>
      </div>`;
    return;
  }

  wishGrid.innerHTML = ids.map(id => {
    const p = WISH_CATALOG[id];
    return `
      <div class="shop-card" data-id="${id}">
        <button class="wish-remove" data-id="${id}" aria-label="관심상품 삭제">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#9e6878" stroke="#9e6878" stroke-width="1.2" stroke-linejoin="round"/>
          </svg>
        </button>
        <a href="product.html?id=${id}" class="shop-card-link" style="text-decoration:none;color:inherit">
          <div class="shop-card-img-wrap">
            <img src="${p.img}" alt="${p.name}" loading="lazy" class="card-main-img contain" />
          </div>
          <div class="shop-card-name">${p.name}</div>
          <div class="shop-card-sub">${p.sub}</div>
          <div class="shop-card-price">${p.price.toLocaleString()}원</div>
        </a>
        <button class="wish-add" data-id="${id}">ADD TO BAG</button>
      </div>`;
  }).join('');
}

/* remove + add (event delegation) */
wishGrid.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.wish-remove');
  if (removeBtn) {
    e.preventDefault();
    const id = removeBtn.dataset.id;
    wishSave(wishLoad().filter(x => x !== id));
    renderWish();
    return;
  }

  const addBtn = e.target.closest('.wish-add');
  if (addBtn) {
    e.preventDefault();
    const id = addBtn.dataset.id;
    const p = WISH_CATALOG[id];
    cartAdd({
      key: `${id}_0`,
      id,
      name: p.name,
      color: p.color,
      price: p.price,
      img: p.img,
      qty: 1,
    });
    addBtn.textContent = 'ADDED ✓';
    addBtn.classList.add('added');
    setTimeout(() => { addBtn.textContent = 'ADD TO BAG'; addBtn.classList.remove('added'); }, 1200);
  }
});

document.addEventListener('DOMContentLoaded', renderWish);
