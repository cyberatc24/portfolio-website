// Swarm rebuild: as content scrolls into view for the first time, a swarm of multiplayer-style
// cursors "rebuilds" it — boxes are dragged out with a crosshair and a live size badge, text is
// typed in line by line with a caret, and ruler guides snap in. Faster scrolling calls in more
// agents. Vanilla JS on purpose: it sits on top of the React/Framer Motion tree without touching it,
// and only ever sets a temporary clip-path on the elements it builds.

const NAMES = ['Lambda', 'EC2', 'S3', 'IAM', 'RDS', 'VPC', 'SES', 'SNS', 'Config', 'CloudWatch', 'EventBridge', 'Terraform', 'Python', 'Bash'];
const COLORS = ['#ff7a59', '#b9a3ff', '#3ddc97', '#4cc9f0', '#ffd166', '#f72585', '#ffb38a', '#7b61ff', '#06d6a0', '#ff9f1c', '#5aa9ff', '#e86fff', '#9be15d', '#ff5d8f'];
const TEXT = 'h1,h2,h3,h4,blockquote,p';
const BOX = 'img,video,figure,article,[class*="card"],[class*="panel"],.mac-phone,.comparison';
const SKIP = '.x-sr,.skip-link,dialog,[class*="marquee"],[class*="ticker"],.bip,.brand-viewport,.hero-intro h1,.sw-root';

const ARROW = '<svg class="sw-arrow" viewBox="0 0 24 24" width="22" height="22"><path d="M3 2l17 8.2-7.4 1.9-2.6 7.3z" fill="currentColor" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const CROSS = '<svg class="sw-cross" viewBox="0 0 24 24" width="22" height="22"><path d="M12 2v20M2 12h20" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
const IBEAM = '<svg class="sw-ibeam" viewBox="0 0 24 24" width="22" height="22"><path d="M8 3h8M8 21h8M12 3v18" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M8 3h8M8 21h8M12 3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => 1 - Math.pow(1 - t, 3);
const rnd = (a, b) => a + Math.random() * (b - a);

export function createSwarm() {
  const touch = matchMedia('(hover: none)').matches;
  const small = innerWidth < 700;
  const BASE = small ? 4 : 6;
  const MAX = small ? 8 : 14;

  const root = document.createElement('div');
  root.className = 'sw-root';
  root.setAttribute('aria-hidden', 'true');
  const hud = document.createElement('div');
  hud.className = 'sw-hud';
  hud.innerHTML = '<span class="sw-dots"></span><span><b class="sw-n">0</b> agents</span><i class="sw-sep"></i><span><b class="sw-built">0</b> / <span class="sw-total">0</span> layers</span><span class="sw-bar"><i></i></span><button type="button" class="sw-skip">Skip</button>';
  root.appendChild(hud);
  document.body.appendChild(root);
  const $ = s => hud.querySelector(s);

  // ── targets ──────────────────────────────────────────────────────────────
  const targets = new Map(); // el -> { kind, state }
  const main = document.querySelector('main') || document.body;
  const chosen = new Set();
  for (const el of main.querySelectorAll(`${BOX},${TEXT}`)) {
    if (el.closest(SKIP)) continue;
    let p = el.parentElement, nested = false;
    while (p && p !== main) { if (chosen.has(p)) { nested = true; break; } p = p.parentElement; }
    if (nested) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 12 || r.width > innerWidth * 1.6) continue;
    const cs = getComputedStyle(el);
    if (cs.clipPath !== 'none' || cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (el.matches(TEXT) && !el.textContent.trim()) continue;
    chosen.add(el);
    targets.set(el, { kind: el.matches(TEXT) && !el.matches(BOX) ? 'text' : 'box', state: 'pending', queuedAt: 0 });
    el.setAttribute('data-swarm', 'p');
  }
  let built = 0;
  $('.sw-total').textContent = targets.size;

  const reveal = el => {
    const t = targets.get(el);
    if (!t || t.state === 'done') return;
    t.state = 'done';
    el.style.clipPath = '';
    el.removeAttribute('data-swarm');
    built++;
  };
  const revealAll = () => { for (const el of targets.keys()) reveal(el); queue.length = 0; };

  // ── agents ───────────────────────────────────────────────────────────────
  const agents = [];
  let nameIx = Math.floor(Math.random() * NAMES.length);
  const logo = document.querySelector('.wordmark')?.getBoundingClientRect();
  function spawn(fromLogo) {
    const i = nameIx++ % NAMES.length;
    const node = document.createElement('div');
    node.className = 'sw-agent';
    node.style.color = COLORS[i % COLORS.length];
    node.innerHTML = `${ARROW}${CROSS}${IBEAM}<span class="sw-name" style="background:${COLORS[i % COLORS.length]}">${NAMES[i]}</span>`;
    root.appendChild(node);
    let x, y;
    if (fromLogo && logo) { x = logo.left + rnd(0, logo.width); y = logo.top + rnd(0, logo.height); }
    else { const side = Math.random() < 0.5 ? -40 : innerWidth + 40; x = side; y = rnd(innerHeight * 0.2, innerHeight * 0.8); }
    const a = { node, x, y, tx: x, ty: y, job: null, mode: 'arrow', angle: rnd(0, Math.PI * 2), r: rnd(36, 96), leaving: false, wob: rnd(0, 100) };
    agents.push(a);
    return a;
  }
  for (let i = 0; i < BASE; i++) spawn(true);
  const setMode = (a, m) => { if (a.mode !== m) { a.mode = m; a.node.dataset.mode = m; } };

  // ── overlay pieces (selection boxes, carets, guides) ─────────────────────
  const make = (cls, color) => { const d = document.createElement('div'); d.className = cls; if (color) d.style.setProperty('--c', color); root.appendChild(d); return d; };
  const fadeOut = (node, ms = 380) => { node.classList.add('is-out'); setTimeout(() => node.remove(), ms); };
  const guides = [];
  function guide(el, color, vertical) {
    const g = make(`sw-guide ${vertical ? 'is-v' : 'is-h'}`, color);
    guides.push({ g, el, vertical, born: performance.now() });
  }

  // ── queue + jobs ─────────────────────────────────────────────────────────
  const queue = [];
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      const t = targets.get(e.target);
      if (!t) continue;
      if (e.isIntersecting && t.state === 'pending') { t.state = 'queued'; t.queuedAt = performance.now(); queue.push(e.target); }
      else if (!e.isIntersecting && t.state === 'queued') { reveal(e.target); }
    }
  }, { rootMargin: '0px 0px -14% 0px', threshold: 0 });
  for (const el of targets.keys()) io.observe(el);

  function startJob(a, el) {
    const t = targets.get(el);
    t.state = 'building';
    const color = a.node.style.color;
    const job = { el, kind: t.kind, phase: 'travel', t0: performance.now(), color, sel: make('sw-sel', color), badge: null, caret: null };
    if (job.kind === 'box') {
      job.badge = make('sw-badge', color);
      job.sel.innerHTML = '<i></i><i></i><i></i><i></i>';
    } else {
      job.caret = make('sw-caret', color);
      job.sel.classList.add('is-text');
      const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.3 || 20;
      job.lh = lh;
      job.chars = el.textContent.trim().length;
      if (/^H[12]$/.test(el.tagName) && Math.random() < 0.7) guide(el, color, true);
      if (Math.random() < 0.35) guide(el, color, false);
    }
    job.sel.style.opacity = '0';
    a.job = job;
  }

  function finishJob(a) {
    const job = a.job;
    reveal(job.el);
    if (job.kind === 'box') { job.sel.classList.add('is-done'); setTimeout(() => fadeOut(job.sel), 260); fadeOut(job.badge, 260); }
    else { fadeOut(job.sel, 300); fadeOut(job.caret, 200); }
    a.job = null;
    setMode(a, 'arrow');
  }

  function runJob(a, now) {
    const job = a.job, el = job.el;
    if (!el.isConnected) { job.sel.remove(); job.badge?.remove(); job.caret?.remove(); a.job = null; return; }
    const r = el.getBoundingClientRect();
    const place = (n, x, y, w, h) => { n.style.transform = `translate3d(${x}px,${y}px,0)`; n.style.width = `${Math.max(0, w)}px`; n.style.height = `${Math.max(0, h)}px`; };

    if (job.phase === 'travel') {
      a.tx = job.kind === 'box' ? r.left : r.left - 4;
      a.ty = job.kind === 'box' ? r.top : r.top + Math.min(job.lh || 20, r.height) * 0.5;
      setMode(a, job.kind === 'box' ? 'cross' : 'ibeam');
      if (Math.hypot(a.tx - a.x, a.ty - a.y) < 16 || now - job.t0 > 520) {
        job.phase = 'build'; job.t0 = now;
        job.dur = job.kind === 'box' ? clamp(380 + (r.width + r.height) * 0.22, 420, 880)
          : clamp(Math.max(job.chars * 14, (r.height / job.lh) * 230), 360, 1300);
        el.setAttribute('data-swarm', 'b');
        job.sel.style.opacity = '';
      }
      return;
    }

    const p = clamp((now - job.t0) / job.dur, 0, 1);
    if (job.kind === 'box') {
      const e = ease(p);
      const w = r.width * e, h = r.height * e;
      el.style.clipPath = `inset(0 ${(1 - e) * 100}% ${(1 - e) * 100}% 0)`;
      place(job.sel, r.left, r.top, w, h);
      job.badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      job.badge.style.transform = `translate3d(${r.left + w / 2}px,${r.top + h + 8}px,0) translateX(-50%)`;
      a.tx = r.left + w; a.ty = r.top + h; a.x = a.tx; a.y = a.ty;
    } else {
      const lines = Math.max(1, Math.round(r.height / job.lh));
      const lh = r.height / lines;
      const raw = p * lines;
      const line = Math.min(lines - 1, Math.floor(raw));
      const steps = Math.max(6, Math.round((job.chars / lines) || 10));
      const part = p >= 1 ? 1 : Math.floor((raw - line) * steps) / steps;
      const y0 = line * lh, y1 = y0 + lh, xp = part * 100;
      el.style.clipPath = p >= 1 ? 'inset(0)' : `polygon(0 0,100% 0,100% ${y0}px,${xp}% ${y0}px,${xp}% ${y1}px,0 ${y1}px)`;
      place(job.sel, r.left - 3, r.top - 2, r.width + 6, r.height + 4);
      const cx = r.left + r.width * part, cy = r.top + y0;
      place(job.caret, cx, cy, 2, lh);
      a.tx = cx + 6; a.ty = cy + lh * 0.55; a.x += (a.tx - a.x) * 0.5; a.y += (a.ty - a.y) * 0.5;
    }
    if (p >= 1) finishJob(a);
  }

  // ── input: scroll velocity, pointer ──────────────────────────────────────
  let lastY = scrollY, lastT = performance.now(), vel = 0, lastActive = performance.now();
  let mouse = null, mouseT = 0;
  const onScroll = () => {
    const now = performance.now(), dt = Math.max(16, now - lastT);
    vel = vel * 0.6 + (Math.abs(scrollY - lastY) / dt) * 1000 * 0.4; // px/s
    lastY = scrollY; lastT = now; lastActive = now;
  };
  const onMove = e => { if (e.pointerType === 'mouse') { mouse = { x: e.clientX, y: e.clientY }; mouseT = performance.now(); } };
  const skip = () => { revealAll(); stopped = true; try { sessionStorage.setItem('vs-swarm-skip', '1'); } catch {} };
  const onKey = e => { if (e.key === 'Escape' && hud.classList.contains('is-on')) skip(); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('keydown', onKey);
  $('.sw-skip').addEventListener('click', skip);

  // ── loop ─────────────────────────────────────────────────────────────────
  let raf = 0, prev = performance.now(), stopped = false, calmSince = 0, hudOffAt = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(50, now - prev) / 1000; prev = now;
    vel *= Math.pow(0.08, dt);

    // stale queue items (scrolled past while waiting) are revealed instantly
    while (queue.length && now - targets.get(queue[0])?.queuedAt > 2600) reveal(queue.shift());

    // agent count follows scroll speed
    const live = agents.filter(a => !a.leaving);
    const want = stopped ? 0 : clamp(Math.round(BASE + vel / 450), BASE, MAX);
    if (live.length < want && Math.random() < 0.25) spawn(false);
    if (live.length > want) {
      if (!calmSince) calmSince = now;
      if (now - calmSince > (stopped ? 0 : 1600)) {
        const idle = live.find(a => !a.job);
        if (idle) { idle.leaving = true; idle.tx = idle.x < innerWidth / 2 ? -80 : innerWidth + 80; idle.ty = idle.y + rnd(-60, 60); }
        calmSince = now - 1300;
      }
    } else calmSince = 0;

    // hand out work, a little staggered so it reads as a team
    for (const a of agents) {
      if (a.leaving || a.job || !queue.length || stopped) continue;
      const el = queue.shift();
      if (targets.get(el)?.state === 'queued' && el.isConnected) { startJob(a, el); break; }
    }

    const busy = agents.some(a => a.job) || queue.length > 0;
    if (busy) lastActive = now;
    const mouseFresh = !touch && mouse && now - mouseT < 4000;
    const asleep = !busy && now - lastActive > 3200 && !mouseFresh;

    for (let i = agents.length - 1; i >= 0; i--) {
      const a = agents[i];
      if (a.job) runJob(a, now);
      else if (!a.leaving) {
        a.angle += dt * 0.6;
        if (mouseFresh) { a.tx = mouse.x + Math.cos(a.angle + i) * a.r; a.ty = mouse.y + Math.sin(a.angle + i) * a.r * 0.7; }
        else { a.tx = innerWidth * (0.55 + 0.3 * Math.cos(a.angle * 0.5 + i)); a.ty = innerHeight * (0.5 + 0.28 * Math.sin(a.angle * 0.7 + i * 1.7)); }
      }
      const k = 1 - Math.exp(-dt * (a.job ? 10 : a.leaving ? 4 : 3));
      a.x += (a.tx - a.x) * k; a.y += (a.ty - a.y) * k;
      const wob = a.job ? 0 : Math.sin(now / 700 + a.wob) * 3;
      a.node.style.transform = `translate3d(${a.x}px,${a.y + wob}px,0)`;
      a.node.style.opacity = asleep && !a.job ? '0' : '1';
      if (a.leaving && (a.x < -60 || a.x > innerWidth + 60)) { a.node.remove(); agents.splice(i, 1); }
    }

    // guides follow their element while they fade
    for (let i = guides.length - 1; i >= 0; i--) {
      const gd = guides[i], age = now - gd.born;
      if (age > 1100 || !gd.el.isConnected) { gd.g.remove(); guides.splice(i, 1); continue; }
      const r = gd.el.getBoundingClientRect();
      gd.g.style.transform = gd.vertical ? `translate3d(${r.left}px,0,0)` : `translate3d(0,${r.top}px,0)`;
      gd.g.style.opacity = String(age < 150 ? age / 150 : 1 - (age - 150) / 950);
    }

    // HUD
    if (busy && !stopped) { hud.classList.add('is-on'); hudOffAt = now + 1400; }
    else if (now > hudOffAt) hud.classList.remove('is-on');
    if (hud.classList.contains('is-on')) {
      $('.sw-n').textContent = agents.length;
      $('.sw-built').textContent = built;
      $('.sw-bar i').style.width = `${(built / Math.max(1, targets.size)) * 100}%`;
      const dots = agents.slice(0, 5).map(a => `<i style="background:${a.node.style.color}">${a.node.textContent[0]}</i>`).join('');
      if ($('.sw-dots').innerHTML !== dots) $('.sw-dots').innerHTML = dots;
    }
    if (stopped && !agents.length) hud.classList.remove('is-on');
  }
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      revealAll();
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onMove);
      removeEventListener('keydown', onKey);
      root.remove();
    },
  };
}

export const swarmSkipped = () => { try { return sessionStorage.getItem('vs-swarm-skip') === '1'; } catch { return false; } };
