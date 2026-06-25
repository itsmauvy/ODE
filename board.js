/* ── ODE BOARD (목록 / 보기 / 쓰기) — 모듈 없이 localStorage 데모 ── */

const POSTS_KEY = 'ode_posts';

const CAT_LABEL = { notice: '공지', review: '리뷰', qna: 'Q&A', free: '자유' };

/* 데모 시드 데이터 */
const SEED_POSTS = [
  { id: 1, cat: 'notice', title: 'ODE 2026 S/S 컬렉션 런칭 안내', author: 'ODE', date: '2026.06.20', views: 482, likes: 36, secret: false,
    body: '안녕하세요, ODE입니다.\n\n2026 S/S 컬렉션이 정식 런칭되었습니다.\n포켓 블러셔, 솔리드 퍼퓸 스틱 등 시그니처 라인을 만나보세요.\n\n런칭 기념 5만원 이상 구매 시 무료배송 혜택을 드립니다.\n감사합니다.' },
  { id: 2, cat: 'notice', title: '여름 휴무 및 배송 일정 안내', author: 'ODE', date: '2026.06.18', views: 210, likes: 8, secret: false,
    body: '7월 28일~30일은 여름 휴무로 배송이 순차 지연됩니다.\n주문은 정상 접수되며, 8월 1일부터 순차 출고됩니다.' },
  { id: 3, cat: 'review', title: '포켓 블러셔 피그 무스 인생 블러셔예요', author: 'j****a', date: '2026.06.17', views: 1024, likes: 152, secret: false,
    body: '발색도 좋고 지속력도 만족스러워요.\n휴대하기 좋은 사이즈라 파우치에 쏙 들어가서 너무 좋아요.\n재구매 의사 100%!' },
  { id: 4, cat: 'review', title: '솔리드 퍼퓸 스틱 우디 피그 향 최고', author: 'm****n', date: '2026.06.15', views: 768, likes: 91, secret: false,
    body: '은은하게 오래 가는 향이라 데일리로 쓰기 좋아요.\n끈적임 없이 발리는 점이 가장 마음에 듭니다.' },
  { id: 5, cat: 'qna', title: '배송 출고는 보통 며칠 걸리나요?', author: 's****k', date: '2026.06.14', views: 142, likes: 2, secret: false,
    body: '주말에 주문했는데 언제쯤 받아볼 수 있을까요?' },
  { id: 6, cat: 'qna', title: '주문한 상품 색상 변경 문의드립니다', author: 'h****y', date: '2026.06.12', views: 88, likes: 0, secret: true,
    body: '비밀글입니다.' },
  { id: 7, cat: 'free', title: 'ODE 파우치 활용법 공유해요', author: 'l****e', date: '2026.06.10', views: 305, likes: 41, secret: false,
    body: '여행 갈 때 화장품 파우치로 쓰는데 사이즈가 딱이에요.\n다들 어떻게 쓰시는지 궁금해요!' },
];

function loadPosts() {
  const raw = localStorage.getItem(POSTS_KEY);
  if (raw === null) { localStorage.setItem(POSTS_KEY, JSON.stringify(SEED_POSTS)); return [...SEED_POSTS]; }
  try { return JSON.parse(raw); } catch { return [...SEED_POSTS]; }
}
function savePosts(p) { localStorage.setItem(POSTS_KEY, JSON.stringify(p)); }

function fmtToday() {
  /* YYYY.MM.DD (브라우저 로컬 기준) */
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

/* ════════ 목록 페이지 ════════ */
function initList() {
  const listEl  = document.getElementById('board-list');
  const totalEl = document.getElementById('board-total');
  if (!listEl) return;

  const params = new URLSearchParams(location.search);
  let activeCat = params.get('cat') || 'all';

  const tabs = document.querySelectorAll('.board-tab');
  tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.cat === activeCat);
    t.addEventListener('click', () => {
      activeCat = t.dataset.cat;
      tabs.forEach(x => x.classList.toggle('active', x === t));
      render();
    });
  });

  function render() {
    const all = loadPosts().slice().reverse(); // 최신순
    const list = activeCat === 'all' ? all : all.filter(p => p.cat === activeCat);

    if (totalEl) totalEl.innerHTML = `전체 <strong>${list.length}</strong>건`;

    if (!list.length) {
      listEl.innerHTML = `
        <div class="board-row is-head">
          <span class="brow-no">NO</span><span>제목</span><span class="brow-author">작성자</span><span class="brow-date">날짜</span><span class="brow-views">조회</span>
        </div>
        <p class="board-empty">아직 게시글이 없습니다.</p>`;
      return;
    }

    listEl.innerHTML = `
      <div class="board-row is-head">
        <span class="brow-no">NO</span><span>제목</span><span class="brow-author">작성자</span><span class="brow-date">날짜</span><span class="brow-views">조회</span>
      </div>
      ${list.map((p, i) => `
        <a class="board-row" href="board-view.html?id=${p.id}">
          <span class="brow-no">${p.cat === 'notice' ? '공지' : list.length - i}</span>
          <span class="brow-title">
            <span class="brow-cat ${p.cat}">${CAT_LABEL[p.cat]}</span>
            <span class="brow-title-text">${p.secret ? '🔒 ' : ''}${escapeHtml(p.title)}</span>
          </span>
          <span class="brow-author">${escapeHtml(p.author)}</span>
          <span class="brow-date">${p.date}</span>
          <span class="brow-views">${p.views.toLocaleString()}</span>
        </a>`).join('')}`;
  }

  render();
}

/* ════════ 보기 페이지 ════════ */
function initView() {
  const root = document.getElementById('post-view');
  if (!root) return;

  const id = Number(new URLSearchParams(location.search).get('id'));
  const posts = loadPosts();
  const idx = posts.findIndex(p => p.id === id);

  if (idx === -1) {
    root.innerHTML = `<div class="post"><p class="board-empty">존재하지 않는 게시글입니다.</p>
      <div style="text-align:center;margin-top:24px"><a class="post-back" href="board.html">목록으로</a></div></div>`;
    return;
  }

  /* 조회수 +1 */
  posts[idx].views = (posts[idx].views || 0) + 1;
  savePosts(posts);
  const post = posts[idx];

  /* 최신순 정렬 기준의 이전/다음 */
  const ordered = posts.slice().reverse();
  const oIdx = ordered.findIndex(p => p.id === id);
  const prev = ordered[oIdx - 1]; // 더 최신
  const next = ordered[oIdx + 1]; // 더 이전

  root.innerHTML = `
    <article class="post">
      <span class="post-cat">${CAT_LABEL[post.cat]}</span>
      <h1 class="post-title">${post.secret ? '🔒 ' : ''}${escapeHtml(post.title)}</h1>
      <div class="post-meta">
        <span>작성자 <strong>${escapeHtml(post.author)}</strong></span>
        <span>${post.date}</span>
        <span>조회 ${post.views.toLocaleString()}</span>
      </div>
      <div class="post-body">${escapeHtml(post.body)}</div>

      <div class="post-actions">
        <button class="post-like" id="post-like">
          <span id="like-heart">♡</span> 좋아요 <span id="like-count">${post.likes || 0}</span>
        </button>
        <a class="post-back" href="board.html">목록으로</a>
      </div>

      <nav class="post-nav">
        ${prev ? `<a class="post-nav-item" href="board-view.html?id=${prev.id}"><span class="post-nav-label">이전글</span><span>${escapeHtml(prev.title)}</span></a>` : ''}
        ${next ? `<a class="post-nav-item" href="board-view.html?id=${next.id}"><span class="post-nav-label">다음글</span><span>${escapeHtml(next.title)}</span></a>` : ''}
      </nav>
    </article>`;

  /* 좋아요 (세션 토글) */
  const likeBtn = document.getElementById('post-like');
  let liked = false;
  likeBtn.addEventListener('click', () => {
    const cur = loadPosts();
    const t = cur.find(p => p.id === id);
    liked = !liked;
    t.likes = (t.likes || 0) + (liked ? 1 : -1);
    savePosts(cur);
    document.getElementById('like-count').textContent = t.likes;
    document.getElementById('like-heart').textContent = liked ? '♥' : '♡';
  });
}

/* ════════ 쓰기 페이지 ════════ */
function initWrite() {
  const form = document.getElementById('write-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cat   = document.getElementById('w-cat').value;
    const title = document.getElementById('w-title').value.trim();
    const author= document.getElementById('w-author').value.trim();
    const body  = document.getElementById('w-body').value.trim();
    const secret= document.getElementById('w-secret').checked;
    const err   = document.getElementById('w-err');

    if (!title)  { err.textContent = '제목을 입력해 주세요.';  return; }
    if (!author) { err.textContent = '작성자를 입력해 주세요.'; return; }
    if (!body)   { err.textContent = '내용을 입력해 주세요.';  return; }
    err.textContent = '';

    const posts = loadPosts();
    const nextId = posts.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    posts.push({ id: nextId, cat, title, author, date: fmtToday(), views: 0, likes: 0, secret, body });
    savePosts(posts);

    location.href = `board-view.html?id=${nextId}`;
  });
}

/* ── util ── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── init ── */
document.addEventListener('DOMContentLoaded', () => {
  initList();
  initView();
  initWrite();
});
