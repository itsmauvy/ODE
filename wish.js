/* ── ODE SHARED WISHLIST ── (localStorage 'ode_wish') */
const WISH_KEY = 'ode_wish';

function wishLoad() {
  const raw = localStorage.getItem(WISH_KEY);
  if (raw === null) {
    /* 첫 방문: 데모용 기본 찜 목록 */
    const seed = ['1', '3', '5'];
    localStorage.setItem(WISH_KEY, JSON.stringify(seed));
    return seed;
  }
  try { return JSON.parse(raw); } catch { return []; }
}
function wishSave(list) { localStorage.setItem(WISH_KEY, JSON.stringify(list)); }

function wishHas(id) { return wishLoad().includes(String(id)); }

/* 토글: 추가하면 true, 제거하면 false 반환 */
function wishToggle(id) {
  id = String(id);
  const list = wishLoad();
  const i = list.indexOf(id);
  let added;
  if (i >= 0) { list.splice(i, 1); added = false; }
  else        { list.push(id);     added = true;  }
  wishSave(list);
  updateWishCounts();
  return added;
}

function wishCount() { return wishLoad().length; }

/* 헤더의 WISH 개수 표시(.wish-count-el) 동기화 */
function updateWishCounts() {
  document.querySelectorAll('.wish-count-el').forEach(el => el.textContent = wishCount());
}

document.addEventListener('DOMContentLoaded', updateWishCounts);
