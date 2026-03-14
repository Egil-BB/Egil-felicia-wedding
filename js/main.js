/* =============================================
   EGIL & FELICIA – Wedding Website JS
   ============================================= */

'use strict';

/* ── PASSWORD GATE ──────────────────────────── */
(function initPasswordGate() {
  const CORRECT_PASSWORD = 'egilhjärtafelicia';
  const SESSION_KEY = 'ef_unlocked';

  const gate        = document.getElementById('password-gate');
  const siteContent = document.getElementById('site-content');
  const form        = document.getElementById('password-form');
  const input       = document.getElementById('password-input');
  const errorEl     = document.getElementById('password-error');

  function unlock() {
    gate.classList.add('hidden');
    siteContent.style.display = '';
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  // Already unlocked this session?
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    unlock();
    return;
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim().toLowerCase();
    if (val === CORRECT_PASSWORD) {
      errorEl.textContent = '';
      input.classList.remove('error');
      unlock();
    } else {
      errorEl.textContent = 'Fel lösenord – försök igen.';
      input.classList.add('error');
      input.select();
    }
  });
})();


/* ── COUNTDOWN ─────────────────────────────── */
(function initCountdown() {
  // Wedding: 3 October 2026 at 14:00 Swedish time (CET = UTC+1 in October)
  const WEDDING_DATE = new Date('2026-10-03T14:00:00+01:00');

  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      const countdown = document.getElementById('countdown');
      if (countdown) {
        countdown.innerHTML = '<div class="countdown-married">🎉 Det är bröllopsdag! 🎉</div>';
      }
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const s = totalSec % 60;
    const m = Math.floor(totalSec / 60) % 60;
    const h = Math.floor(totalSec / 3600) % 24;
    const d = Math.floor(totalSec / 86400);

    elDays.textContent    = d;
    elHours.textContent   = pad(h);
    elMinutes.textContent = pad(m);
    elSeconds.textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ── NAV SCROLL BEHAVIOUR ───────────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


/* ── SCROLL REVEAL ──────────────────────────── */
(function initScrollReveal() {
  const selectors = [
    '.section-header',
    '.timeline-day',
    '.card',
    '.travel-card',
    '.gift-option',
    '.contact-card',
    '.info-box',
    '.accordion',
    '.gifts-intro',
    '.map-placeholder',
  ];

  const elements = document.querySelectorAll(selectors.join(','));
  elements.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ── ACCORDION ──────────────────────────────── */
(function initAccordion() {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;

  accordion.addEventListener('click', (e) => {
    const trigger = e.target.closest('.accordion-trigger');
    if (!trigger) return;

    const item    = trigger.closest('.accordion-item');
    const content = item.querySelector('.accordion-content');
    const isOpen  = trigger.getAttribute('aria-expanded') === 'true';

    accordion.querySelectorAll('.accordion-trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      t.closest('.accordion-item').querySelector('.accordion-content').classList.remove('open');
    });

    if (!isOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      content.classList.add('open');
      setTimeout(() => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 350);
    }
  });
})();


/* ── RSVP FORM ──────────────────────────────── */
(function initRsvpForm() {
  // ── Klistra in din Google Apps Script Web App URL här ──
  const SCRIPT_URL = 'KLISTRA_IN_DIN_APPS_SCRIPT_URL_HÄR';
  // Se google-apps-script.js för installationsinstruktioner.

  const form               = document.getElementById('rsvp-form');
  const successYes         = document.getElementById('rsvp-success');
  const successNo          = document.getElementById('rsvp-declined');
  const submitBtn          = document.getElementById('rsvp-submit');
  const childrenGroup      = document.getElementById('children-group');
  const childrenNamesGroup = document.getElementById('children-names-group');
  const attendingFields    = document.getElementById('attending-fields');

  if (!form) return;

  // Visa/dölj barnnamn när antal > 0
  function onChildrenChange() {
    const val = form.querySelector('input[name="children_count"]:checked')?.value;
    if (childrenNamesGroup) {
      childrenNamesGroup.style.display = (val && val !== '0') ? 'flex' : 'none';
    }
  }

  form.querySelectorAll('input[name="children_count"]').forEach(r => {
    r.addEventListener('change', onChildrenChange);
  });

  // Visa/dölj fält beroende på om man kommer
  form.querySelectorAll('input[name="attending"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const val = form.querySelector('input[name="attending"]:checked')?.value;
      const coming = val === 'yes';
      if (childrenGroup)   childrenGroup.style.display   = coming ? 'flex' : 'none';
      if (attendingFields) attendingFields.style.display = coming ? 'flex' : 'none';
      if (!coming && childrenNamesGroup) childrenNamesGroup.style.display = 'none';
    });
  });

  function validate() {
    let ok = true;

    const nameInput = document.getElementById('name');
    const nameErr   = document.getElementById('name-error');
    if (!nameInput?.value.trim()) {
      if (nameErr) nameErr.textContent = 'Ange ditt namn.';
      nameInput?.classList.add('error');
      ok = false;
    } else {
      if (nameErr) nameErr.textContent = '';
      nameInput?.classList.remove('error');
    }

    const attending = form.querySelector('input[name="attending"]:checked');
    const attErr    = document.getElementById('attending-error');
    if (!attending) {
      if (attErr) attErr.textContent = 'Välj ett alternativ.';
      ok = false;
    } else {
      if (attErr) attErr.textContent = '';
    }

    return ok;
  }

  function collectData() {
    const data = {};
    for (const [k, v] of new FormData(form).entries()) {
      data[k] = v;
    }
    return data;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const attending = form.querySelector('input[name="attending"]:checked')?.value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Skickar…';

    // Skicka till Google Sheets via Apps Script
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // krävs för Apps Script – svaret kan inte läsas men datan sparas
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(collectData()).toString()
      });
    } catch (err) {
      // Tyst fel – Apps Script tar emot datan oavsett (no-cors ger ingen felkod)
      console.warn('RSVP fetch:', err);
    }

    form.style.display = 'none';
    const msg = attending === 'yes' ? successYes : successNo;
    if (msg) {
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();


/* ── SMOOTH SCROLL POLYFILL (Safari < 15.4) ─── */
(function smoothScrollFallback() {
  if ('scrollBehavior' in document.documentElement.style) return;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.getElementById(this.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();


/* ── ACTIVE NAV LINK ON SCROLL ──────────────── */
(function activeNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--color-gold-light)' : '';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();
