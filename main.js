/* =========================================
   MAHDI LUKWAGO PORTFOLIO — main.js
========================================= */

/* ---- ADMIN PASSWORD (change this!) ---- */
const ADMIN_PASSWORD = "Mahdi@2024!";

/* ======= DOM READY ======= */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initScrollSpy();
  initAnimations();
  initSkillBars();
  initPortfolioFilter();
  initContactForm();
  initAdmin();
  initHamburger();
  initSmoothScroll();
  loadAdminData();
});

/* ======= SMOOTH SCROLL ======= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"], .scroll-link').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      }
    });
  });
}

/* ======= HAMBURGER ======= */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    sidebar.classList.toggle('open');
  });
}

/* ======= ACTIVE NAV LINK ======= */
function initNav() {
  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive: true });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  let current = '';

  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= window.innerHeight * 0.4) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === current);
  });
}

/* ======= SCROLL SPY / INTERSECTION OBSERVER ======= */
function initScrollSpy() { /* covered by updateActiveNav */ }

/* ======= SECTION ANIMATIONS ======= */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-inner').forEach(el => observer.observe(el));
}

/* ======= SKILL BARS ======= */
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = width; }, 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const resumeSection = document.getElementById('resume');
  if (resumeSection) observer.observe(resumeSection);
}

/* ======= PORTFOLIO FILTER ======= */
function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.port-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ======= CONTACT FORM ======= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ MESSAGE SENT!';
    btn.style.background = '#F5C518';
    btn.style.color = '#2D2D2D';
    setTimeout(() => {
      btn.textContent = 'SEND MESSAGE';
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3000);
  });
}

/* ======= ADMIN PANEL ======= */
function initAdmin() {
  const overlay = document.getElementById('adminOverlay');
  const closeBtn = document.getElementById('adminClose');
  const loginBtn = document.getElementById('adminLoginBtn');
  const passInput = document.getElementById('adminPass');
  const hint = document.getElementById('adminHint');

  // Secret URL trigger: add ?admin to URL
  if (window.location.search.includes('admin') || window.location.hash === '#admin-secret') {
    openAdminOverlay();
  }

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
  let konamiSeq = [];
  const KONAMI = [38,38,40,40,37,39,37,39,66,65];
  document.addEventListener('keydown', e => {
    konamiSeq.push(e.keyCode);
    if (konamiSeq.length > KONAMI.length) konamiSeq.shift();
    if (JSON.stringify(konamiSeq) === JSON.stringify(KONAMI)) {
      openAdminOverlay();
    }
  });

  // Triple-click on footer note
  let clickCount = 0;
  const thanks = document.querySelector('.thanks-note');
  if (thanks) {
    thanks.addEventListener('click', () => {
      clickCount++;
      if (clickCount >= 3) { openAdminOverlay(); clickCount = 0; }
      setTimeout(() => { clickCount = 0; }, 1500);
    });
  }

  closeBtn.addEventListener('click', closeAdminOverlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeAdminOverlay(); });

  loginBtn.addEventListener('click', () => {
    if (passInput.value === ADMIN_PASSWORD) {
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'block';
      buildAdminDashboard();
    } else {
      hint.textContent = '✗ Incorrect password. Try again.';
      passInput.value = '';
      passInput.focus();
    }
  });

  passInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginBtn.click();
  });
}

function openAdminOverlay() {
  document.getElementById('adminOverlay').classList.add('open');
  document.getElementById('adminPass').focus();
}

function closeAdminOverlay() {
  document.getElementById('adminOverlay').classList.remove('open');
  document.getElementById('adminLogin').style.display = 'block';
  document.getElementById('adminDashboard').style.display = 'none';
  document.getElementById('adminPass').value = '';
  document.getElementById('adminHint').textContent = '';
}

function buildAdminDashboard() {
  buildPortAdmin();
  buildTestiAdmin();
  buildStatsAdmin();
}

/* --- Portfolio admin fields --- */
const portProjects = [
  { id: 'port1', label: 'Full-Stack Dashboard' },
  { id: 'port2', label: 'Network Scanner CLI' },
  { id: 'port3', label: 'Crypto Algo Bot' },
  { id: 'port4', label: 'E-Commerce Platform' },
  { id: 'port5', label: 'CTF Toolkit' },
  { id: 'port6', label: 'Sentiment Trading Signal' },
];

function buildPortAdmin() {
  const wrap = document.getElementById('port-admin-items');
  wrap.innerHTML = '';
  portProjects.forEach((p, i) => {
    const saved = getStore(`port_img_${i}`) || '';
    wrap.innerHTML += `
      <div class="admin-field">
        <label>${p.label} — Image URL</label>
        <input type="url" class="cf-input" id="port-url-${i}" placeholder="https://..." value="${saved}" style="margin-bottom:4px"/>
        <button class="btn-sm-yellow" onclick="updatePortImg(${i})">Update</button>
      </div>`;
  });
}

function updatePortImg(i) {
  const url = document.getElementById(`port-url-${i}`).value.trim();
  if (!url) return;
  const imgs = document.querySelectorAll('#portfolio-grid .port-card .port-img-wrap img');
  if (imgs[i]) imgs[i].src = url;
  setStore(`port_img_${i}`, url);
  flash(`port-url-${i}`);
}

/* --- Testimonial admin fields --- */
const testiPeople = [
  { id: 'testi1', label: 'Oliver K.' },
  { id: 'testi2', label: 'Janny M.' },
  { id: 'testi3', label: 'Luna A.' },
  { id: 'testi4', label: 'Marko D.' },
];

function buildTestiAdmin() {
  const wrap = document.getElementById('testi-admin-items');
  wrap.innerHTML = '';
  testiPeople.forEach((t, i) => {
    const saved = getStore(`testi_img_${i}`) || '';
    wrap.innerHTML += `
      <div class="admin-field">
        <label>${t.label} — Photo URL</label>
        <input type="url" class="cf-input" id="testi-url-${i}" placeholder="https://..." value="${saved}" style="margin-bottom:4px"/>
        <button class="btn-sm-yellow" onclick="updateTestiImg(${i})">Update</button>
      </div>`;
  });
}

function updateTestiImg(i) {
  const url = document.getElementById(`testi-url-${i}`).value.trim();
  if (!url) return;
  const imgs = document.querySelectorAll('#testimonials-grid .testi-header img');
  if (imgs[i]) imgs[i].src = url;
  setStore(`testi_img_${i}`, url);
  flash(`testi-url-${i}`);
}

/* --- Stats admin --- */
const statLabels = ['Years Experience','Projects Done','CTF Flags','Trading Bots','Curiosity','Learning Mode'];

function buildStatsAdmin() {
  const wrap = document.getElementById('stats-admin');
  wrap.innerHTML = '';
  document.querySelectorAll('.stat-num').forEach((el, i) => {
    const saved = getStore(`stat_${i}`) || el.textContent;
    wrap.innerHTML += `
      <div class="admin-field" style="display:flex;gap:8px;align-items:center">
        <label style="width:160px;flex-shrink:0">${statLabels[i] || 'Stat ' + (i+1)}</label>
        <input type="text" class="cf-input" id="stat-val-${i}" value="${saved}" style="max-width:120px"/>
        <button class="btn-sm-yellow" onclick="updateStat(${i})">Set</button>
      </div>`;
  });
}

function updateStat(i) {
  const val = document.getElementById(`stat-val-${i}`).value.trim();
  const els = document.querySelectorAll('.stat-num');
  if (els[i]) els[i].textContent = val;
  setStore(`stat_${i}`, val);
}

/* --- Update hero image --- */
function updateImage(imgId, urlInputId) {
  const url = document.getElementById(urlInputId).value.trim();
  if (!url) return;
  document.querySelectorAll(`#${imgId}`).forEach(el => el.src = url);
  setStore('hero_img', url);
  flash(urlInputId);
}

/* --- Save all --- */
function saveAdminData() {
  portProjects.forEach((_, i) => {
    const val = document.getElementById(`port-url-${i}`)?.value?.trim();
    if (val) setStore(`port_img_${i}`, val);
  });
  testiPeople.forEach((_, i) => {
    const val = document.getElementById(`testi-url-${i}`)?.value?.trim();
    if (val) setStore(`testi_img_${i}`, val);
  });
  statLabels.forEach((_, i) => {
    const val = document.getElementById(`stat-val-${i}`)?.value?.trim();
    if (val) setStore(`stat_${i}`, val);
  });
  document.getElementById('adminSaved').textContent = '✓ All changes saved!';
  setTimeout(() => document.getElementById('adminSaved').textContent = '', 3000);
}

/* --- Load saved data on page load --- */
function loadAdminData() {
  // Hero image
  const heroImg = getStore('hero_img');
  if (heroImg) {
    document.querySelectorAll('#hero-img, #sidebar-avatar').forEach(el => el.src = heroImg);
  }
  // Portfolio images
  portProjects.forEach((_, i) => {
    const url = getStore(`port_img_${i}`);
    if (url) {
      const imgs = document.querySelectorAll('#portfolio-grid .port-card .port-img-wrap img');
      if (imgs[i]) imgs[i].src = url;
    }
  });
  // Testimonial images
  testiPeople.forEach((_, i) => {
    const url = getStore(`testi_img_${i}`);
    if (url) {
      const imgs = document.querySelectorAll('#testimonials-grid .testi-header img');
      if (imgs[i]) imgs[i].src = url;
    }
  });
  // Stats
  document.querySelectorAll('.stat-num').forEach((el, i) => {
    const val = getStore(`stat_${i}`);
    if (val) el.textContent = val;
  });
}

/* ======= LOCAL STORAGE HELPERS ======= */
function setStore(key, value) {
  try { localStorage.setItem(`mahdi_portfolio_${key}`, value); } catch(e) {}
}

function getStore(key) {
  try { return localStorage.getItem(`mahdi_portfolio_${key}`); } catch(e) { return null; }
}

/* ======= UI HELPERS ======= */
function flash(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.style.borderColor = '#F5C518';
  setTimeout(() => { el.style.borderColor = ''; }, 1200);
}

/* ======= CSS ANIMATION INJECT ======= */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
