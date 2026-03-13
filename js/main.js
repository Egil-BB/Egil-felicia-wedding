/* =============================================
   EGIL & FELICIA – Wedding Website JS
   ============================================= */

'use strict';

/* ── COUNTDOWN ─────────────────────────────── */
(function initCountdown() {
  // Wedding: 4 October 2026 at 13:00 Swedish time (UTC+2 in summer, UTC+1 in winter – Oct is CET = UTC+1)
  const WEDDING_DATE = new Date('2026-10-04T13:00:00+01:00');

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
      elDays.textContent    = '00';
      elHours.textContent   = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      // Replace countdown section with a celebratory message
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

  // Scroll: add class when past hero
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
          !nav.contains(e.target)) {
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
  // Add reveal class to elements that should animate in
  const selectors = [
    '.section-header',
    '.timeline-item',
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
    // Fallback: show everything immediately
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children of the same parent
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

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

    // Close all others
    accordion.querySelectorAll('.accordion-trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      const c = t.closest('.accordion-item').querySelector('.accordion-content');
      c.classList.remove('open');
    });

    // Toggle clicked
    if (!isOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      content.classList.add('open');
      // Smooth scroll to item if partly off screen
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
  const form         = document.getElementById('rsvp-form');
  const successYes   = document.getElementById('rsvp-success');
  const successNo    = document.getElementById('rsvp-declined');
  const submitBtn    = document.getElementById('rsvp-submit');
  const plusoneGroup = document.getElementById('plusone-group');
  const plusoneNameGroup = document.getElementById('plusone-name-group');

  if (!form) return;

  // Show/hide plusone name field
  function onPlusoneChange() {
    const val = form.querySelector('input[name="plusone"]:checked')?.value;
    if (plusoneNameGroup) {
      plusoneNameGroup.style.display = val === 'yes' ? 'flex' : 'none';
    }
  }

  form.querySelectorAll('input[name="plusone"]').forEach(radio => {
    radio.addEventListener('change', onPlusoneChange);
  });

  // Hide plusone section if "not attending"
  form.querySelectorAll('input[name="attending"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const val = form.querySelector('input[name="attending"]:checked')?.value;
      if (plusoneGroup) {
        plusoneGroup.style.display = val === 'yes' ? 'flex' : 'none';
      }
      if (val !== 'yes' && plusoneNameGroup) {
        plusoneNameGroup.style.display = 'none';
      }
    });
  });

  // Validation helpers
  function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId) || form.querySelector(`[name="${inputId}"]`);
    const error = document.getElementById(errorId);
    if (input)  input.classList.toggle('error', !!message);
    if (error)  error.textContent = message || '';
    return !!message;
  }

  function validate() {
    let hasError = false;

    const name = document.getElementById('name')?.value.trim();
    if (!name) {
      hasError = setError('name', 'name-error', 'Ange ditt namn.') || hasError;
    } else {
      setError('name', 'name-error', '');
    }

    const attending = form.querySelector('input[name="attending"]:checked');
    if (!attending) {
      const err = document.getElementById('attending-error');
      if (err) err.textContent = 'Välj ett alternativ.';
      hasError = true;
    } else {
      const err = document.getElementById('attending-error');
      if (err) err.textContent = '';
    }

    return !hasError;
  }

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const attending = form.querySelector('input[name="attending"]:checked')?.value;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Skickar…';

    // --- In a real deployment, POST to a form service like Formspree, Netlify Forms, etc.
    // For now we simulate a brief network delay and show success.
    await new Promise(r => setTimeout(r, 800));

    form.style.display = 'none';

    if (attending === 'yes') {
      successYes.style.display = 'block';
    } else {
      successNo.style.display = 'block';
    }

    // Scroll to success message
    (attending === 'yes' ? successYes : successNo)
      .scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();


/* ── SMOOTH SCROLL POLYFILL (Safari < 15.4) ─── */
(function smoothScrollFallback() {
  if ('scrollBehavior' in document.documentElement.style) return;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
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
          const active = link.getAttribute('href') === `#${id}`;
          link.style.color = active ? 'var(--color-gold-light)' : '';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();
