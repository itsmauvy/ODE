/* ── ODE SHARED NAV: MEGA MENU + SEARCH ── */

/* ── MEGA MENU ── */
const megaProducts = [
  { id:'1', name:'POCKET BLUSH',        sub:'Fig Mousse',           desc:'Soft Balm Blush',      img:'images/ode pocket blush_close.png',    cat:['all','best','face'],       badge:''     },
  { id:'2', name:'POCKET TINT',         sub:'Pink Guava',           desc:'Dewy Lip Tint',        img:'images/ode lip tint.png',              cat:['all','best','lip'],        badge:''     },
  { id:'3', name:'SOLID PERFUME STICK', sub:'Pocket Perfume Stick', desc:'Pocket Perfume Stick', img:'images/ode solid perfume stick .png',  cat:['all','fragrance'],         badge:''     },
  { id:'4', name:'BODY MIST',           sub:'Coconut Body Mist',    desc:'Scented Body Mist',    img:'images/ode body mist 1.png',           cat:['all','body','new'],        badge:''     },
  { id:'5', name:'SPF EYE PATCH',       sub:'SPF Eye Patch',        desc:'SPF Eye Patch',        img:'images/ode eye patch_nobg.png',        cat:['all','face','new'],        badge:''     },
  { id:'6', name:'POUCH',               sub:'ODE Pouch',            desc:'ODE Pouch',            img:'images/ode pouch_nobg.png',            cat:['all','etc','new'],         badge:''     },
  { id:'7', name:'POCKET BLUSH',        sub:'Coconut',              desc:'Soft Balm Blush',      img:'images/coconut pocket blush 1.png',    cat:['all','new'],               badge:''     },
];

const collections = [
  { name:'COCONUT COLLECTION',    img:'images/coconut collection.jpg',    badge:'NEW' },
  { name:'FIG COLLECTION',        img:'images/fig collection.jpg' },
  { name:'GUAVA COLLECTION',      img:'images/guava collection.jpg' },
  { name:'TANGERINE COLLECTION',  img:'images/tangerine collection.jpg' },
  { name:'CHERRY COLLECTION',     img:'images/cherry collection.jpg' },
  { name:'WATERMELON COLLECTION', img:'images/watermelon collection.jpg' },
];

const shopAllLabels = {
  all:'SHOP ALL', best:'SHOP BEST SELLERS', new:'SHOP NEW ARRIVALS',
  lip:'SHOP LIP', face:'SHOP FACE', fragrance:'SHOP FRAGRANCE',
  body:'SHOP BODY', etc:'SHOP ETC', collection:'SHOP ALL COLLECTIONS',
};

document.addEventListener('DOMContentLoaded', () => {
  const megaMenu   = document.getElementById('mega-menu');
  const megaProdsEl= document.getElementById('mega-products');
  const megaTabs   = document.querySelectorAll('.mega-tab');
  const navShop    = document.getElementById('nav-shop');

  if (megaMenu && navShop) {
    let menuTimer = null;

    function renderMegaProducts(cat) {
      const shopAllEl = document.querySelector('.mega-shop-all');
      if (shopAllEl) shopAllEl.textContent = (shopAllLabels[cat] || 'SHOP ALL') + ' →';

      if (cat === 'collection') {
        megaProdsEl.innerHTML = `<div class="mega-collection-grid">
          ${collections.map(c => `
            <div class="mega-col-card">
              <img src="${c.img}" alt="${c.name}" />
              ${c.badge ? `<span class="mega-col-new-badge">${c.badge}</span>` : ''}
            </div>`).join('')}
        </div>`;
        return;
      }
      const list = (cat === 'all' ? megaProducts : megaProducts.filter(p => p.cat.includes(cat))).slice(0, 4);
      if (!list.length) {
        megaProdsEl.innerHTML = `<p style="color:var(--text-light);font-size:13px;padding-top:16px;">해당 카테고리의 제품이 없습니다.</p>`;
        return;
      }
      const useColor = cat === 'best' || cat === 'new';
      megaProdsEl.innerHTML = list.map(p => `
        <a class="mega-card" href="product.html?id=${p.id}" data-id="${p.id}">
          ${p.badge ? `<span class="mega-card-badge ${p.badge==='NEW'?'new-badge':''}">${p.badge}</span>` : '<div style="height:20px;margin-bottom:14px"></div>'}
          <img class="mega-card-img" src="${p.img}" alt="${p.name}" />
          <div class="mega-card-name">${p.name}</div>
          <div class="mega-card-sub">${useColor ? p.sub : p.desc}</div>
        </a>`).join('');
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
  }

  /* ── INLINE SEARCH ── */
  const navSearch = document.getElementById('nav-search');
  const navLabel  = document.getElementById('nav-search-label');
  const navInput  = document.getElementById('nav-search-input');
  if (!navSearch || !navLabel || !navInput) return;

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
    const matched = megaProducts.filter(p =>
      p.name.toLowerCase().includes(query) || p.sub.toLowerCase().includes(query)
    );
    navResultsEl.classList.add('show');
    if (!matched.length) {
      navResultsEl.innerHTML = `<div class="nav-search-no-result">검색 결과가 없습니다.</div>`;
      return;
    }
    navResultsEl.innerHTML = matched.map(p => `
      <a class="nav-search-result-item" href="product.html?id=${p.id}">
        <div class="nav-search-result-name">${p.name}</div>
        <div class="nav-search-result-sub">${p.sub}</div>
      </a>`).join('');
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
});
