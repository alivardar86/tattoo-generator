/* ══════════════════════════════════════════════
   SUPABASE CONFIG
══════════════════════════════════════════════ */
const SUPABASE_URL = 'https://uyjusadaakirelhuhgqr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MV17SMsY-3P8VlYsc5LBdQ_eWt-YkQT';

/* ══════════════════════════════════════════════
   ETİKETLER
══════════════════════════════════════════════ */
const questionLabels = {
  soru1:      'Ne hatırlatmalı?',
  soru_style: 'Stil tercihi',
  soru2:      'Vücut bölgesi',
  soru3:      'Boyut',
  soru4:      'His',
  soru5:      'Ne versin?'
};

const resultLabels = {
  tema:     'TEMA',
  form:     'FORM',
  stil:     'STİL',
  boyut:    'BOYUT',
  yerlesim: 'YERLEŞİM',
  his:      'HİS',
  siir:     'ŞİİR'
};

/* ══════════════════════════════════════════════
   STATE
══════════════════════════════════════════════ */
let accessToken = localStorage.getItem('sb_access_token');
let _submissions = [];

/* ══════════════════════════════════════════════
   DOM
══════════════════════════════════════════════ */
const loginView  = document.getElementById('login-view');
const dashView   = document.getElementById('dash-view');
const loginForm  = document.getElementById('login-form');
const loginBtn   = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const tbody      = document.getElementById('submissions-tbody');
const statsEl    = document.getElementById('stats');
const headerSub  = document.getElementById('header-sub');
const logoutBtn  = document.getElementById('logout-btn');
const modal      = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody  = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

/* ══════════════════════════════════════════════
   YARDIMCILAR
══════════════════════════════════════════════ */
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function isToday(iso) {
  const d = new Date(iso), t = new Date();
  return d.toDateString() === t.toDateString();
}

/* ══════════════════════════════════════════════
   SUPABASE REST API
══════════════════════════════════════════════ */
async function sbGet(path, token) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${token}`
    }
  });
  if (res.status === 401) { logout(); return null; }
  return res.json();
}

async function sbLogin(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY
    },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

async function sbLogout(token) {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: 'POST',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${token}`
    }
  });
}

/* ══════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════ */
function showLogin() {
  loginView.style.display = 'flex';
  dashView.style.display  = 'none';
}

function showDash() {
  loginView.style.display = 'none';
  dashView.style.display  = 'block';
}

function logout() {
  if (accessToken) sbLogout(accessToken);
  accessToken = null;
  localStorage.removeItem('sb_access_token');
  showLogin();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  loginBtn.disabled      = true;
  loginBtn.textContent   = 'Giriş yapılıyor...';

  const data = await sbLogin(
    document.getElementById('login-email').value.trim(),
    document.getElementById('login-password').value
  );

  if (data.access_token) {
    accessToken = data.access_token;
    localStorage.setItem('sb_access_token', accessToken);
    showDash();
    loadSubmissions();
  } else {
    loginError.textContent = 'Email veya şifre hatalı.';
    loginBtn.disabled      = false;
    loginBtn.textContent   = 'Giriş Yap';
  }
});

logoutBtn.addEventListener('click', () => {
  logout();
});

/* ══════════════════════════════════════════════
   VERİ
══════════════════════════════════════════════ */
async function loadSubmissions() {
  tbody.innerHTML = '<tr><td colspan="5" class="loading">Yükleniyor...</td></tr>';

  const data = await sbGet(
    '/rest/v1/submissions?order=created_at.desc&select=*',
    accessToken
  );

  if (!data) return; // 401 → logout zaten çağrıldı

  if (!Array.isArray(data)) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">Veri yüklenemedi.</td></tr>`;
    console.error('Supabase response:', data);
    return;
  }

  _submissions = data;
  renderStats(data);
  renderTable(data);
}

/* ══════════════════════════════════════════════
   İSTATİSTİKLER
══════════════════════════════════════════════ */
function renderStats(data) {
  const total = data.length;
  const today = data.filter(s => isToday(s.created_at)).length;
  const quiz  = data.filter(s => s.source === 'quiz').length;
  const wheel = data.filter(s => s.source === 'wheel').length;

  headerSub.textContent = `${total} kayıt — ${new Date().toLocaleTimeString('tr-TR')}`;

  statsEl.innerHTML = ['Toplam|' + total, 'Bugün|' + today, 'Quiz|' + quiz, 'Çark|' + wheel]
    .map(x => {
      const [label, val] = x.split('|');
      return `<div class="stat"><div class="stat-value">${val}</div><div class="stat-label">${label}</div></div>`;
    }).join('');
}

/* ══════════════════════════════════════════════
   TABLO
══════════════════════════════════════════════ */
function renderTable(data) {
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Henüz kayıt yok.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map((s, i) => {
    const badge = s.source === 'wheel'
      ? '<span class="badge badge-wheel">🎡 Çark</span>'
      : '<span class="badge badge-quiz">📝 Quiz</span>';

    return `
      <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
        <td class="name">${esc(s.name)}</td>
        <td class="email"><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></td>
        <td class="date">${formatDate(s.created_at)}</td>
        <td>${badge}</td>
        <td><button class="btn-detail" data-id="${esc(s.id)}">Detay →</button></td>
      </tr>
    `;
  }).join('');

  tbody.onclick = (e) => {
    const btn = e.target.closest('.btn-detail');
    if (btn) showModal(btn.dataset.id);
  };
}

/* ══════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════ */
function showModal(id) {
  const s = _submissions.find(x => x.id === id);
  if (!s) return;

  modalTitle.textContent = s.name;

  let html = `
    <div class="detail-section">
      <div class="detail-section-title">Kişi Bilgileri</div>
      <div class="detail-row">
        <span class="detail-key">İsim</span>
        <span class="detail-val">${esc(s.name)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Email</span>
        <span class="detail-val">
          <a href="mailto:${esc(s.email)}">${esc(s.email)}</a>
          <button class="copy-btn" onclick="copyText('${esc(s.email)}')">Kopyala</button>
        </span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Tarih</span>
        <span class="detail-val">${formatDate(s.created_at)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Kaynak</span>
        <span class="detail-val">${s.source === 'wheel' ? '🎡 Çark' : '📝 Quiz'}</span>
      </div>
      ${s.note ? `
      <div class="detail-row">
        <span class="detail-key">Not</span>
        <span class="detail-val">${esc(s.note)}</span>
      </div>` : ''}
    </div>
  `;

  if (s.prompt_result) {
    const r = s.prompt_result;
    const rows = Object.entries(resultLabels)
      .filter(([k]) => r[k])
      .map(([k, label]) => `
        <div class="detail-row">
          <span class="detail-key">${label}</span>
          <span class="detail-val">${esc(r[k])}</span>
        </div>
      `).join('');

    if (rows) html += `
      <div class="detail-section">
        <div class="detail-section-title">Dövme Sonucu</div>
        ${rows}
      </div>
    `;
  }

  if (s.answers && Object.keys(s.answers).length) {
    const rows = Object.entries(s.answers).map(([k, v]) => `
      <div class="detail-row">
        <span class="detail-key">${esc(questionLabels[k] || k)}</span>
        <span class="detail-val">${esc(v)}</span>
      </div>
    `).join('');

    html += `
      <div class="detail-section">
        <div class="detail-section-title">Kullanıcı Cevapları</div>
        ${rows}
      </div>
    `;
  }

  modalBody.innerHTML = html;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ══════════════════════════════════════════════
   BAŞLAT
══════════════════════════════════════════════ */
if (accessToken) {
  showDash();
  loadSubmissions();
} else {
  showLogin();
}
