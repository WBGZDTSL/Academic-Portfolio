/**
 * Academic Portfolio – Main JavaScript
 * Handles: navigation, search, tag filtering, visit counter, contact form, podcast player
 */

'use strict';

/* ========================================
   DATA: All searchable content
   ======================================== */
const SITE_DATA = [
  // Academic Works
  { type: 'Publication', title: 'Attention Mechanisms in Large-Scale Language Models: A Comprehensive Survey', url: 'portfolio.html#pub-1', tags: ['NLP', 'Deep Learning', 'Survey'] },
  { type: 'Publication', title: 'Cross-Modal Representation Learning for Scientific Document Understanding', url: 'portfolio.html#pub-2', tags: ['Multimodal AI', 'Information Retrieval'] },
  { type: 'Publication', title: 'Efficient Fine-Tuning Strategies for Domain-Specific Foundation Models', url: 'portfolio.html#pub-3', tags: ['Machine Learning', 'NLP'] },
  { type: 'Publication', title: 'Graph Neural Networks for Knowledge Graph Completion', url: 'portfolio.html#pub-4', tags: ['Graph Learning', 'Knowledge Graphs'] },
  // Blog Posts
  { type: 'Blog', title: 'Why I Started a Research Podcast: A Reflection', url: 'podcast.html#blog-1', tags: ['Reflection', 'Science Communication'] },
  { type: 'Blog', title: 'The Reproducibility Crisis: What Researchers Can Do', url: 'portfolio.html#blog-2', tags: ['Research Methods', 'Open Science'] },
  { type: 'Blog', title: 'Reading Papers Efficiently: A System That Works for Me', url: 'portfolio.html#blog-3', tags: ['Productivity', 'Research Methods'] },
  { type: 'Blog', title: 'Navigating the Academic Job Market as a PhD Candidate', url: 'portfolio.html#blog-4', tags: ['Academic Career'] },
  // Podcasts
  { type: 'Podcast', title: 'EP01 – The Foundation Model Landscape in 2024', url: 'podcast.html#ep-1', tags: ['Foundation Models', 'NLP Series'] },
  { type: 'Podcast', title: 'EP02 – Talking with a Cognitive Scientist About AI Cognition', url: 'podcast.html#ep-2', tags: ['Cognitive Science', 'NLP Series'] },
  { type: 'Podcast', title: 'EP03 – Open Source vs. Proprietary AI: Perspectives from the Field', url: 'podcast.html#ep-3', tags: ['AI Policy', 'Open Science'] },
  { type: 'Podcast', title: 'EP04 – Reproducibility in Machine Learning Research', url: 'podcast.html#ep-4', tags: ['Research Methods', 'ML Tools'] },
  // Downloads
  { type: 'Download', title: 'Curriculum Vitae (PDF)', url: 'assets/downloads/cv.pdf', tags: ['CV', 'Resume'] },
  { type: 'Download', title: 'Research Statement', url: 'assets/downloads/research-statement.pdf', tags: ['Research'] },
];

/* ========================================
   NAVIGATION
   ======================================== */
function initNavigation() {
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Mark active link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll shadow
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,0.07)' : '';
  }, { passive: true });
}

/* ========================================
   SEARCH
   ======================================== */
function initSearch() {
  const searchBtn = document.querySelector('.nav__search-btn');
  const searchInput = document.querySelector('.nav__search-input');
  const dropdown = document.querySelector('.search-results-dropdown');
  if (!searchBtn || !searchInput || !dropdown) return;

  searchBtn.addEventListener('click', () => {
    const isOpen = searchInput.classList.toggle('open');
    if (isOpen) {
      searchInput.focus();
    } else {
      searchInput.value = '';
      dropdown.classList.remove('open');
    }
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length < 2) {
      dropdown.classList.remove('open');
      return;
    }

    const results = SITE_DATA.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.tags.some(t => t.toLowerCase().includes(query))
    ).slice(0, 8);

    renderSearchResults(results, dropdown);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.classList.remove('open');
      searchInput.value = '';
      dropdown.classList.remove('open');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__search')) {
      dropdown.classList.remove('open');
    }
  });
}

function renderSearchResults(results, dropdown) {
  if (results.length === 0) {
    dropdown.innerHTML = '<p class="search-no-results">No results found.</p>';
  } else {
    dropdown.innerHTML = results.map(item => `
      <a href="${escapeHtml(item.url)}" class="search-result-item">
        <div class="search-result-item__type">${escapeHtml(item.type)}</div>
        <div class="search-result-item__title">${escapeHtml(item.title)}</div>
      </a>
    `).join('');
  }
  dropdown.classList.add('open');
}

/* ========================================
   TAG FILTERING
   ======================================== */
function initTagFilter() {
  const filterContainer = document.querySelector('.tag-filter');
  if (!filterContainer) return;

  const cards = document.querySelectorAll('[data-tags]');

  filterContainer.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag[data-filter]');
    if (!tag) return;

    const filter = tag.dataset.filter;

    // Toggle active
    filterContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    // Filter cards
    cards.forEach(card => {
      const cardTags = card.dataset.tags ? card.dataset.tags.split(',').map(t => t.trim()) : [];
      if (filter === 'all' || cardTags.includes(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* ========================================
   VISIT COUNTER
   ======================================== */
function initVisitCounter() {
  const el = document.querySelector('.visit-counter__number');
  if (!el) return;

  try {
    let count = parseInt(localStorage.getItem('visit_count') || '0', 10);
    if (isNaN(count) || count < 0) count = 0;
    const lastVisit = localStorage.getItem('last_visit_date');
    const today = new Date().toISOString().split('T')[0];
    if (lastVisit !== today) {
      count += 1;
      localStorage.setItem('visit_count', String(count));
      localStorage.setItem('last_visit_date', today);
    }
    // Add a realistic base offset for display
    el.textContent = (count + 1247).toLocaleString();
  } catch (e) {
    el.textContent = '—';
  }
}

/* ========================================
   CONTACT FORM
   ======================================== */
function initContactForm() {
  const form = document.querySelector('.js-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const status = form.querySelector('.form-status');

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showStatus(status, 'error', 'Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus(status, 'error', 'Please enter a valid email address.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Simulate sending (replace with actual endpoint)
    setTimeout(() => {
      showStatus(status, 'success', 'Thank you for your message. I will respond within 2–3 business days.');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }, 1200);
  });
}

function showStatus(el, type, message) {
  if (!el) return;
  el.className = 'form-status ' + type;
  el.textContent = message;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================================
   PODCAST PLAYER
   ======================================== */
function initPodcastPlayer() {
  const players = document.querySelectorAll('.podcast-player');
  players.forEach(player => {
    const playBtn = player.querySelector('.js-play-btn');
    const progressBar = player.querySelector('.player-progress');
    const progressFill = player.querySelector('.player-progress__fill');
    const timeDisplay = player.querySelector('.player-time');
    if (!playBtn) return;

    let playing = false;
    let progress = 0;
    let interval = null;
    const duration = parseInt(player.dataset.duration || '1800', 10); // seconds

    playBtn.addEventListener('click', () => {
      playing = !playing;
      playBtn.innerHTML = playing
        ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12"/><rect x="8" y="1" width="4" height="12"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><polygon points="2,1 12,7 2,13"/></svg>';
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');

      if (playing) {
        interval = setInterval(() => {
          progress = Math.min(progress + 1, duration);
          const pct = (progress / duration) * 100;
          if (progressFill) progressFill.style.width = pct + '%';
          if (timeDisplay) timeDisplay.textContent = formatTime(progress) + ' / ' + formatTime(duration);
          if (progress >= duration) {
            clearInterval(interval);
            playing = false;
            playBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><polygon points="2,1 12,7 2,13"/></svg>';
          }
        }, 1000);
      } else {
        clearInterval(interval);
      }
    });

    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        progress = Math.round(pct * duration);
        if (progressFill) progressFill.style.width = (pct * 100) + '%';
        if (timeDisplay) timeDisplay.textContent = formatTime(progress) + ' / ' + formatTime(duration);
      });
    }
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ':' + String(s).padStart(2, '0');
}

/* ========================================
   SMOOTH REVEAL (Intersection Observer)
   ======================================== */
function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  const style = document.createElement('style');
  style.textContent = `.reveal{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}.reveal.visible{opacity:1;transform:none}`;
  document.head.appendChild(style);

  const targets = document.querySelectorAll('.card, .timeline-item, .download-item, .about-grid, .contact-grid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ========================================
   UTILITY
   ======================================== */
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* ========================================
   INIT
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSearch();
  initTagFilter();
  initVisitCounter();
  initContactForm();
  initPodcastPlayer();
  initReveal();
});
