'use strict';

/* ─── Lucide icons ─────────────────────────────────────────── */
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

/* ─── Theme toggle ─────────────────────────────────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Load saved theme or default dark
const saved = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  // Re-render icons (in case colors change)
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

/* ─── Navbar scroll ────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ─── Mobile menu ──────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
mobileMenu.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', false);
  });
});

/* ─── Intersection Observer — reveal ──────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Typewriter ───────────────────────────────────────────── */
const phrases = [
  'Software Developer',
  'Open Source Enthusiast',
  'Problem Solver',
  'Code Craftsman',
  'Systems Thinker',
];
const tw = document.getElementById('typewriter');
let pi = 0, ci = 0, del = false, pause = 0;

function type() {
  const cur = phrases[pi];
  if (del) { ci--; } else { ci++; }
  tw.textContent = cur.slice(0, ci);
  let speed = del ? 40 : 85;
  if (!del && ci === cur.length) { pause = 1800; del = true; }
  else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; pause = 300; }
  setTimeout(type, speed + pause);
  pause = 0;
}
setTimeout(type, 500);

/* ─── Animated counters (stat cards) ──────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString('es-AR');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObs.observe(el));

/* ─── Commit graph generator (original feature) ────────────── */
(function buildCommitGraph() {
  const graph = document.getElementById('commitGraph');
  if (!graph) return;
  // 3 weeks × 7 days = 21 cells
  const weeks = 3;
  const levels = [0,0,0,1,1,2,2,3,1,0,2,3,2,1,0,1,2,1,0,3,2];
  for (let i = 0; i < weeks * 7; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    const lvl = levels[i] ?? 0;
    if (lvl > 0) cell.classList.add(`lvl${lvl}`);
    cell.title = `${lvl > 0 ? lvl + ' commit(s)' : 'Sin actividad'}`;
    graph.appendChild(cell);
  }
})();

/* ─── Live status ticker ───────────────────────────────────── */
(function liveStatus() {
  const activities = [
    { text: 'Programando...', lang: 'Java', tool: 'VS Code' },
    { text: 'Depurando código...', lang: 'JavaScript', tool: 'Terminal' },
    { text: 'Leyendo docs...', lang: 'Java', tool: 'Terminal' },
    { text: 'Escribiendo tests...', lang: 'JSON', tool: 'Insomnia' },
    { text: 'Revisando PRs...', lang: 'GitHub', tool: 'Browser' },
  ];

  const actEl   = document.getElementById('statusActivity');
  const lastEl  = document.getElementById('lastActive');
  const langEl  = document.getElementById('stackLang');
  const toolEl  = document.getElementById('stackTool');

  if (!actEl) return;

  let minutes = 0;
  let idx = 0;

  function tick() {
    minutes++;
    lastEl.textContent = minutes < 60
      ? `${minutes}m`
      : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }

  function rotate() {
    idx = (idx + 1) % activities.length;
    const a = activities[idx];
    actEl.style.opacity = '0';
    setTimeout(() => {
      actEl.textContent = a.text;
      langEl.textContent = a.lang;
      toolEl.textContent = a.tool;
      actEl.style.opacity = '1';
      minutes = 0;
    }, 300);
  }

  actEl.style.transition = 'opacity 0.3s ease';

  // Update minute counter every 60s, rotate activity every 8s
  setInterval(tick, 60_000);
  setInterval(rotate, 8_000);
})();

/* ─── Active nav highlight on scroll ──────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--ctp-mauve)' : '';
      });
    }
  });
}, { rootMargin: '-35% 0px -60% 0px' });

sections.forEach(s => sectionObs.observe(s));
