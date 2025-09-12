/* Theme Effects: scroll progress, parallax hero, advanced reveal, theme toggle attach */
(function(){
  const d = document;
  const win = window;

  function throttle(fn, limit){
    let inThrottle; let lastArgs; let lastThis;
    return function(){
      lastArgs = arguments; lastThis = this;
      if(!inThrottle){
        fn.apply(lastThis,lastArgs);
        inThrottle = true;
        setTimeout(()=>{ inThrottle=false; if(lastArgs!==arguments){ fn.apply(lastThis,lastArgs);} }, limit);
      }
    };
  }

  // Scroll progress bar
  const progress = d.createElement('div');
  progress.id = 'scroll-progress';
  d.body.appendChild(progress);
  function setProgress(){
    const st = win.scrollY || d.documentElement.scrollTop;
    const h = d.documentElement.scrollHeight - win.innerHeight;
    const p = h>0 ? (st / h) * 100 : 0;
    progress.style.width = p + '%';
  }
  win.addEventListener('scroll', throttle(setProgress, 50), {passive:true});
  setProgress();

  // Enhanced reveal (observes .reveal elements)
  const revealEls = [].slice.call(d.querySelectorAll('.reveal'));
  if('IntersectionObserver' in win){
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => ro.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Parallax effect for hero accent layer
  const heroLayer = d.querySelector('.hero-parallax-layer');
  if(heroLayer){
    win.addEventListener('mousemove', throttle(e => {
      const x = (e.clientX / win.innerWidth - 0.5) * 12;
      const y = (e.clientY / win.innerHeight - 0.5) * 12;
      heroLayer.style.transform = `translate(${x}px, ${y}px)`;
    }, 40));
  }

  // Auto apply neo theme once user toggles dark mode (if dark => add neo)
  function syncNeo(){
    const dark = d.body.classList.contains('dark-mode');
    if(dark) d.body.classList.add('neo-theme'); else d.body.classList.remove('neo-theme');
  }
  syncNeo();
  const darkBtn = d.getElementById('darkModeToggle');
  if(darkBtn){ darkBtn.addEventListener('click', () => setTimeout(syncNeo, 30)); }

})();
