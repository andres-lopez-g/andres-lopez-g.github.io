// Micro interacciones: tilt 3D + ripple
(function(){
  const MAX = 6; // degrees
  const els = document.querySelectorAll('[data-tilt]');
  els.forEach(card => {
    let leaveTO;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (y - .5) * -MAX;
      const ry = (x - .5) * MAX;
      card.classList.add('tilting');
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      clearTimeout(leaveTO);
      leaveTO = setTimeout(()=>{
        card.style.transform='';
        card.classList.remove('tilting');
      },120);
    });
  });

  // Ripple effect for buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn, .btn-neo');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - rect.left - size/2) + 'px';
    span.style.top  = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(span);
    setTimeout(()=> span.remove(), 650);
  }, {passive:true});
})();
