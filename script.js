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

const promptTemplates = {
  soru1: {
    "Bir kişiyi": "Sevilen birinin izini taşıyan",
    "Bir dönemi": "Bir dönemin kapanışını simgeleyen",
    "Bir kararı": "Bir kararın gücünü yansıtan",
    "Hiçbir şeyi — sadece güzel olsun": "Saf estetik, anlam yükü olmayan"
  },
  soru2: {
    "Kol": "kol iç veya dış yüzeyine uygun",
    "Bacak": "bacak hattını takip eden",
    "Sırt / Göğüs": "geniş alanda nefes alan",
    "Henüz bilmiyorum": "yerleşim esnek bırakılan"
  },
  soru3: {
    "Küçük, fark edilmesin": "minimal, 3-5cm arası",
    "Orta, dengeli": "orta boyut, dengeli",
    "Büyük, statement": "statement parça, geniş alan kaplayan"
  },
  soru4: {
    "Keskin ve güçlü": "keskin hatlar, güçlü kontrastlar",
    "Yumuşak ve akışkan": "yumuşak geçişler, akışkan formlar",
    "Kaotik ve serbest": "kaotik, serbest çizgiler",
    "Minimal ve sessiz": "minimal, neredeyse fısıltı gibi"
  },
  soru5: {
    "Hatırlama": "Bir anıyı saklayan.",
    "Cesaret": "Cesareti hatırlatan.",
    "Huzur": "Huzur veren.",
    "Sadece estetik": "Sadece güzel olan."
  }
};

const state = {
  currentQuestion: 0,
  answers: {},
  prompt: ""
};

const screens = {
  landing: document.getElementById("screen-landing"),
  questions: document.getElementById("screen-questions"),
  loading: document.getElementById("screen-loading"),
  result: document.getElementById("screen-result"),
  form: document.getElementById("screen-form"),
  done: document.getElementById("screen-done")
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

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
    buildPrompt();
    showScreen("loading");
    setTimeout(() => {
      document.getElementById("prompt-output").textContent = state.prompt;
      showScreen("result");
    }, 2500);
  }
}

function buildPrompt() {
  const a = state.answers;
  const p1 = promptTemplates.soru1[a.soru1];
  const p2 = promptTemplates.soru2[a.soru2];
  const p3 = promptTemplates.soru3[a.soru3];
  const p4 = promptTemplates.soru4[a.soru4];
  const p5 = promptTemplates.soru5[a.soru5];
  state.prompt = `${p1}. ${p2}, ${p3}. ${p4}. ${p5}`;
}

// Event listeners
document.querySelector('[data-action="start"]').addEventListener("click", () => {
  state.currentQuestion = 0;
  state.answers = {};
  renderQuestion();
  showScreen("questions");
});

document.querySelector('[data-action="to-form"]').addEventListener("click", () => {
  document.getElementById("hidden-prompt").value = state.prompt;
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
