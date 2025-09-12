document.addEventListener('DOMContentLoaded', () => {
  const candidates = document.querySelectorAll('.fproj, .t-item');
  if (!candidates.length) return;
  const reveal = el => {
    el.classList.add('in');
  };
  candidates.forEach(el => el.classList.add('pre-anim'));
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          reveal(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    candidates.forEach(el => obs.observe(el));
  } else {
    // Fallback: reveal all
    candidates.forEach(reveal);
  }
});
