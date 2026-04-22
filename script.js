const questions = [
  {
    key: "soru1",
    text: "Bu dövme sana ne hatırlatmalı?",
    options: [
      "Bir kişiyi",
      "Bir dönemi",
      "Bir kararı",
      "Hiçbir şeyi — sadece güzel olsun"
    ]
  },
  {
    key: "soru2",
    text: "Vücudunda nereyi düşünüyorsun?",
    options: ["Kol", "Bacak", "Sırt / Göğüs", "Henüz bilmiyorum"]
  },
  {
    key: "soru3",
    text: "Boyut olarak?",
    options: ["Küçük, fark edilmesin", "Orta, dengeli", "Büyük, statement"]
  },
  {
    key: "soru4",
    text: "Hangi his daha yakın?",
    options: [
      "Keskin ve güçlü",
      "Yumuşak ve akışkan",
      "Kaotik ve serbest",
      "Minimal ve sessiz"
    ]
  },
  {
    key: "soru5",
    text: "Bu dövme sana ne versin?",
    options: ["Hatırlama", "Cesaret", "Huzur", "Sadece estetik"]
  }
];

// --- KEY NORMALIZATION ---
const keyMap = {
  soru1: {
    "Bir kişiyi": "kisiyi",
    "Bir dönemi": "donemi",
    "Bir kararı": "karari",
    "Hiçbir şeyi — sadece güzel olsun": "estetik"
  },
  soru3: {
    "Küçük, fark edilmesin": "kucuk",
    "Orta, dengeli": "orta",
    "Büyük, statement": "buyuk"
  },
  soru4: {
    "Keskin ve güçlü": "keskin",
    "Yumuşak ve akışkan": "yumusak",
    "Kaotik ve serbest": "kaotik",
    "Minimal ve sessiz": "minimal"
  }
};

function makeKey(s1, s3, s4) {
  return `${keyMap.soru1[s1]}_${keyMap.soru3[s3]}_${keyMap.soru4[s4]}`;
}

// --- 20 HANDCRAFTED COMBINATIONS ---
// Key format: soru1_soru3_soru4
const combinations = {
  "kisiyi_kucuk_minimal": {
    tema: "Anı",
    form: "Tek çizgi, kesintisiz, neredeyse soyut",
    boyut: "2–4cm",
    yerlesim: "Bilek içi veya parmak yanı",
    his: "Sessiz sadakat",
    siir: "Birinin varlığını fısıldar gibi taşıyacak.\nGörünmez ama her zaman orada."
  },
  "kisiyi_kucuk_keskin": {
    tema: "Özlem",
    form: "İnce, keskin hatlar — bir tarih ya da koordinat gibi",
    boyut: "2–4cm",
    yerlesim: "Boyun altı veya kaburga",
    his: "Derin, keskin",
    siir: "Uzaklık ölçülmez.\nAma bu iz her zaman yakın."
  },
  "kisiyi_orta_yumusak": {
    tema: "Bağlılık",
    form: "Akışkan, organik bir form — belki bir siluet",
    boyut: "6–8cm",
    yerlesim: "Ön kol veya köprücük kemiği",
    his: "Sıcak, sakin",
    siir: "Sevgi her zaman söze ihtiyaç duymaz.\nBazen sadece ciltte bir şekil yeterlidir."
  },
  "kisiyi_buyuk_yumusak": {
    tema: "Sevgi",
    form: "Geniş, sarmalayan formlar — yumuşak geçişler",
    boyut: "12–15cm",
    yerlesim: "Sırt veya göğüs",
    his: "Derin, kucaklayıcı",
    siir: "Bazı insanlar iz bırakmaz.\nSen iz bırakmalarına izin verdin. Bu güzel."
  },
  "kisiyi_buyuk_kaotik": {
    tema: "Kayıp",
    form: "Dağınık, parçalı çizgiler — tamamlanmamış formlar",
    boyut: "15cm+",
    yerlesim: "Sırt veya uyluk",
    his: "Ağır, dürüst",
    siir: "Kayıp düzgün durmaz.\nBu çizgiler de durmuyor. İkisi de gerçek."
  },
  "donemi_kucuk_minimal": {
    tema: "Geçiş",
    form: "Soyut bir nokta, virgül ya da yatay çizgi",
    boyut: "1–3cm",
    yerlesim: "Bilek veya parmak",
    his: "Hafif, nefes gibi",
    siir: "O dönem kapandı.\nBu küçük iz, kapıyı kapatan elin izi."
  },
  "donemi_orta_keskin": {
    tema: "Kapanış",
    form: "Geometrik, köşeli hatlar — belki kırık bir şekil",
    boyut: "6–10cm",
    yerlesim: "Ön kol veya baldır",
    his: "Kararlı, net",
    siir: "O dönem bitti.\nBu iz, geride kalanın değil, ileriye bakışın sembolü."
  },
  "donemi_orta_yumusak": {
    tema: "Dönüşüm",
    form: "Organik, akışkan çizgiler — bir şeyin başka bir şeye evrimi",
    boyut: "6–9cm",
    yerlesim: "Kol veya köprücük kemiği",
    his: "Huzurlu ama güçlü",
    siir: "Geçmişi değil, ondan öğrendiklerini taşıyacak bir iz.\nKüçük ama unutulmaz."
  },
  "donemi_buyuk_kaotik": {
    tema: "Kırılma",
    form: "Serbest fırça darbeleri, düzensiz geometri",
    boyut: "15cm+",
    yerlesim: "Sırt veya uyluk",
    his: "Ham, dürüst",
    siir: "Bazı dönemler nazikçe bitmez.\nBu dövme o gerçeği gizlemiyor."
  },
  "donemi_buyuk_keskin": {
    tema: "Son",
    form: "Keskin, net geometri — bir kapı ya da çerçeve",
    boyut: "12–18cm",
    yerlesim: "Sırt ortası veya göğüs",
    his: "Ağır, kalıcı",
    siir: "Her son bir başlangıca zemin hazırlar.\nBu iz o zemini işaret ediyor."
  },
  "karari_kucuk_minimal": {
    tema: "Odak",
    form: "Tek bir sembol, geometrik ve yalın",
    boyut: "2–3cm",
    yerlesim: "Bilek içi veya parmak",
    his: "Sessiz, güçlü",
    siir: "Büyük kararlar küçük anlarda alınır.\nBu iz o anı tutuyor."
  },
  "karari_orta_keskin": {
    tema: "Kararlılık",
    form: "Keskin, belirgin hatlar — hiçbir belirsizlik yok",
    boyut: "6–10cm",
    yerlesim: "Ön kol veya baldır",
    his: "Net, güçlü",
    siir: "Bu karar kolay olmadı.\nAma doğruydu. Her baktığında hatırlayacaksın."
  },
  "karari_orta_yumusak": {
    tema: "Denge",
    form: "Akışkan ama yapılandırılmış — yin-yang enerjisi",
    boyut: "6–8cm",
    yerlesim: "Kol veya göğüs",
    his: "Huzurlu, kararlı",
    siir: "Zor kararlar bazen en yumuşak yerlere yerleşir.\nOrası senin kararın için doğru yer."
  },
  "karari_buyuk_keskin": {
    tema: "İrade",
    form: "Güçlü, simetrik geometri — bir ok ya da yapı",
    boyut: "12–18cm",
    yerlesim: "Sırt veya göğüs",
    his: "Baskın, kalıcı",
    siir: "Herkes karar verir.\nAz kişi kararının üstünde durur. Sen duruyorsun."
  },
  "karari_buyuk_kaotik": {
    tema: "İsyan",
    form: "Dağınık, agresif çizgiler — kural tanımayan bir enerji",
    boyut: "15cm+",
    yerlesim: "Sırt, göğüs veya uyluk",
    his: "Yoğun, özgür",
    siir: "Bu karar sistemin onayladığı türden değildi.\nVe bu onu daha gerçek yapıyor."
  },
  "estetik_kucuk_minimal": {
    tema: "Sadelik",
    form: "Tek bir çizgi, yalın ve mükemmel",
    boyut: "1–3cm",
    yerlesim: "Parmak, bilek ya da kulak arkası",
    his: "Dingin, zarif",
    siir: "Anlam aramıyorsun.\nSadece güzel bir şey istiyorsun. Bu da bir cesaret."
  },
  "estetik_orta_keskin": {
    tema: "Güç",
    form: "Keskin, net formlar — saf estetik enerji",
    boyut: "6–10cm",
    yerlesim: "Kol veya bacak",
    his: "Etkileyici, özgüvenli",
    siir: "Güzellik kendi başına bir mesaj taşır.\nVe bu mesaj yeterince güçlü."
  },
  "estetik_orta_yumusak": {
    tema: "Ritim",
    form: "Yumuşak, tekrarlayan formlar — neredeyse müzikal",
    boyut: "7–10cm",
    yerlesim: "Kol, omuz veya böğür",
    his: "Akışkan, estetik",
    siir: "Güzellik bazen bir ritimdir.\nSen o ritmi taşımak istiyorsun."
  },
  "estetik_buyuk_yumusak": {
    tema: "Akış",
    form: "Geniş, serbest akışkan formlar — soyut ve zarif",
    boyut: "15cm+",
    yerlesim: "Sırt veya uyluk",
    his: "Özgür, etkileyici",
    siir: "Bu dövme bir şey söylemek zorunda değil.\nSadece var olması yeterli."
  },
  "estetik_buyuk_kaotik": {
    tema: "Özgürlük",
    form: "Serbest fırça darbeleri, kontrolsüz enerji",
    boyut: "15cm+",
    yerlesim: "Sırt, göğüs veya uyluk",
    his: "Taşkın, enerjik",
    siir: "Anlam aramıyorsun.\nSadece var olmak istiyorsun. Bu da bir anlam aslında."
  }
};

// --- FALLBACK TEMPLATES (kalan 28 kombinasyon için) ---
const fallback = {
  tema: {
    "Bir kişiyi": "Bağ",
    "Bir dönemi": "Dönüşüm",
    "Bir kararı": "İrade",
    "Hiçbir şeyi — sadece güzel olsun": "Form"
  },
  form: {
    "Keskin ve güçlü": "Keskin hatlar, güçlü kontrastlar",
    "Yumuşak ve akışkan": "Yumuşak geçişler, akışkan formlar",
    "Kaotik ve serbest": "Serbest çizgiler, kontrolsüz enerji",
    "Minimal ve sessiz": "Minimal, neredeyse fısıltı gibi"
  },
  boyut: {
    "Küçük, fark edilmesin": "2–4cm, gizli bir işaret",
    "Orta, dengeli": "6–10cm, dengeli bir alan",
    "Büyük, statement": "15cm+, geniş bir ifade"
  },
  yerlesim: {
    "Kol": "Kol iç yüzeyi veya ön kol",
    "Bacak": "Baldır veya bacak hattı",
    "Sırt / Göğüs": "Sırt ortası veya göğüs",
    "Henüz bilmiyorum": "Esnek — birlikte karar veririz"
  },
  his: {
    "Hatırlama": "Sakin, içe dönük",
    "Cesaret": "Güçlü, kararlı",
    "Huzur": "Yumuşak, dengeleyici",
    "Sadece estetik": "Özgür, sınırsız"
  },
  siir: {
    "Bir kişiyi": "Bazı izler görünmez ama her zaman hissedilir.\nBu da böyle olacak.",
    "Bir dönemi": "Her dönem bir şey öğretir.\nBu dövme o öğretinin kalıcı izi.",
    "Bir kararı": "Kararlar bazen sessiz, bazen gürültülü gelir.\nBu, seninki.",
    "Hiçbir şeyi — sadece güzel olsun": "Bazen güzellik kendi başına yeterlidir.\nVe bu yeterlilik bir güçtür."
  }
};

// --- WHEEL PRESETS ---
const wheelItems = [
  {
    tema: "Metamorfoz",
    form: "Kelebek silüeti, tek çizgi",
    boyut: "5–7cm",
    yerlesim: "Omuz veya ayak bileği",
    his: "Hafif, umutlu",
    siir: "Değişim kaçınılmaz.\nBu iz, dönüşümü kucaklayan."
  },
  {
    tema: "Kök",
    form: "İnce dallanmalar, organik",
    boyut: "8–12cm",
    yerlesim: "Ön kol veya baldır",
    his: "Sağlam, topraklı",
    siir: "Nereden geldiğini unutma.\nKöklerin seni taşıyor."
  },
  {
    tema: "Dalga",
    form: "Akışkan çizgiler, su hareketi",
    boyut: "6–10cm",
    yerlesim: "Bilek veya ayak bileği",
    his: "Sakin, akışkan",
    siir: "Suya karşı yüzme.\nOnunla ak."
  },
  {
    tema: "Göz",
    form: "Stilize göz, minimal detay",
    boyut: "3–5cm",
    yerlesim: "El üstü veya ense",
    his: "Koruyucu, uyanık",
    siir: "Her şeyi görüyorsun.\nBu iz seni koruyor."
  },
  {
    tema: "Ay",
    form: "Hilal veya dolunay, ince çizgi",
    boyut: "4–6cm",
    yerlesim: "Bilek veya köprücük kemiği",
    his: "Gizemli, sakin",
    siir: "Karanlıkta bile ışık var.\nSen o ışıksın."
  },
  {
    tema: "Yılan",
    form: "Kıvrımlı siluet, minimal",
    boyut: "8–15cm",
    yerlesim: "Kol sarmal veya baldır",
    his: "Güçlü, dönüştürücü",
    siir: "Eski deriyi bırak.\nYeniden doğ."
  },
  {
    tema: "Geometri",
    form: "Keskin açılar, simetri",
    boyut: "5–8cm",
    yerlesim: "Ön kol veya bilek",
    his: "Düzenli, kontrollü",
    siir: "Kaosun içinde düzen arıyorsun.\nİşte burada."
  },
  {
    tema: "Kuş",
    form: "Uçuş silüeti, tek çizgi",
    boyut: "4–8cm",
    yerlesim: "Köprücük kemiği veya sırt",
    his: "Özgür, hafif",
    siir: "Kafesi kır.\nKanatların seni bekliyor."
  }
];

const segColors = [
  "#16213e",
  "#2d1b33",
  "#1a2e1a",
  "#3b1a1a",
  "#1b2a2e",
  "#2e2616",
  "#1e1e2e",
  "#2e1b25"
];

// --- STATE ---
const state = {
  currentQuestion: 0,
  answers: {},
  result: null
};

// --- SCREENS ---
const screens = {
  landing:   document.getElementById("screen-landing"),
  questions: document.getElementById("screen-questions"),
  loading:   document.getElementById("screen-loading"),
  result:    document.getElementById("screen-result"),
  wheel:     document.getElementById("screen-wheel"),
  form:      document.getElementById("screen-form"),
  done:      document.getElementById("screen-done")
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

// --- QUESTIONS ---
function renderQuestion() {
  const q = questions[state.currentQuestion];
  document.getElementById("progress").textContent =
    `${pad(state.currentQuestion + 1)}/${pad(questions.length)}`;
  document.getElementById("question-text").textContent = q.text;

  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.addEventListener("click", () => selectOption(opt));
    optionsEl.appendChild(btn);
  });
}

function selectOption(value) {
  const q = questions[state.currentQuestion];
  state.answers[q.key] = value;
  state.currentQuestion++;

  if (state.currentQuestion < questions.length) {
    renderQuestion();
  } else {
    buildResult();
    showScreen("loading");
    setTimeout(() => {
      renderResult();
      showScreen("result");
    }, 2500);
  }
}

// --- BUILD RESULT ---
function buildResult() {
  const a = state.answers;
  const key = makeKey(a.soru1, a.soru3, a.soru4);

  if (combinations[key]) {
    state.result = combinations[key];
  } else {
    // Fallback: compose from individual answers
    state.result = {
      tema: fallback.tema[a.soru1],
      form: fallback.form[a.soru4],
      boyut: fallback.boyut[a.soru3],
      yerlesim: fallback.yerlesim[a.soru2],
      his: fallback.his[a.soru5],
      siir: fallback.siir[a.soru1]
    };
  }
}

// --- RENDER RESULT CARD ---
function renderResult() {
  const r = state.result;
  document.getElementById("r-tema").textContent = r.tema;
  document.getElementById("r-form").textContent = r.form;
  document.getElementById("r-boyut").textContent = r.boyut;
  document.getElementById("r-yerlesim").textContent = r.yerlesim;
  document.getElementById("r-his").textContent = r.his;
  document.getElementById("r-siir").textContent = `"${r.siir}"`;
}

// --- WHEEL ---
let wheelAngle = 0;
let wheelSpinning = false;

function drawWheel(rotation, highlightIndex) {
  const canvas = document.getElementById("wheel-canvas");
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - 6;
  const n = wheelItems.length;
  const arc = (2 * Math.PI) / n;

  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < n; i++) {
    const startAngle = rotation - Math.PI / 2 + i * arc;
    const endAngle = startAngle + arc;
    const isHighlighted = highlightIndex === i;

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = isHighlighted ? "#3d3550" : segColors[i];
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Segment label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = isHighlighted ? "#ffffff" : "#aaaaaa";
    ctx.font = `${isHighlighted ? "500 " : "300 "}11px Inter, sans-serif`;
    ctx.fillText(wheelItems[i].tema, r - 14, 4);
    ctx.restore();
  }

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center cap
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
  ctx.fillStyle = "#0a0a0a";
  ctx.fill();
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function spinWheel() {
  if (wheelSpinning) return;
  wheelSpinning = true;

  const spinBtn = document.getElementById("spin-btn");
  const wheelResultEl = document.getElementById("wheel-result");

  wheelResultEl.hidden = true;
  spinBtn.disabled = true;

  const n = wheelItems.length;
  const arc = (2 * Math.PI) / n;
  const selectedIndex = Math.floor(Math.random() * n);

  // Offset to land center of selectedIndex at top (−π/2)
  const targetFinal = -(selectedIndex * arc + arc / 2);
  let extra = ((targetFinal - wheelAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  if (extra < 0.5) extra += 2 * Math.PI; // ensure at least a partial last lap

  const startAngle = wheelAngle;
  const endAngle = wheelAngle + 5 * 2 * Math.PI + extra;
  const duration = 4000;
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = Math.min(timestamp - startTime, duration);
    const t = elapsed / duration;
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic — fast start, slow end
    const angle = startAngle + (endAngle - startAngle) * eased;
    const done = elapsed >= duration;

    drawWheel(angle, done ? selectedIndex : -1);

    if (!done) {
      requestAnimationFrame(animate);
    } else {
      wheelAngle = endAngle;
      wheelSpinning = false;
      spinBtn.disabled = false;
      showWheelResult(selectedIndex);
    }
  }

  requestAnimationFrame(animate);
}

function showWheelResult(index) {
  const item = wheelItems[index];
  document.getElementById("wr-tema").textContent = item.tema;
  document.getElementById("wr-form").textContent = item.form;
  document.getElementById("wr-boyut").textContent = item.boyut;
  document.getElementById("wr-yerlesim").textContent = item.yerlesim;
  document.getElementById("wr-his").textContent = item.his;
  document.getElementById("wr-siir").textContent = `"${item.siir}"`;
  state.result = item;
  document.getElementById("wheel-result").hidden = false;
}

// --- EVENT LISTENERS ---
document.querySelector('[data-action="start"]').addEventListener("click", () => {
  state.currentQuestion = 0;
  state.answers = {};
  state.result = null;
  renderQuestion();
  showScreen("questions");
});

document.querySelector('[data-action="to-wheel"]').addEventListener("click", () => {
  showScreen("wheel");
  drawWheel(wheelAngle, -1);
});

document.getElementById("spin-btn").addEventListener("click", spinWheel);
document.getElementById("respin-btn").addEventListener("click", spinWheel);

document.querySelector('[data-action="wheel-to-form"]').addEventListener("click", () => {
  const r = state.result;
  const promptText = [
    `TEMA: ${r.tema}`,
    `FORM: ${r.form}`,
    `BOYUT: ${r.boyut}`,
    `YERLEŞİM: ${r.yerlesim}`,
    `HİS: ${r.his}`,
    r.siir
  ].join("\n");
  document.getElementById("hidden-prompt").value = promptText;
  showScreen("form");
});

document.querySelector('[data-action="to-form"]').addEventListener("click", () => {
  const r = state.result;
  const promptText = [
    `TEMA: ${r.tema}`,
    `FORM: ${r.form}`,
    `BOYUT: ${r.boyut}`,
    `YERLEŞİM: ${r.yerlesim}`,
    `HİS: ${r.his}`,
    r.siir
  ].join("\n");
  document.getElementById("hidden-prompt").value = promptText;
  showScreen("form");
});

document.getElementById("lead-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data).toString()
  })
    .then(() => showScreen("done"))
    .catch(() => showScreen("done"));
});
