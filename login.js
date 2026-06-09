/* ── CURSOR ── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.to(cursor, { x: mx, y: my, duration: 0.08, ease: 'none' });
});
(function loop() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  gsap.set(follower, { x: fx, y: fy });
  requestAnimationFrame(loop);
})();

/* ── ENTRANCE ANIMATION ── */
gsap.from('.left-panel', { x: -40, opacity: 0, duration: 1, ease: 'power3.out' });
gsap.from('.form-tag',   { y: 16, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' });
gsap.from('.form-title', { y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
gsap.from('.field-group, .form-options, .btn-submit, .divider, .social-btns, .switch-text', {
  y: 16, opacity: 0, duration: 0.6, stagger: 0.07, delay: 0.4, ease: 'power3.out'
});

/* ── SECTION SWITCH ── */
const loginSection  = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');

function showSection(show, hide) {
  hide.classList.add('hidden');
  show.classList.remove('hidden');
  gsap.from(show.querySelectorAll('.field-group, .form-tag, .form-title, .btn-submit, .switch-text, .terms-group, .field-row'), {
    y: 14, opacity: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out'
  });
}

document.getElementById('go-signup').addEventListener('click', () => showSection(signupSection, loginSection));
document.getElementById('go-login').addEventListener('click',  () => showSection(loginSection, signupSection));

/* ── PASSWORD TOGGLE ── */
function setupPwToggle(inputId, toggleId, showId, hideId) {
  const input  = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;
  const eyeShow = document.getElementById(showId);
  const eyeHide = document.getElementById(hideId);
  toggle.addEventListener('click', () => {
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    if (eyeShow) eyeShow.classList.toggle('hidden', isPass);
    if (eyeHide) eyeHide.classList.toggle('hidden', !isPass);
  });
}
setupPwToggle('login-pw', 'login-pw-toggle', 'eye-show', 'eye-hide');

document.getElementById('signup-pw-toggle')?.addEventListener('click', function() {
  const input = document.getElementById('signup-pw');
  input.type = input.type === 'password' ? 'text' : 'password';
});

/* ── PASSWORD STRENGTH ── */
document.getElementById('signup-pw')?.addEventListener('input', function() {
  const val = this.value;
  const bar = document.getElementById('strength-bar');
  const label = document.getElementById('strength-label');
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const configs = [
    { w: '0%',   bg: 'transparent', text: '' },
    { w: '25%',  bg: '#e74c3c',     text: '취약' },
    { w: '50%',  bg: '#e67e22',     text: '보통' },
    { w: '75%',  bg: '#f1c40f',     text: '양호' },
    { w: '100%', bg: '#27ae60',     text: '강함' },
  ];
  const c = configs[score];
  bar.style.width = c.w;
  bar.style.background = c.bg;
  label.textContent = c.text;
  label.style.color = c.bg;
});

/* ── 전체 동의 ── */
const termsAll   = document.getElementById('terms-all');
const termsItems = document.querySelectorAll('.terms-item');
termsAll?.addEventListener('change', () => {
  termsItems.forEach(cb => cb.checked = termsAll.checked);
});
termsItems.forEach(cb => {
  cb.addEventListener('change', () => {
    termsAll.checked = [...termsItems].every(c => c.checked);
  });
});

/* ── 생년월일 자동 포맷 ── */
document.getElementById('signup-birth')?.addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '');
  if (v.length > 4) v = v.slice(0,4) + '.' + v.slice(4);
  if (v.length > 7) v = v.slice(0,7) + '.' + v.slice(7);
  this.value = v.slice(0, 10);
});

/* ── TOAST ── */
const toast = document.getElementById('toast');
function showToast(msg, duration = 2400) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── VALIDATION ── */
function setError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (msg) {
    input?.classList.add('error');
    if (err) err.textContent = msg;
    return false;
  } else {
    input?.classList.remove('error');
    if (err) err.textContent = '';
    return true;
  }
}

/* ── LOGIN SUBMIT ── */
document.getElementById('login-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pw    = document.getElementById('login-pw').value;

  let ok = true;
  ok = setError('login-email', 'login-email-err', !email ? '이메일을 입력해주세요.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '올바른 이메일 형식이 아닙니다.' : '') && ok;
  ok = setError('login-pw', 'login-pw-err', !pw ? '비밀번호를 입력해주세요.' : pw.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '') && ok;
  if (!ok) return;

  const btnText    = document.getElementById('login-btn-text');
  const spinner    = document.getElementById('login-spinner');
  btnText.classList.add('hidden');
  spinner.classList.remove('hidden');

  setTimeout(() => {
    btnText.classList.remove('hidden');
    spinner.classList.add('hidden');
    showToast('로그인되었습니다. 환영합니다!');
    setTimeout(() => window.location.href = 'index.html', 1800);
  }, 1400);
});

/* ── SIGNUP SUBMIT ── */
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name  = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const pw    = document.getElementById('signup-pw').value;
  const pw2   = document.getElementById('signup-pw2').value;
  const t1    = document.getElementById('terms1').checked;
  const t2    = document.getElementById('terms2').checked;

  let ok = true;
  ok = setError('signup-name',  'signup-name-err',  !name ? '이름을 입력해주세요.' : '') && ok;
  ok = setError('signup-email', 'signup-email-err', !email ? '이메일을 입력해주세요.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '올바른 이메일 형식이 아닙니다.' : '') && ok;
  ok = setError('signup-pw',    'signup-pw-err',    pw.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '') && ok;
  ok = setError('signup-pw2',   'signup-pw2-err',   pw !== pw2 ? '비밀번호가 일치하지 않습니다.' : '') && ok;

  const termsErr = document.getElementById('terms-err');
  if (!t1 || !t2) {
    termsErr.textContent = '필수 약관에 동의해주세요.';
    ok = false;
  } else {
    termsErr.textContent = '';
  }
  if (!ok) return;

  showToast('회원가입이 완료되었습니다!');
  setTimeout(() => showSection(loginSection, signupSection), 1800);
});
