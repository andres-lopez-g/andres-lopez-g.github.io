/* interactive.js – animated counters + project filter */
(function () {
  'use strict';

  /* ── Animated stat counters ── */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    var start = 0;
    var duration = 1200;
    var step = 16;
    var increment = target / (duration / step);
    var timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        el.textContent = target + '+';
      } else {
        el.textContent = Math.floor(start);
      }
    }, step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCounter(e.target);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { obs.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ── Project filter ── */
  function initFilter() {
    var btns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.fproj[data-tags]');
    if (!btns.length || !cards.length) return;

    /* visually-hidden live region for screen reader announcements */
    var announcer = document.createElement('span');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter') || 'all';
        var filterLower = filter.toLowerCase();

        /* update button state */
        btns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        /* show / hide cards */
        var visible = 0;
        cards.forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(',');
          var show = filter === 'all' || tags.some(function (t) {
            var tLower = t.trim().toLowerCase();
            return tLower.includes(filterLower) || filterLower.includes(tLower);
          });
          if (show) {
            card.classList.remove('hidden');
            visible++;
          } else {
            card.classList.add('hidden');
          }
        });

        /* announce result count to screen readers */
        announcer.textContent = visible + ' proyecto' + (visible !== 1 ? 's' : '') + ' mostrado' + (visible !== 1 ? 's' : '');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCounters();
    initFilter();
  });
})();
