/* ── CART PAGE (full page) — reuses globals from cart.js ── */
/* cart.js provides: loadBag, saveBag, getSelected, getBagTotal,
   getSelectedTotal, updateAllCounts, FREE_SHIPPING_THRESHOLD       */

const SHIPPING_FEE = 3000;
const cpBody = document.getElementById('cartpage-body');

function cpRender() {
  const bag = loadBag();

  /* empty state */
  if (!bag.length) {
    cpBody.innerHTML = `
      <div class="cp-empty">
        <div class="cp-empty-icon">🛍</div>
        <p class="cp-empty-text">Your bag is empty.</p>
        <a href="shop.html" class="cp-empty-btn">CONTINUE SHOPPING</a>
      </div>`;
    return;
  }

  const selected    = getSelected(bag);
  const selTotal    = getSelectedTotal(bag);
  const selCount    = selected.reduce((s, i) => s + i.qty, 0);
  const remaining   = Math.max(0, FREE_SHIPPING_THRESHOLD - selTotal);
  const pct         = Math.min(100, (selTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const shipping    = selTotal >= FREE_SHIPPING_THRESHOLD || selTotal === 0 ? 0 : SHIPPING_FEE;
  const grandTotal  = selTotal + shipping;

  cpBody.innerHTML = `
    <div class="cartpage-grid">
      <div class="cp-list-col">
        <div class="cp-shipping">
          <div class="cp-shipping-track"><div class="cp-shipping-fill" style="width:${pct}%"></div></div>
          <p class="cp-shipping-msg">${remaining > 0
            ? `<strong>${remaining.toLocaleString()}원</strong> 더 담으면 무료배송`
            : `무료배송 대상입니다 ✓`}</p>
        </div>

        <div class="cp-select-head">
          <label class="cp-check-label">
            <input type="checkbox" class="cp-check" id="cp-check-all" ${selected.length === bag.length ? 'checked' : ''}/>
            <span class="cp-check-box"></span>
            <span class="cp-check-text">전체 선택 (${selected.length}/${bag.length})</span>
          </label>
          <button class="cp-clear" id="cp-clear">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            전체 삭제
          </button>
        </div>

        ${bag.map((item, idx) => `
          <div class="cp-item">
            <label class="cp-check-label">
              <input type="checkbox" class="cp-check cp-item-check" data-idx="${idx}" ${item.selected !== false ? 'checked' : ''}/>
              <span class="cp-check-box"></span>
            </label>
            <a href="product.html?id=${item.id}" class="cp-item-img-wrap">
              <img class="cp-item-img" src="${item.img || ''}" alt="${item.name}" />
            </a>
            <div class="cp-item-info">
              <span class="cp-item-name">${item.name}</span>
              ${item.color ? `<span class="cp-item-color">${item.color}</span>` : ''}
              <span class="cp-item-unit">${item.price.toLocaleString()}원</span>
              <div class="cp-qty">
                <button class="cp-qty-btn" data-action="minus" data-idx="${idx}">−</button>
                <span class="cp-qty-num">${item.qty}</span>
                <button class="cp-qty-btn" data-action="plus" data-idx="${idx}">+</button>
              </div>
            </div>
            <div class="cp-item-right">
              <span class="cp-item-price">${(item.price * item.qty).toLocaleString()}원</span>
              <button class="cp-item-remove" data-idx="${idx}" aria-label="삭제">✕</button>
            </div>
          </div>`).join('')}
      </div>

      <aside class="cp-summary">
        <p class="cp-summary-title">ORDER SUMMARY</p>
        <div class="cp-row"><span>상품금액 (${selCount}개)</span><span>${selTotal.toLocaleString()}원</span></div>
        <div class="cp-row"><span>배송비</span><span>${shipping === 0 ? '무료' : shipping.toLocaleString() + '원'}</span></div>
        <div class="cp-total">
          <span class="cp-total-label">TOTAL</span>
          <span class="cp-total-amt">${grandTotal.toLocaleString()}원</span>
        </div>
        <button class="cp-checkout" id="cp-checkout" ${selCount === 0 ? 'disabled' : ''}>CHECKOUT</button>
        <a href="shop.html" class="cp-continue">← CONTINUE SHOPPING</a>
      </aside>
    </div>`;

  bindEvents();
}

function bindEvents() {
  /* 전체 선택 */
  cpBody.querySelector('#cp-check-all')?.addEventListener('change', (e) => {
    const b = loadBag();
    b.forEach(i => i.selected = e.target.checked);
    saveBag(b);
    cpRender();
  });

  /* 개별 선택 */
  cpBody.querySelectorAll('.cp-item-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const b = loadBag();
      b[+cb.dataset.idx].selected = cb.checked;
      saveBag(b);
      cpRender();
    });
  });

  /* 수량 */
  cpBody.querySelectorAll('.cp-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const b = loadBag();
      const i = +btn.dataset.idx;
      if (btn.dataset.action === 'plus') b[i].qty++;
      else if (b[i].qty > 1) b[i].qty--;
      else b.splice(i, 1);
      saveBag(b);
      updateAllCounts();
      cpRender();
    });
  });

  /* 개별 삭제 */
  cpBody.querySelectorAll('.cp-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const b = loadBag();
      b.splice(+btn.dataset.idx, 1);
      saveBag(b);
      updateAllCounts();
      cpRender();
    });
  });

  /* 전체 삭제 */
  cpBody.querySelector('#cp-clear')?.addEventListener('click', () => {
    if (!confirm('장바구니를 모두 비울까요?')) return;
    saveBag([]);
    updateAllCounts();
    cpRender();
  });

  /* 결제 */
  cpBody.querySelector('#cp-checkout')?.addEventListener('click', () => {
    location.href = 'checkout.html';
  });
}

document.addEventListener('DOMContentLoaded', cpRender);
