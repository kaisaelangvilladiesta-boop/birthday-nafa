(() => {
const C = window.CONFIG, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const urls = {}; // key -> active image url

/* ---------- Foto (dari config.js) ---------- */
function loadPhotos() {
  for (const k in C.photos) urls[k] = C.photos[k].src;
  $$('[data-photo]').forEach(img => { const k = img.dataset.photo; img.src = urls[k]; img.alt = C.photos[k].alt || ''; });
  buildGallery();
}

/* ---------- Teks dari config ---------- */
$$('[data-name]').forEach(e => e.textContent = C.nickname);
$$('[data-date]').forEach(e => e.textContent = C.date);
document.title = `Happy ${C.age}th Birthday, ${C.nickname}`;
$('#sign').textContent = C.letterSign;
$('#giftText').textContent = C.gift; $('#extra').textContent = C.giftExtra;

/* ---------- Bintang ---------- */
const sky = $('#sky');
for (let i = 0; i < 45; i++) { const s = document.createElement('i'); const z = 1 + Math.random() * 2.5;
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--s:${z}px;--d:${2 + Math.random() * 4}s;animation-delay:${-Math.random() * 5}s`; sky.appendChild(s); }
if (!reduced) addEventListener('pointermove', e => { const x = (e.clientX / innerWidth - .5) * 14, y = (e.clientY / innerHeight - .5) * 14; sky.style.transform = `translate(${x}px,${y}px)`; });

/* ---------- Efek hati ---------- */
function hearts(x, y, n = 10) {
  if (reduced) return;
  for (let i = 0; i < n; i++) { const h = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); h.setAttribute('class', 'heartfx');
    h.innerHTML = '<use href="#heart"/>'; const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
    h.style.cssText = `left:${x}px;top:${y}px;--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d - 40}px`; document.body.appendChild(h); setTimeout(() => h.remove(), 1700); }
}
document.addEventListener('click', e => { if (e.target.closest('.btn,.tile,.box,.env')) hearts(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2, 6); });

/* ---------- Navigasi ---------- */
let current = 'envelope';
function go(id) {
  if (id === current) return;
  $('#' + current).classList.remove('active'); const next = $('#' + id); next.classList.add('active'); next.scrollTop = 0; current = id;
  if (id === 'moment') buildLetter();
  if (id === 'gift') resetGift();
  if (id !== 'playlist') pause();
  if (id === 'journey') buildGallery();
  onEnter(id);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });

/* ---------- Amplop ---------- */
$('#envBtn').addEventListener('click', e => { const env = e.currentTarget; if (env.classList.contains('open')) return; env.classList.add('open'); setTimeout(() => go('birthday'), reduced ? 300 : 2000); });

/* ---------- Galeri + lightbox ---------- */
const rot = [-4, 3, -2, 5, -5, 2];
function buildGallery() {
  const g = $('#gallery'); g.innerHTML = '';
  Object.keys(C.photos).filter(k => k.startsWith('gallery')).forEach((k, i) => {
    const b = document.createElement('button'); b.className = 'polaroid'; b.style.cssText = `--r:${rot[i % 6]}deg;--i:${i}`; b.setAttribute('aria-label', 'Perbesar ' + (C.photos[k].caption || 'foto'));
    b.innerHTML = `<img alt=""><span class="script" style="display:block;font-size:1.5rem"></span>`;
    $('img', b).src = urls[k]; $('img', b).alt = C.photos[k].alt || ''; $('span', b).textContent = C.photos[k].caption || '';
    b.onclick = () => { $('#lbImg').src = urls[k]; $('#lbImg').alt = C.photos[k].alt || ''; $('#lbCap').textContent = C.photos[k].caption || ''; $('#lb').showModal(); };
    g.appendChild(b);
  });
}
$('#lbClose').onclick = () => $('#lb').close();
$('#lb').addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.close(); });

/* ---------- Surat ---------- */
function buildLetter() {
  const body = $('#letterBody'); body.innerHTML = '';
  C.letter.forEach((t, i) => { const p = document.createElement('p'); p.textContent = t; p.style.animationDelay = (reduced ? 0 : 1 + i * 1.1) + 's'; body.appendChild(p); });
  const l = $('.letter'); l.style.animation = 'none'; void l.offsetWidth; l.style.animation = '';
}

/* ---------- Musik ---------- */
const au = $('#audio'), playBtn = $('#play'), seek = $('#seek');
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
function setTrack(src, title, artist) { au.src = src; au.load(); $('#trTitle').textContent = title; $('#trArtist').textContent = artist || ''; $('#audioNote').textContent = ''; seek.value = 0; $('#cur').textContent = '0:00'; }
setTrack(C.music.src, C.music.title, C.music.artist);
function ui(on) { playBtn.textContent = on ? '❚❚' : '▶'; playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play'); $('#vinyl').classList.toggle('on', on); $('#eq').classList.toggle('on', on); }
function pause() { if (!au.paused) au.pause(); }
playBtn.onclick = () => { if (au.paused) au.play().catch(() => $('#audioNote').textContent = 'File musik tidak ditemukan. Taruh lagu di folder music/.'); else au.pause(); };
au.onplay = () => ui(true); au.onpause = () => ui(false);
au.onerror = () => { ui(false); $('#audioNote').textContent = 'File musik belum ada atau tidak bisa dibaca. Taruh lagu di folder music/.'; };
au.onloadedmetadata = () => $('#dur').textContent = fmt(au.duration);
au.ontimeupdate = () => { if (au.duration) seek.value = au.currentTime / au.duration * 100; $('#cur').textContent = fmt(au.currentTime); };
seek.oninput = () => { if (au.duration) au.currentTime = seek.value / 100 * au.duration; };
$('#vol').oninput = e => au.volume = e.target.value; au.volume = .8;
$('#loop').onclick = e => { au.loop = !au.loop; e.currentTarget.setAttribute('aria-pressed', au.loop); };

/* ---------- Hadiah ---------- */
const box = $('#box');
function resetGift() { box.classList.remove('open'); $('#giftMsg').hidden = true; $('#extra').hidden = true; $('#giftHint').hidden = false; $('#moreBtn').hidden = false; }
box.onclick = () => { if (box.classList.contains('open')) return; box.classList.add('open'); if (!reduced) confetti(60); $('#giftHint').hidden = true; const r = box.getBoundingClientRect(); hearts(r.left + r.width / 2, r.top + 20, 22); setTimeout(() => $('#giftMsg').hidden = false, reduced ? 0 : 700); };
$('#moreBtn').onclick = e => { $('#extra').hidden = false; e.currentTarget.hidden = true; };

/* ---------- v2: dekorasi & animasi tambahan ---------- */
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (id, cls) => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('class', cls); s.innerHTML = `<use href="#${id}"/>`; return s; };
const amb = document.createElement('div'); amb.id = 'ambient'; amb.setAttribute('aria-hidden', 'true'); document.body.insertBefore(amb, $('main'));
const rnd = (a, b) => a + Math.random() * (b - a);
if (!reduced) {
  for (let i = 0; i < 14; i++) { const h = svgEl('heart', 'fh'); h.style.cssText = `left:${rnd(0, 100)}%;--sz:${rnd(10, 26)}px;--d:${rnd(12, 24)}s;animation-delay:${-rnd(0, 20)}s`; amb.appendChild(h); }
  const cs = ['#bfe3ff', '#cdbfff', '#f6c6dc', '#7ec3f5', '#fff'];
  for (let i = 0; i < 5; i++) { const b = document.createElement('span'); b.className = 'bf'; b.style.cssText = `--y:${rnd(8, 80)}%;--c:${cs[i]};--d:${rnd(24, 38)}s;--dl:${-rnd(0, 30)}s`; b.appendChild(svgEl('fly', '')); amb.appendChild(b); }
  setInterval(() => { if (document.hidden) return; const s = document.createElement('i'); s.className = 'shoot'; s.style.cssText = `left:${rnd(0, 70)}%;top:${rnd(0, 35)}%`; amb.appendChild(s); setTimeout(() => s.remove(), 1500); }, 6500);
  if (matchMedia('(pointer:fine)').matches) { let last = 0;
    addEventListener('pointermove', e => { const t = performance.now(); if (t - last < 45) return; last = t; const s = document.createElement('i'); s.className = 'spark'; s.style.cssText = `left:${e.clientX - 6}px;top:${e.clientY - 6}px;background:${Math.random() > .5 ? '#fff' : '#f6c6dc'}`; document.body.appendChild(s); setTimeout(() => s.remove(), 800); }); }
}
function confetti(n, kind) {
  const cols = ['#bfe3ff', '#cdbfff', '#f6c6dc', '#fff', '#7ec3f5'];
  for (let i = 0; i < n; i++) { const c = document.createElement('i'); c.className = 'conf ' + (kind || '');
    c.style.cssText = `left:${rnd(0, 100)}%;--x:${rnd(-80, 80)}px;--d:${rnd(3, 5.5)}s;--r:${rnd(0, 720)}deg;background:${cols[i % 5]};animation-delay:${rnd(0, .8)}s`; document.body.appendChild(c); setTimeout(() => c.remove(), 7000); }
}
const decorated = new Set();
function onEnter(id) {
  const pg = $('#' + id);
  if (!decorated.has(id)) { decorated.add(id);
    if (id === 'birthday') { const cs = ['#bfe3ff', '#cdbfff', '#f6c6dc', '#7ec3f5'];
      for (let i = 0; i < 6; i++) { const b = document.createElement('i'); b.className = 'balloon'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `left:${5 + i * 17}%;--c:${cs[i % 4]};--d:${rnd(9, 15)}s;--dl:${-rnd(0, 10)}s;--dx:${rnd(-30, 30)}px`; pg.appendChild(b); } }
    else { [svgEl('cat', 'pd bl'), svgEl('rose', 'pd tr'), svgEl('heart', 'pd hr')].forEach(e => { e.setAttribute('aria-hidden', 'true'); pg.appendChild(e); }); }
  }
  if (reduced) return;
  if (id === 'birthday') setTimeout(() => confetti(70), 900);
  if (id === 'moment') setTimeout(() => confetti(16, 'pet'), 1200);
}
let noteT;
au.addEventListener('play', () => { if (reduced) return; clearInterval(noteT); noteT = setInterval(() => { const v = $('#vinyl').getBoundingClientRect(); const n = document.createElement('span'); n.className = 'note2'; n.textContent = ['♪', '♫', '♡'][Math.random() * 3 | 0]; n.style.cssText = `left:${v.left + Math.random() * v.width}px;top:${v.top}px`; document.body.appendChild(n); setTimeout(() => n.remove(), 2600); }, 500); });
au.addEventListener('pause', () => clearInterval(noteT));

loadPhotos();
})();
