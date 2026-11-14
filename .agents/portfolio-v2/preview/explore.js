/* Logbook explorations, round 5. Preview code: production would use GSAP for the hero pieces
   and a few lines of script for the header. */
(() => {
  const root = document.documentElement, page = document.body.dataset.page;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = new URLSearchParams(location.search);
  const mem = {
    get(k, d) { try { return localStorage.getItem('lb4-' + k) || d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('lb4-' + k, v); } catch {} },
  };
  const cells = (n, cls = () => '') => Array.from({ length: n }, (_, i) => `<i class="${cls(i)}"></i>`).join('');
  const hash = s => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  const rnd = (n, salt = 0) => (Math.imul(n + 1 + salt, 2654435761) >>> 0) % 97;
  let timers = [], ticks = [];
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const every = (fn, ms) => { const t = setInterval(fn, ms); ticks.push(t); return t; };

  /* ---------- Marks ---------- */
  const SHAPES = {
    v: [48, 28, [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]]],
  };
  const sq = (c, r, cls = '') => `<rect x="${10 * c}" y="${10 * r}" width="8" height="8" rx="1.6"${cls}/>`;
  const mark = k => k === 'prompt'   // the blog's mark: the V turned on its side, plus a cursor cell
    ? `<svg class="mk mk-prompt" viewBox="0 0 48 48" aria-hidden="true"><g class="chev">${[[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]].map(([c, r]) => sq(c, r)).join('')}</g>${sq(4, 4, ' class="cur"')}</svg>`
    : `<svg class="mk" viewBox="0 0 ${SHAPES[k][0]} ${SHAPES[k][1]}" aria-hidden="true">${SHAPES[k][2].map(([c, r]) => sq(c, r)).join('')}</svg>`;

  /* ---------- Header ----------
     One triggered move, about 0.64s on a single curve, like the Anthropic wordmark. Script only
     flips a class; CSS does the motion with clip-path, transforms and opacity, so layout never changes.
     Both sites: the name is wiped. Portfolio: the V closes up into the owl's face at the same time,
     then its eyes follow the pointer and blink; at the top it opens back into the V.
     Blog: the prompt mark stays. */
  const brand = $('.brand'), markEl = $('.brand-mark'), nameEl = $('.brand-name');
  const kind = page === 'blog' ? 'prompt' : 'v';
  const text = nameEl.dataset.text;
  brand.dataset.kind = kind;
  // The portfolio mark is the V with each cell in its own group, so a cell can move and its eye still look around inside it.
  const markOwl = () => `<svg class="mk mk-owl" viewBox="0 0 48 28" aria-hidden="true">${SHAPES.v[2].map(([c, r], i) => `<g class="o${i + 1}">${sq(c, r)}</g>`).join('')}</svg>`;
  markEl.innerHTML = kind === 'v' ? markOwl() : mark(kind);
  nameEl.innerHTML = `<span class="w1">${text}</span>`;
  $$('[data-mark]').forEach(el => { el.innerHTML = mark(kind); });
  let collapsed = false;
  function update() {
    const want = collapsed ? scrollY > 6 : scrollY > 16;   // condense just below the top, open only at the top
    if (want !== collapsed) { collapsed = want; root.classList.toggle('scrolled', want); }
  }
  function measure() {
    brand.classList.add('no-anim');
    brand.style.setProperty('--d', $('.w1', nameEl).getBoundingClientRect().width.toFixed(2) + 'px');
    update(); void brand.offsetWidth; brand.classList.remove('no-anim');
  }
  // The owl in the header looks at the pointer, about a cell's width either way.
  const markLook = (x, y) => {
    if (kind !== 'v' || !collapsed || reduce) return;
    const r = $('svg', markEl).getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2), d = Math.max(Math.hypot(dx, dy), 40);
    brand.style.setProperty('--ex', (dx / d * 3).toFixed(2) + 'px'); brand.style.setProperty('--ey', (dy / d * 2.2).toFixed(2) + 'px');
  };
  addEventListener('scroll', update, { passive: true });

  /* ---------- Portfolio hero: an owl drawn in the field's cells ----------
     Small cells, green. It looks at the headline when nobody is there and follows the pointer
     anywhere on the page, a cell at a time. Its eyes smile into arcs when the pointer comes close,
     it flaps when clicked, it blinks with the header logo, and eight seconds after the pointer last
     moved it closes its eyes and sleeps, with Z's drifting up out of the field.
     Sprite letters are cell classes: b body, s belly, k beak and feet, w eye white, q pupil. */
  const OWL = {
    w: 12, h: 13,
    base: ['b..........b', 'bb........bb', 'bbbbbbbbbbbb', 'bwwwwbbwwwwb', 'bwwwwbbwwwwb', 'bwwwwbbwwwwb', 'bwwwwbbwwwwb',
           'bbbbbkkbbbbb', '.bbbbbbbbbb.', '.bsbsbbsbsb.', '.bbsbbbbsbb.', '..bbbbbbbb..', '...kk..kk...'],
    eyes: [[2, 4], [8, 4]],     // top-left of each 2 by 2 pupil, looking straight ahead
  };
  const sprite = (put, rows, x0 = 0, y0 = 0, as) => rows.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') put(x0 + x, y0 + y, as || c); }));
  const list = (put, cs, c) => cs.forEach(([x, y]) => put(x, y, c));
  function drawOwl(put, st) {
    const m = st.mood, closed = m === 'sleep' || st.blink;
    OWL.eyes.forEach(([ex, ey], i) => {
      if (closed || m === 'happy') {   // lids down: a line when closed, a smiling arc when happy
        const bx = i ? 7 : 1;
        for (let y = 3; y <= 6; y++) for (let x = bx; x < bx + 4; x++) put(x, y, 'b');
        list(put, closed ? [[bx, 5], [bx + 1, 5], [bx + 2, 5], [bx + 3, 5]] : [[bx, 5], [bx + 1, 4], [bx + 2, 4], [bx + 3, 5]], 'k');
        return;
      }
      const x = m === 'wow' ? ex : ex + st.gx, y = m === 'wow' ? ey : ey + st.gy;
      list(put, [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]], 'q');
    });
    if (m === 'wow') { const up = st.t % 2 ? -1 : 0; list(put, [[-1, 8 + up], [-2, 7 + up], [-1, 9], [12, 8 + up], [13, 7 + up], [12, 9]], 'b'); }
  }

  const fg = $('.fg');
  const opt = {};
  let st = null, F = null, lastMove = Date.now(), px = -1, py = -1;

  function buildField(animate) {
    if (!fg) return;
    const wide = innerWidth >= 900, W = root.clientWidth;
    fg.style.cssText = ''; fg.innerHTML = '';
    const left = fg.getBoundingClientRect().left, room = wide ? W - left : W;
    // Small cells. On a phone the owl stays clear of the side fades.
    let pitch = (wide ? clamp(room * 0.5 / (OWL.w + 2), 18, 30) : clamp((W - 32) / (OWL.w + 3), 12, 24)) * 0.66;
    pitch = Math.round(Math.max(wide ? 11 : 9, Math.min(pitch, wide ? 40 : W * 0.74 / OWL.w)));
    // The field is about 470px tall (380px on a phone): six rows above the owl for the Z's, four below.
    const gap = Math.max(2, Math.round(pitch * 0.15)), need = 6 + OWL.h + 4, rows = Math.max(need, Math.ceil((wide ? 470 : 380) / pitch));
    const r0 = 6 + Math.floor((rows - need) * 0.45);
    let cols = Math.ceil(room / pitch) + (wide ? 1 : 2);
    if (!wide && (cols - OWL.w) % 2) cols++;     // on a phone the grid is centred, so an even margin keeps the owl dead centre
    const fit = Math.floor(room / pitch), lo = Math.ceil(fit * 0.2);
    const c0 = wide ? Math.max(lo, Math.round(fit * 0.42 - OWL.w / 2)) : (cols - OWL.w) >> 1;
    fg.style.cssText = `--cell:${pitch - gap}px;--gap:${gap}px;--cols:${cols};--rad:${Math.min(4, Math.round((pitch - gap) * 0.2))}px;--fy:${Math.round(Math.min(pitch * 2.6, rows * pitch * 0.2))}px`;
    fg.innerHTML = cells(cols * rows);
    const kids = fg.children, org = () => kids[0].getBoundingClientRect();
    const centre = () => { const o = org(); return [o.left + (c0 + OWL.w / 2) * pitch, o.top + (r0 + OWL.h * 0.45) * pitch]; };

    st = { t: 0, mood: 'idle', gx: -1, gy: -1, blink: false, near: false, wowUntil: 0, jumpUntil: 0, reveal: animate && !reduce ? -1 : 99, zs: [] };
    let prev = new Map();
    const moodNow = () => { const now = Date.now(); if (now < st.wowUntil) return 'wow'; if (!reduce && now - lastMove > 8000) return 'sleep'; return st.near ? 'happy' : 'idle'; };
    const render = () => {
      st.mood = moodNow();
      if (px >= 0 && !reduce && st.mood !== 'sleep') {   // towards the pointer, or up at the headline when nobody is there
        const [cx, cy] = centre(), dx = px - cx, dy = py - cy, d = Math.max(Math.hypot(dx, dy), pitch * 3);
        st.gx = Math.round(clamp(dx / d * 1.4, -1, 1)); st.gy = Math.round(clamp(dy / d * 1.4, -1, 1));
      } else { st.gx = -1; st.gy = -1; }
      const jump = Date.now() < st.jumpUntil ? -1 : 0, m = new Map();
      const at = (x, y, c) => { if (x >= 0 && x < cols && y >= 0 && y < rows) m.set(y * cols + x, c); };
      const put = (x, y, c) => { if (y <= st.reveal) at(c0 + x, r0 + y + jump, c); };   // the intro draws it in from the top
      sprite(put, OWL.base);
      if (st.reveal >= OWL.h) drawOwl(put, st);
      st.zs.forEach(z => sprite((x, y, c) => at(c0 + x, r0 + y, z.age > 1 ? 'z1' : c), ['zzzz', '..z.', '.z..', 'zzzz'], z.x, z.y));
      prev.forEach((c, i) => { if (!m.has(i)) kids[i].className = ''; });
      m.forEach((c, i) => { if (prev.get(i) !== c) kids[i].className = c; });
      prev = m;
    };
    F = { render, centre, pitch };

    if (!reduce) every(() => {
      st.t++;
      if (st.reveal < 99) st.reveal = st.reveal + 2 > OWL.h ? 99 : st.reveal + 2;
      if (st.mood === 'sleep' && st.t % 22 === 0) st.zs.push({ x: OWL.w - 1, y: -3, age: 0 });
      if (st.t % 6 === 0) st.zs = st.zs.filter(z => { z.age++; z.x++; z.y--; return z.age <= 3; });
      render();
    }, 100);
    render();

    // Cells light up under the pointer; a click makes the owl flap and sends a ring out across the field.
    fg.onpointermove = e => {
      if (reduce || e.target.parentNode !== fg || e.target.className) return;
      const c = e.target; c.classList.add('hot'); clearTimeout(c._t); c._t = setTimeout(() => c.classList.remove('hot'), 220);
    };
    fg.onclick = e => {
      if (reduce) return;
      const now = Date.now(); lastMove = now; st.wowUntil = now + 1000; st.jumpUntil = now + 180;
      const o = org(), cc = (e.clientX - o.left) / pitch, cr = (e.clientY - o.top) / pitch;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const d = Math.hypot(c + 0.5 - cc, r + 0.5 - cr), k = kids[r * cols + c];
        if (d < 9) later(() => { if (!k.className || k.className === 'hot') { k.classList.add('hot'); setTimeout(() => k.classList.remove('hot'), 180); } }, d * 32);
      }
      render();
    };
  }
  // The owl follows the pointer anywhere on the page. A touch counts as a look.
  const track = e => {
    lastMove = Date.now(); px = e.clientX; py = e.clientY;
    markLook(px, py);
    if (!F || reduce) return;
    const [cx, cy] = F.centre();
    st.near = Math.hypot(px - cx, py - cy) < Math.max(200, OWL.w * F.pitch * 0.85);
    F.render();
  };
  addEventListener('pointermove', track, { passive: true });
  addEventListener('pointerdown', track, { passive: true });
  // Blinking: the header logo and the owl together, every few seconds, and only while someone is there.
  (function blinkLoop(ms) {
    setTimeout(() => {
      if (!reduce && !document.hidden && Date.now() - lastMove < 8000) {
        document.body.classList.add('blink'); if (st) { st.blink = true; F?.render(); }
        setTimeout(() => { document.body.classList.remove('blink'); if (st) { st.blink = false; F?.render(); } }, 140);
      }
      blinkLoop(2400 + Math.random() * 3600);
    }, ms);
  })(2200);

  /* ---------- Footer: the same cells, much quieter ----------
     Both sites. Now and then one cell warms up and fades back, slowly. Nothing follows the pointer. */
  let footTick = 0;
  function buildFoot() {
    const ff = $('.ff'); if (!ff) return;
    clearInterval(footTick); ff.style.cssText = ''; ff.innerHTML = '';
    const wide = innerWidth >= 900, W = root.clientWidth, left = ff.getBoundingClientRect().left, room = wide ? W - left : W;
    const pitch = wide ? 30 : 24, gap = Math.max(3, Math.round(pitch * 0.15)), rows = wide ? 7 : 5, cols = Math.ceil(room / pitch) + (wide ? 1 : 2);
    ff.style.cssText = `--cell:${pitch - gap}px;--gap:${gap}px;--cols:${cols};--rad:4px;--fy:${pitch}px`;
    ff.innerHTML = cells(cols * rows);
    if (reduce) return;
    const kids = ff.children;
    footTick = setInterval(() => {
      if (document.hidden) return;
      const k = kids[Math.floor(Math.random() * kids.length)]; if (k.className) return;
      k.className = 'tw'; setTimeout(() => { k.className = ''; }, 1700);
    }, 650);
  }

  /* ---------- Blog: activity map and generated covers ---------- */
  // Sample posts, keyed by days ago. Production reads these from the posts' front matter.
  const POSTS = {
    6:  { t: 'Gating LLM refactors behind compile and tests', topic: 'AI engineering', f: 'amber', min: 8, slug: 'gating-llm-refactors' },
    41: { t: 'What a hackathon weekend taught us about COBOL', topic: 'Hackathons', f: 'blue', min: 6, slug: 'hackathon-weekend-cobol' },
    97: { t: 'A Zoom bot for a whole cohort', topic: 'Automation', f: 'green', min: 5, slug: 'zoom-bot-cohort' },
  };
  const dayAgo = ago => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - ago); return d; };
  const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const coverCells = slug => { const h = hash(slug); return cells(42, i => { const v = rnd(i, h % 1000); return v < 10 ? 'l3' : v < 24 ? 'l2' : v < 44 ? 'l1' : ''; }); };
  function buildHeat(el, animate) {
    const weeks = +el.dataset.heat, n = weeks * 7;   // one dark cell per published post, from the post's date; nothing else is counted
    let html = '';
    for (let i = 0; i < n; i++) {
      const ago = n - 1 - i, p = POSTS[ago];
      html += p ? `<a href="#posts" data-l="l3" data-p="${ago}" aria-label="${fmtDate(dayAgo(ago))}: ${p.t} (sample)"></a>` : `<i></i>`;
    }
    el.innerHTML = html;
    [...el.children].forEach((c, i) => { const l = c.dataset.l; if (!l) return; animate && !reduce ? later(() => c.classList.add(l), 100 + Math.floor(i / 7) * (600 / weeks)) : c.classList.add(l); });
    if (!el.dataset.peek) { el.dataset.peek = '1'; wirePeek(el); }
  }
  function buildCover(el) { el.innerHTML = coverCells(el.dataset.cover); }

  /* Peek: hovering or focusing a post cell shows a small card above it. On touch the first tap shows
     the card and the card itself is the link; a tap anywhere else closes it. */
  let peek, peekFor = null, touchDown = false;
  function showPeek(a, tap = false) {
    const p = POSTS[a.dataset.p]; if (!p) return;
    if (!peek) { peek = document.createElement('a'); peek.setAttribute('aria-hidden', 'true'); peek.tabIndex = -1; document.body.append(peek); }
    peek.className = 'peek' + (tap ? ' tap' : ''); peek.href = a.getAttribute('href');
    peek.innerHTML = `<div class="cells cover peek-cv f-${p.f}">${coverCells(p.slug)}</div>
      <div><p class="peek-meta">${fmtDate(dayAgo(+a.dataset.p))} · ${p.topic}</p><p class="peek-t">${p.t}</p><p class="peek-meta">${p.min} min read</p></div>`;
    const r = a.getBoundingClientRect(), w = peek.offsetWidth, h = peek.offsetHeight, top = $('.site-head').getBoundingClientRect().bottom;
    let y = r.top - h - 10, below = y < top + 8;
    if (below) y = r.bottom + 10;
    peek.style.left = clamp(r.left + r.width / 2 - w / 2, 16, innerWidth - w - 16) + 'px';
    peek.style.top = y + 'px';
    peek.classList.toggle('below', below);
    peekFor = a; requestAnimationFrame(() => peek.classList.add('on'));
  }
  function hidePeek() { if (!peek) return; peek.classList.remove('on', 'tap'); peekFor = null; }
  function wirePeek(el) {
    el.addEventListener('pointerover', e => { const a = e.target.closest('a[data-p]'); if (e.pointerType === 'mouse' && a) showPeek(a); });
    el.addEventListener('pointerout', e => { if (e.pointerType === 'mouse' && e.target.closest('a[data-p]') && !e.relatedTarget?.closest?.('a[data-p]')) hidePeek(); });
    el.addEventListener('focusin', e => { const a = e.target.closest('a[data-p]'); if (a && a.matches(':focus-visible')) showPeek(a); });
    el.addEventListener('focusout', hidePeek);
    el.addEventListener('pointerdown', e => { touchDown = e.pointerType !== 'mouse'; });
    el.addEventListener('click', e => {   // screen readers send a click with no pointerdown, so they follow the link as normal
      const a = e.target.closest('a[data-p]'); if (!a || !touchDown) return;
      touchDown = false;
      if (peekFor !== a) { e.preventDefault(); showPeek(a, true); }
    });
    document.addEventListener('pointerdown', e => { if (peekFor && !e.target.closest('.peek, .heat a[data-p]')) hidePeek(); });
    addEventListener('scroll', hidePeek, { passive: true });
    addEventListener('resize', hidePeek);
  }
  function build(animate) {
    timers.forEach(clearTimeout); ticks.forEach(clearInterval); timers = []; ticks = [];
    buildField(animate);
    $$('[data-build]').forEach(el => ({ heat: buildHeat, cover: buildCover })[el.dataset.build](el, animate));
  }
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { build(false); buildFoot(); measure(); }, 120); });

  /* ---------- Intro (Draw): under a second, once per session, never under reduced motion ---------- */
  function playIntro() {
    if (reduce) return Promise.resolve();
    $('.intro')?.remove();
    const o = document.createElement('div'); o.className = 'intro'; o.setAttribute('aria-hidden', 'true');
    o.innerHTML = `<div class="intro-bg"></div><div class="intro-mark">${cells(15)}</div>`; document.body.append(o);
    const m = o.lastChild, target = $('svg', markEl).getBoundingClientRect();
    SHAPES.v[2].forEach(([c, r], k) => { const i = m.children[r * 5 + c]; i.className = 'on'; i.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 220, delay: 60 + k * 70, fill: 'both', easing: 'cubic-bezier(.2,.8,.2,1)' }); });
    const mb = m.getBoundingClientRect(), s = target.height / mb.height;
    m.animate([{ transform: 'none' }, { transform: `translate(${target.left - mb.left}px, ${target.top - mb.top}px) scale(${s})` }], { duration: 420, delay: 620, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' });
    o.firstChild.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, delay: 620, easing: 'ease-out', fill: 'forwards' });
    return new Promise(res => setTimeout(() => { o.remove(); res(); }, 1040));
  }
  /* Blog intro: the same V, drawn cell by cell, turns on its side into the prompt; the cursor cell arrives
     and blinks once; then it all travels to the header mark, where the cursor blinks three more times.
     About 1.6s, once per session, never under reduced motion. While it runs the header mark holds still
     under the overlay (.intro-run), so it does not also turn on its own. */
  function playIntroBlog() {
    if (reduce) return Promise.resolve();
    $('.intro')?.remove(); root.classList.remove('intro-done'); root.classList.add('intro-run');
    const o = document.createElement('div'); o.className = 'intro'; o.setAttribute('aria-hidden', 'true');
    o.innerHTML = `<div class="intro-bg"></div><div class="intro-prompt">${mark('prompt')}</div>`; document.body.append(o);
    const box = o.lastChild, chev = $('.chev', box), cur = $('.cur', box), target = $('svg', markEl).getBoundingClientRect();
    [...chev.children].forEach((r, k) => r.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 220, delay: 40 + k * 55, fill: 'both', easing: 'cubic-bezier(.2,.8,.2,1)' }));
    chev.animate([{ transform: 'translateX(10px) rotate(90deg)' }, { transform: 'none' }], { duration: 400, delay: 480, fill: 'both', easing: 'cubic-bezier(.6,0,.2,1)' });
    cur.animate([{ opacity: 0 }, { opacity: 1, offset: 0.02 }, { opacity: 1, offset: 0.5 }, { opacity: 0, offset: 0.51 }, { opacity: 0, offset: 0.75 }, { opacity: 1, offset: 0.76 }, { opacity: 1 }], { duration: 360, delay: 860, fill: 'both' });
    const bb = box.getBoundingClientRect(), s = target.height / bb.height;
    box.animate([{ transform: 'none' }, { transform: `translate(${target.left - bb.left}px, ${target.top - bb.top}px) scale(${s})` }], { duration: 420, delay: 1220, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' });
    o.firstChild.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, delay: 1220, easing: 'ease-out', fill: 'forwards' });
    return new Promise(res => setTimeout(() => { o.remove(); root.classList.remove('intro-run'); root.classList.add('intro-done'); res(); }, 1650));
  }
  const intro = page === 'blog' ? playIntroBlog : playIntro;

  /* ---------- Theme ---------- */
  const themeBtn = $('[data-theme-btn]'), order = ['system', 'light', 'dark'], label = { system: 'Auto', light: 'Light', dark: 'Dark' };
  function setTheme(t) {
    if (!label[t]) t = 'system';
    t === 'system' ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', t);
    themeBtn.dataset.t = t; themeBtn.lastElementChild.textContent = label[t]; themeBtn.setAttribute('aria-label', 'Theme: ' + label[t] + '. Change theme'); mem.set('theme', t);
  }
  themeBtn.onclick = () => setTheme(order[(order.indexOf(themeBtn.dataset.t) + 1) % 3]);

  /* ---------- Preview options ---------- */
  const OPTS = {
    portfolio: [
      ['intro', 'Intro', [['play', 'Replay']]], ['sleep', 'Owl', [['now', 'Sleep now']]],
    ],
    blog: [['intro', 'Intro', [['play', 'Replay']]]],
  }[page];
  const panel = document.createElement('aside'); panel.className = 'panel flip'; panel.setAttribute('aria-label', 'Preview options');
  panel.dataset.open = String(innerWidth >= 700 && qs.get('panel') !== '0');
  panel.innerHTML = `<button type="button" class="panel-t">Preview options</button><div class="panel-b">` + OPTS.map(([k, name, list]) =>
    `<div class="pg"><span>${name}</span><div class="seg" role="group" aria-label="${name}">${list.map(([v, t]) => `<button type="button" data-k="${k}" data-v="${v}">${t}</button>`).join('')}</div></div>`).join('') + `</div>`;
  if (OPTS.length) document.body.append(panel);
  $('.panel-t', panel).onclick = () => { panel.dataset.open = String(panel.dataset.open !== 'true'); };

  function apply(k, v, user) {
    if (k === 'intro') { if (user) { scrollTo(0, 0); build(false); intro().then(() => build(true)); } return; }
    if (k === 'sleep') { if (user) setTimeout(() => { lastMove = Date.now() - 9000; }, 0); return; }   // preview only: skip the eight-second wait
    opt[k] = v; mem.set(page + '-' + k, v);
    $$(`[data-k="${k}"]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    if (user) build(true);
  }
  panel.addEventListener('click', e => { e.stopPropagation(); const b = e.target.closest('[data-k]'); if (b) apply(b.dataset.k, b.dataset.v, true); });

  /* ---------- Start ---------- */
  setTheme(qs.get('theme') || mem.get('theme', 'system'));
  OPTS.forEach(([k, , list]) => { if (k === 'intro' || k === 'sleep') return; const v = qs.get(k) || mem.get(page + '-' + k, list[0][0]); apply(k, list.some(o => o[0] === v) ? v : list[0][0]); });
  // Each site plays its intro once per session (in production they are separate hosts, so separate sessions anyway).
  let seen = false; try { seen = sessionStorage.getItem('lb4-intro-' + page); sessionStorage.setItem('lb4-intro-' + page, '1'); } catch {}
  document.fonts.ready.then(() => {
    measure(); build(false); buildFoot();
    (!seen && qs.get('intro') !== 'none' ? intro() : Promise.resolve()).then(() => build(true));
  });
})();
