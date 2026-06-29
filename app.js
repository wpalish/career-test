/**
 * app.js — логика SPA: переключение экранов, прохождение теста,
 * подсчёт баллов по 4 шкалам MBTI, профиль-спектр и вывод результата.
 *
 * Зависит от глобальных QUESTIONS (questions.js) и RESULTS (results.js).
 */

(() => {
  'use strict';

  // ─────────── Константы ───────────
  const OPPOSITE = { E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J' };
  const DIMENSION_LABEL = { EI: 'Энергия', SN: 'Восприятие', TF: 'Решения', JP: 'Образ жизни' };

  // Полюса шкал с названиями черт (left — первая буква кода: E/S/T/J)
  const AXIS_META = {
    EI: { left: { k: 'E', name: 'Экстраверсия' }, right: { k: 'I', name: 'Интроверсия' } },
    SN: { left: { k: 'S', name: 'Сенсорика' },    right: { k: 'N', name: 'Интуиция' } },
    TF: { left: { k: 'T', name: 'Логика' },       right: { k: 'F', name: 'Эмпатия' } },
    JP: { left: { k: 'J', name: 'Планирование' }, right: { k: 'P', name: 'Спонтанность' } },
  };
  const DIMS = ['EI', 'SN', 'TF', 'JP'];

  const ANSWER_OPTIONS = [
    { label: 'Полностью согласен',    value: 2,  weight: 1 },
    { label: 'Скорее согласен',       value: 1,  weight: 0.6 },
    { label: 'Нейтрально',            value: 0,  weight: 0 },
    { label: 'Скорее не согласен',    value: -1, weight: 0.6 },
    { label: 'Полностью не согласен', value: -2, weight: 1 },
  ];

  const LOADING_MESSAGES = [
    'Анализируем ваши ответы…',
    'Считаем баллы по четырём шкалам…',
    'Определяем тип личности…',
    'Подбираем профессии из базы 200+…',
  ];

  const LOADING_DURATION = 2600;
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─────────── Состояние ───────────
  const state = {
    current: 0,
    answers: new Array(QUESTIONS.length).fill(null),
    lastResult: null,
    sharedLanding: false,
  };

  // ─────────── Кэш DOM ───────────
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    quiz: document.getElementById('screen-quiz'),
    loading: document.getElementById('screen-loading'),
    result: document.getElementById('screen-result'),
  };
  const el = {
    start: document.getElementById('btn-start'),
    back: document.getElementById('btn-back'),
    bar: document.getElementById('progress-bar'),
    count: document.getElementById('progress-count'),
    progress: document.querySelector('.progress'),
    dimension: document.getElementById('quiz-dimension'),
    question: document.getElementById('quiz-question'),
    answers: document.getElementById('quiz-answers'),
    loaderText: document.getElementById('loader-text'),
    share: document.getElementById('btn-share'),
    image: document.getElementById('btn-image'),
    restart: document.getElementById('btn-restart'),
    toast: document.getElementById('share-toast'),
    badge: document.getElementById('result-badge'),
    axes: document.getElementById('result-axes'),
  };

  // ─────────── Утилита: плавный счётчик чисел ───────────
  function countUp(node, to, dur = 900) {
    if (reduced) { node.textContent = String(to); return; }
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      node.textContent = String(Math.round(to * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ─────────── Переключение экранов ───────────
  function showScreen(name) {
    Object.entries(screens).forEach(([key, node]) => {
      const active = key === name;
      if (active) {
        node.hidden = false;
        void node.offsetWidth; // фиксируем стартовое состояние — переход срабатывает синхронно
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
        node.hidden = true;
      }
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // ─────────── Рендер вопроса ───────────
  function renderQuestion() {
    const q = QUESTIONS[state.current];
    const total = QUESTIONS.length;
    const num = state.current + 1;

    el.dimension.textContent = DIMENSION_LABEL[q.dimension] || 'Утверждение';
    el.question.textContent = q.text;

    const pct = (state.current / total) * 100;
    el.bar.style.width = `${pct}%`;
    el.count.innerHTML = `${num}&nbsp;/&nbsp;${total}`;
    el.progress.setAttribute('aria-valuenow', String(state.current));
    el.back.disabled = state.current === 0;

    el.answers.innerHTML = '';
    const chosen = state.answers[state.current];
    ANSWER_OPTIONS.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer';
      btn.style.setProperty('--w', String(opt.weight));
      if (chosen === opt.value) btn.classList.add('is-picked');
      btn.innerHTML = `<span class="answer__dot" aria-hidden="true"></span><span>${opt.label}</span>`;
      btn.addEventListener('click', () => selectAnswer(opt.value));
      el.answers.appendChild(btn);
    });

    animateQuestionIn();
  }

  function animateQuestionIn() {
    if (reduced) return;
    el.question.animate(
      [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
      { duration: 340, easing: EASE },
    );
    [...el.answers.children].forEach((btn, i) => {
      btn.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 300, delay: 70 + i * 45, easing: EASE, fill: 'backwards' },
      );
    });
  }

  // ─────────── Выбор ответа ───────────
  function selectAnswer(value) {
    state.answers[state.current] = value;

    const picked = ANSWER_OPTIONS.findIndex((o) => o.value === value);
    const node = el.answers.children[picked];
    if (node) node.classList.add('is-picked');

    setTimeout(() => {
      if (state.current < QUESTIONS.length - 1) {
        state.current += 1;
        renderQuestion();
      } else {
        finishTest();
      }
    }, 200);
  }

  function goBack() {
    if (state.current > 0) {
      state.current -= 1;
      renderQuestion();
    }
  }

  // ─────────── Подсчёт результата + профиль ───────────
  function computeResult() {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    QUESTIONS.forEach((q, i) => {
      const v = state.answers[i];
      if (v === null || v === 0) return;
      if (v > 0) scores[q.pole] += v;
      else scores[OPPOSITE[q.pole]] += -v;
    });

    let code = '';
    const axes = {};
    DIMS.forEach((dim) => {
      const m = AXIS_META[dim];
      const L = m.left.k;
      const R = m.right.k;
      const total = scores[L] + scores[R];
      const winner = scores[L] >= scores[R] ? L : R; // ничья → левый полюс (E/S/T/J)
      const winnerPct = total === 0 ? 50 : Math.round((scores[winner] / total) * 100);
      code += winner;
      axes[dim] = { winner, winnerPct };
    });

    return { code, axes };
  }

  // ─────────── Экран загрузки + переход к результату ───────────
  function finishTest() {
    el.bar.style.width = '100%';
    el.progress.setAttribute('aria-valuenow', String(QUESTIONS.length));
    showScreen('loading');

    let idx = 0;
    el.loaderText.textContent = LOADING_MESSAGES[0];
    const step = LOADING_DURATION / LOADING_MESSAGES.length;
    const rotate = setInterval(() => {
      idx += 1;
      if (idx >= LOADING_MESSAGES.length) return;
      el.loaderText.style.opacity = '0';
      setTimeout(() => {
        el.loaderText.textContent = LOADING_MESSAGES[idx];
        el.loaderText.style.opacity = '1';
      }, 160);
    }, step);

    setTimeout(() => {
      clearInterval(rotate);
      const result = computeResult();
      state.sharedLanding = false;
      renderResult(result);
      writeHash(result);
      showScreen('result');
    }, reduced ? 400 : LOADING_DURATION);
  }

  // ─────────── Рендер результата ───────────
  function renderResult({ code, axes }) {
    const data = RESULTS[code] || RESULTS.INTJ;
    const card = document.getElementById('result-card');
    card.style.setProperty('--type-accent', data.accent);

    el.badge.textContent = data.icon || '🧭';
    document.getElementById('result-code').textContent = code;
    document.getElementById('result-name').textContent = data.name;
    document.getElementById('result-archetype').textContent = data.archetype;
    document.getElementById('result-summary').textContent = data.summary;
    document.getElementById('result-decisions').textContent = data.decisions;

    renderAxes(axes);
    fillTags('result-strengths', data.strengths);
    fillTags('result-weaknesses', data.weaknesses);

    renderProfessions(code);

    el.restart.textContent = state.sharedLanding ? 'Пройти тест самому' : 'Пройти заново';
    state.lastResult = { code, name: data.name, icon: data.icon, axes };
  }

  // ─────────── Алгоритм подбора профессий из базы 200+ ───────────
  /**
   * Для кода пользователя (например, 'INTJ'):
   *   1. Отбираем все профессии, где mbti включает код с позицией 0 или 1
   *      (primary и secondary мэтчи — самые точные попадания).
   *   2. Сортируем по позиции кода в mbti (mbti[0] = primary, mbti[1] = secondary).
   *   3. Первые 3 → «Топ-3 идеальных».
   *   4. Остальные группируем по sphere, в каждой сфере оставляем максимум 5 —
   *      так пользователь видит богатый, но не перегруженный выбор.
   *
   * В базе 203 профессии, каждый из 16 типов имеет ≥12 primary/secondary матчей.
   */
  const MAX_ALT_PER_SPHERE = 5;

  function pickProfessions(code) {
    const matches = (typeof PROFESSIONS !== 'undefined' ? PROFESSIONS : [])
      .map((p) => {
        const idx = p.mbti.indexOf(code);
        return idx === -1 ? null : { ...p, matchRank: idx };
      })
      .filter(Boolean)
      .filter((p) => p.matchRank <= 1) // только primary (0) и secondary (1) мэтчи
      .sort((a, b) => a.matchRank - b.matchRank);

    const top3 = matches.slice(0, 3);
    const rest = matches.slice(3);

    // Группируем по сфере, ограничиваем MAX_ALT_PER_SPHERE на сферу
    const bySphere = {};
    const restCapped = [];
    rest.forEach((p) => {
      if (!bySphere[p.sphere]) bySphere[p.sphere] = [];
      if (bySphere[p.sphere].length < MAX_ALT_PER_SPHERE) {
        bySphere[p.sphere].push(p);
        restCapped.push(p);
      }
    });
    return { top3, rest: restCapped, bySphere };
  }

  function renderProfessions(code) {
    const { top3, bySphere } = pickProfessions(code);

    // ── Топ-3 ──
    const top3ol = document.getElementById('result-top3');
    top3ol.innerHTML = '';
    top3.forEach((p) => {
      const li = document.createElement('li');
      li.className = 'top3__item';
      const sphere = SPHERES[p.sphere] || {};
      li.innerHTML = `
        <div class="top3__head">
          <span class="top3__sphere" aria-hidden="true">${sphere.icon || '•'}</span>
          <span class="top3__title">${p.title}</span>
          <span class="top3__chip">${sphere.label || p.sphere}</span>
        </div>
        <p class="top3__why">${p.why}</p>`;
      top3ol.appendChild(li);
    });

    // ── Альтернативы по сферам (аккордеон) ──
    const spheresBox = document.getElementById('result-spheres');
    spheresBox.innerHTML = '';

    // Сортируем сферы по числу профессий (от большего к меньшему) —
    // так пользователь сразу видит самые «плотные» сферы сверху.
    const orderedSpheres = Object.keys(bySphere).sort((a, b) => bySphere[b].length - bySphere[a].length);

    if (orderedSpheres.length === 0) {
      spheresBox.innerHTML = '<p class="spheres__empty">Для вашего типа не нашлось дополнительных профессий.</p>';
      return;
    }

    orderedSpheres.forEach((sphereKey, idx) => {
      const sphere = SPHERES[sphereKey] || { label: sphereKey, icon: '•', accent: 'var(--accent)' };
      const items = bySphere[sphereKey];

      const details = document.createElement('details');
      details.className = 'sphere';
      // Первая (самая плотная) сфера раскрыта по умолчанию
      if (idx === 0) details.open = true;
      details.style.setProperty('--sphere-accent', sphere.accent || 'var(--accent)');

      const summary = document.createElement('summary');
      summary.className = 'sphere__head';
      summary.innerHTML = `
        <span class="sphere__icon" aria-hidden="true">${sphere.icon}</span>
        <span class="sphere__name">${sphere.label}</span>
        <span class="sphere__count">${items.length}</span>
        <svg class="sphere__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
      details.appendChild(summary);

      const body = document.createElement('div');
      body.className = 'sphere__body';
      items.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'altprof';
        card.innerHTML = `
          <div class="altprof__title">${p.title}</div>
          <div class="altprof__why">${p.why}</div>`;
        body.appendChild(card);
      });
      details.appendChild(body);
      spheresBox.appendChild(details);
    });
  }

  function renderAxes(axes) {
    el.axes.innerHTML = '';
    if (!axes) { el.axes.hidden = true; return; }
    el.axes.hidden = false;

    DIMS.forEach((dim) => {
      const a = axes[dim];
      const m = AXIS_META[dim];
      const winName = a.winner === m.left.k ? m.left.name : m.right.name;
      const otherName = a.winner === m.left.k ? m.right.name : m.left.name;

      const row = document.createElement('div');
      row.className = 'axis';
      row.innerHTML = `
        <div class="axis__top">
          <span class="axis__name">${winName}</span>
          <span class="axis__pct"><b>0</b>%</span>
        </div>
        <div class="axis__track"><span class="axis__fill"></span></div>
        <span class="axis__sub">${otherName} · ${100 - a.winnerPct}%</span>`;
      el.axes.appendChild(row);

      const fill = row.querySelector('.axis__fill');
      const pctNode = row.querySelector('.axis__pct b');
      void fill.offsetWidth;
      fill.style.width = `${a.winnerPct}%`;
      countUp(pctNode, a.winnerPct, 1000);
    });
  }

  function fillTags(id, items) {
    const ul = document.getElementById(id);
    ul.innerHTML = '';
    items.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
  }

  // ─────────── Шеринг результата через URL ───────────
  function writeHash({ code, axes }) {
    const pcts = DIMS.map((d) => axes[d].winnerPct).join('.');
    history.replaceState(null, '', `#${code}.${pcts}`);
  }

  function readHash() {
    const raw = (window.location.hash || '').slice(1);
    if (!raw) return null;
    const [code, ...nums] = raw.split('.');
    if (!/^[EI][SN][TF][JP]$/.test(code) || !RESULTS[code]) return null;

    const axes = {};
    let ok = true;
    DIMS.forEach((dim, i) => {
      const n = parseInt(nums[i], 10);
      if (Number.isNaN(n)) { ok = false; return; }
      axes[dim] = { winner: code[i], winnerPct: Math.max(0, Math.min(100, n)) };
    });
    return { code, axes: ok ? axes : null };
  }

  async function shareResult() {
    const r = state.lastResult || {};
    const text = `Я — «${r.name}» ${r.icon || ''} (${r.code}). А ты кто? Узнай свой тип личности и подходящие профессии за 15 минут:`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Кем тебе быть?', text, url });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      showToast('Ссылка скопирована в буфер обмена ✓');
    } catch {
      window.prompt('Скопируйте ссылку на результат:', `${text} ${url}`);
    }
  }

  function showToast(msg) {
    if (msg) el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { el.toast.hidden = true; }, 2600);
  }

  // ─────────── Картинка-результат для шеринга ───────────
  function roundedRect(g, x, y, w, h, r) {
    g.beginPath();
    if (g.roundRect) { g.roundRect(x, y, w, h, r); return; }
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  async function buildShareCanvas() {
    const r = state.lastResult;
    if (!r) return null;
    try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) { /* шрифты не критичны */ }

    const W = 1080, H = 1350, P = 96;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    const setLS = (v) => { try { g.letterSpacing = v; } catch (e) { /* старый браузер */ } };

    // Фон + верхнее свечение
    const bg = g.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#201a40'); bg.addColorStop(0.55, '#33285a'); bg.addColorStop(1, '#412c54');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const glow = g.createRadialGradient(W * 0.7, -100, 60, W * 0.7, -100, 760);
    glow.addColorStop(0, 'rgba(176,107,255,0.5)'); glow.addColorStop(1, 'rgba(176,107,255,0)');
    g.fillStyle = glow; g.fillRect(0, 0, W, H);

    g.textAlign = 'left'; g.textBaseline = 'alphabetic';

    // Лейбл
    setLS('6px');
    g.fillStyle = 'rgba(255,255,255,0.55)';
    g.font = '600 30px Manrope, sans-serif';
    g.fillText('КЕМ ТЕБЕ БЫТЬ?', P, P + 24);
    setLS('0px');

    // Бейдж с иконкой
    const bs = 168, bx = P, by = P + 56;
    const bgrad = g.createLinearGradient(bx, by, bx + bs, by + bs);
    bgrad.addColorStop(0, '#c98bff'); bgrad.addColorStop(1, '#7d5bff');
    roundedRect(g, bx, by, bs, bs, 44); g.fillStyle = bgrad; g.fill();
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '92px serif';
    g.fillText(r.icon || '🧭', bx + bs / 2, by + bs / 2 + 4);
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';

    // Код
    let y = by + bs + 92;
    setLS('8px');
    g.fillStyle = '#ff9ec2';
    g.font = '700 32px Unbounded, Manrope, sans-serif';
    g.fillText(r.code, P, y);
    setLS('0px');

    // Название типа (подбор кегля под ширину)
    y += 96;
    let fs = 108;
    g.fillStyle = '#ffffff';
    do { fs -= 4; g.font = `800 ${fs}px Unbounded, Manrope, sans-serif`; }
    while (g.measureText(r.name).width > W - 2 * P && fs > 52);
    g.fillText(r.name, P, y);

    // Архетип
    y += 56;
    g.fillStyle = 'rgba(255,255,255,0.72)';
    g.font = '500 34px Manrope, sans-serif';
    g.fillText((RESULTS[r.code] && RESULTS[r.code].archetype) || '', P, y);

    // Спектр
    if (r.axes) {
      y += 74;
      const trackW = W - 2 * P;
      DIMS.forEach((dim) => {
        const a = r.axes[dim];
        const m = AXIS_META[dim];
        const name = a.winner === m.left.k ? m.left.name : m.right.name;
        g.fillStyle = '#ffffff';
        g.font = '600 36px Manrope, sans-serif';
        g.textAlign = 'left'; g.fillText(name, P, y);
        g.fillStyle = '#ffb0cf';
        g.font = '700 40px Unbounded, Manrope, sans-serif';
        g.textAlign = 'right'; g.fillText(`${a.winnerPct}%`, W - P, y);
        g.textAlign = 'left';
        const ty = y + 22;
        roundedRect(g, P, ty, trackW, 18, 9); g.fillStyle = 'rgba(255,255,255,0.16)'; g.fill();
        const fw = Math.max(18, (trackW * a.winnerPct) / 100);
        const fgrad = g.createLinearGradient(P, 0, P + fw, 0);
        fgrad.addColorStop(0, '#ff8fb0'); fgrad.addColorStop(1, '#b06bff');
        roundedRect(g, P, ty, fw, 18, 9); g.fillStyle = fgrad; g.fill();
        y += 104;
      });
    }

    // Футер
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.font = '500 30px Manrope, sans-serif';
    g.fillText('Пройди тест и узнай свой тип:', P, H - 118);
    g.fillStyle = '#ffffff';
    g.font = '700 36px Manrope, sans-serif';
    const site = (window.location.host || 'career-test') + window.location.pathname.replace(/\/$/, '');
    g.fillText(site, P, H - 68);

    return cv;
  }

  async function downloadImage() {
    let cv;
    try { cv = await buildShareCanvas(); } catch (e) { cv = null; }
    if (!cv) return;
    const code = (state.lastResult && state.lastResult.code) || 'result';
    const a = document.createElement('a');
    a.download = `kem-tebe-byt-${code}.png`;
    a.href = cv.toDataURL('image/png');
    document.body.appendChild(a); a.click(); a.remove();
    showToast('Картинка сохранена ✓');
  }

  // ─────────── Старт / рестарт ───────────
  function startTest() {
    state.current = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    state.sharedLanding = false;
    history.replaceState(null, '', window.location.pathname + window.location.search);
    renderQuestion();
    showScreen('quiz');
  }

  function restart() {
    el.toast.hidden = true;
    startTest();
  }

  // ─────────── Инициализация ───────────
  function init() {
    // Прямой заход по ссылке с результатом
    const shared = readHash();
    if (shared) {
      state.sharedLanding = true;
      renderResult(shared);
      showScreen('result');
      bindEvents();
      return;
    }

    // Счётчики на приветственном экране
    document.querySelectorAll('.welcome__facts b').forEach((b) => {
      countUp(b, parseInt(b.textContent, 10) || 0, 1100);
    });
    bindEvents();
  }

  function bindEvents() {
    el.start.addEventListener('click', startTest);
    el.back.addEventListener('click', goBack);
    el.share.addEventListener('click', shareResult);
    el.image.addEventListener('click', downloadImage);
    el.restart.addEventListener('click', restart);

    // Доступно извне для генерации картинки-результата (шеринг/тесты)
    window.buildShareCanvas = buildShareCanvas;

    document.addEventListener('keydown', (e) => {
      if (!screens.quiz.classList.contains('is-active')) return;
      if (e.key >= '1' && e.key <= '5') {
        const opt = ANSWER_OPTIONS[Number(e.key) - 1];
        if (opt) selectAnswer(opt.value);
      } else if (e.key === 'ArrowLeft') {
        goBack();
      }
    });
  }

  init();
})();
