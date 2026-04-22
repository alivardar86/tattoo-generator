/* ══════════════════════════════════════════════
   SUPABASE CONFIG — index.html ile aynı değerler
══════════════════════════════════════════════ */
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ══════════════════════════════════════════════
   SORU ETİKETLERİ (admin görünümü için)
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

// Submission cache (modal için)
let _submissions = [];

/* ══════════════════════════════════════════════
   YARDIMCI: HTML escape (XSS koruması)
══════════════════════════════════════════════ */
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function isToday(isoStr) {
  const d = new Date(isoStr);
  const t = new Date();
  return d.getDate() === t.getDate() &&
         d.getMonth() === t.getMonth() &&
         d.getFullYear() === t.getFullYear();
}

/* ══════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════ */
async function init() {
  const { data: { session } } = await sb.auth.getSession();
  session ? showDash() : showLogin();
}

function showLogin() {
  loginView.style.display = 'flex';
  dashView.style.display  = 'none';
}

async function showDash() {
  loginView.style.display = 'none';
  dashView.style.display  = 'block';
  await loadSubmissions();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  loginBtn.disabled      = true;
  loginBtn.textContent   = 'Giriş yapılıyor...';

  const { error } = await sb.auth.signInWithPassword({
    email:    document.getElementById('login-email').value.trim(),
    password: document.getElementById('login-password').value
  });

  if (error) {
    loginError.textContent = 'Email veya şifre hatalı.';
    loginBtn.disabled      = false;
    loginBtn.textContent   = 'Giriş Yap';
  } else {
    showDash();
  }
});

logoutBtn.addEventListener('click', async () => {
  await sb.auth.signOut();
  showLogin();
});

/* ══════════════════════════════════════════════
   VERİ YÜKLEME
══════════════════════════════════════════════ */
async function loadSubmissions() {
  tbody.innerHTML = '<tr><td colspan="5" class="loading">Yükleniyor...</td></tr>';

  const { data, error } = await sb
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">Veriler yüklenemedi: ${esc(error.message)}</td></tr>`;
    return;
  }

  _submissions = data || [];
  renderStats(_submissions);
  renderTable(_submissions);
}

/* ══════════════════════════════════════════════
   İSTATİSTİKLER
══════════════════════════════════════════════ */
function renderStats(data) {
  const total  = data.length;
  const today  = data.filter(s => isToday(s.created_at)).length;
  const quiz   = data.filter(s => s.source === 'quiz').length;
  const wheel  = data.filter(s => s.source === 'wheel').length;

  headerSub.textContent = `${total} kayıt — son güncelleme: ${new Date().toLocaleTimeString('tr-TR')}`;

  statsEl.innerHTML = `
    <div class="stat">
      <div class="stat-value">${total}</div>
      <div class="stat-label">Toplam</div>
    </div>
    <div class="stat">
      <div class="stat-value">${today}</div>
      <div class="stat-label">Bugün</div>
    </div>
    <div class="stat">
      <div class="stat-value">${quiz}</div>
      <div class="stat-label">Quiz</div>
    </div>
    <div class="stat">
      <div class="stat-value">${wheel}</div>
      <div class="stat-label">Çark</div>
    </div>
  `;
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

  // Event delegation — tek listener, tüm detay butonları için
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (btn) showModal(btn.dataset.id);
  }, { once: true }); // once: her render'da yeniden bağlanmayı önle

  // Birden fazla render olabileceği için tekrar bağla
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

  // Kişi bilgileri
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

  // Dövme sonucu
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

    html += `
      <div class="detail-section">
        <div class="detail-section-title">Dövme Sonucu</div>
        ${rows}
      </div>
    `;
  }

  // Ham cevaplar
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
init();
