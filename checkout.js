/* ── ODE CHECKOUT JS ── */

const FREE_SHIPPING = 50000;
const SHIPPING_FEE  = 3000;

/* ── 요약 렌더 ── */
function renderSummary() {
  const allBag = loadBag();
  const bag    = getSelected(allBag);
  const container = document.getElementById('co-summary-items');

  if (!allBag.length) {
    container.innerHTML = '<div class="co-summary-empty">장바구니가 비어 있어요.<br/><a href="shop.html">쇼핑 계속하기 →</a></div>';
    updateCalc([]);
    return;
  }

  const allSelected = allBag.every(i => i.selected !== false);

  container.innerHTML = `
    <div class="co-sel-header">
      <label class="co-sel-label">
        <input type="checkbox" class="co-chk" id="co-check-all" ${allSelected ? 'checked' : ''} />
        <span class="co-chk-box"></span>
        <span class="co-chk-text">전체 선택 (${bag.length}/${allBag.length})</span>
      </label>
      <button class="co-clear-btn" id="co-clear-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M9 6V4h6v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        CLEAR
      </button>
    </div>
    ${allBag.map((item, idx) => {
      const p = PRODUCT_MAP[item.id];
      if (!p) return '';
      const checked = item.selected !== false;
      return `
      <div class="co-summary-item">
        <label class="co-sel-label co-item-chk-wrap">
          <input type="checkbox" class="co-chk co-item-chk" data-idx="${idx}" ${checked ? 'checked' : ''} />
          <span class="co-chk-box"></span>
        </label>
        <div class="co-summary-img-wrap">
          <img class="co-summary-img" src="${p.img}" alt="${p.name}" />
          <span class="co-summary-badge">${item.qty}</span>
        </div>
        <div class="co-summary-info">
          <p class="co-summary-name">${p.name}</p>
          <p class="co-summary-color">${item.color || p.defaultColor}</p>
        </div>
        <div class="co-summary-right">
          <span class="co-summary-price">${(p.price * item.qty).toLocaleString()}원</span>
          <button class="co-item-remove" data-idx="${idx}">✕</button>
        </div>
      </div>`;
    }).join('')}`;

  /* 전체 선택 */
  container.querySelector('#co-check-all')?.addEventListener('change', e => {
    const b2 = loadBag();
    b2.forEach(i => i.selected = e.target.checked);
    saveBag(b2);
    renderSummary();
  });

  /* 개별 선택 */
  container.querySelectorAll('.co-item-chk').forEach(cb => {
    cb.addEventListener('change', () => {
      const b2 = loadBag();
      b2[+cb.dataset.idx].selected = cb.checked;
      saveBag(b2);
      renderSummary();
    });
  });

  /* 개별 삭제 */
  container.querySelectorAll('.co-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const b2 = loadBag();
      b2.splice(+btn.dataset.idx, 1);
      saveBag(b2);
      renderSummary();
    });
  });

  /* CLEAR */
  container.querySelector('#co-clear-btn')?.addEventListener('click', () => {
    if (!confirm('장바구니를 비울까요?')) return;
    saveBag([]);
    renderSummary();
  });

  updateCalc(bag);
}

function updateCalc(bag) {
  const subtotal = bag.reduce((s, item) => {
    const p = PRODUCT_MAP[item.id];
    return s + (p ? p.price * item.qty : 0);
  }, 0);

  const shipping = subtotal > 0 && subtotal >= FREE_SHIPPING ? 0 : subtotal > 0 ? SHIPPING_FEE : 0;
  const total    = subtotal + shipping;

  document.getElementById('co-subtotal').textContent = subtotal.toLocaleString() + '원';
  document.getElementById('co-shipping').textContent = shipping === 0 && subtotal > 0 ? '무료' : subtotal === 0 ? '-' : shipping.toLocaleString() + '원';
  document.getElementById('co-total').textContent    = total.toLocaleString() + '원';

  const note = document.getElementById('co-free-ship-note');
  if (subtotal > 0 && shipping > 0) {
    note.textContent = `${(FREE_SHIPPING - subtotal).toLocaleString()}원 더 구매하면 무료 배송`;
  } else if (subtotal >= FREE_SHIPPING) {
    note.textContent = '무료 배송 적용';
  } else {
    note.textContent = '';
  }

  const submitBtn = document.getElementById('co-submit');
  if (submitBtn) {
    submitBtn.disabled = subtotal === 0;
    submitBtn.style.opacity = subtotal === 0 ? '0.4' : '';
    submitBtn.style.cursor  = subtotal === 0 ? 'not-allowed' : '';
  }
}

/* ── 결제 수단 선택 ── */
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const detail = document.getElementById('co-card-detail');
    detail.classList.toggle('visible', radio.value === 'card' && radio.checked);
  });
});
document.getElementById('co-card-detail').classList.add('visible');

/* ── 카드 번호 자동 포맷 ── */
document.getElementById('card-num').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
});
document.getElementById('card-exp').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
  e.target.value = v;
});

/* ── 전체 동의 ── */
const agreeAll   = document.getElementById('agree-all');
const agreeItems = document.querySelectorAll('.agree-item');
agreeAll.addEventListener('change', () => {
  agreeItems.forEach(c => c.checked = agreeAll.checked);
});
agreeItems.forEach(c => {
  c.addEventListener('change', () => {
    agreeAll.checked = [...agreeItems].every(i => i.checked);
  });
});

/* ── 결제하기 ── */
document.getElementById('co-submit').addEventListener('click', () => {
  const required = ['recipient', 'phone', 'address1'];
  for (const id of required) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.focus();
      el.style.borderColor = '#c0705a';
      el.addEventListener('input', () => el.style.borderColor = '', { once: true });
      showToast('필수 항목을 입력해주세요.');
      return;
    }
  }
  const requiredAgree = [...agreeItems].slice(0, 2);
  if (!requiredAgree.every(c => c.checked)) {
    showToast('필수 약관에 동의해주세요.');
    return;
  }
  showToast('결제가 완료되었습니다 ✓');
  setTimeout(() => { location.href = 'index.html'; }, 1800);
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

renderSummary();
