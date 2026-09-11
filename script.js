(() => {
  const body = document.body;
  const header = document.querySelector('.header');
  const progress = document.querySelector('.progress span');
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const motionBtn = document.querySelector('.motion-toggle');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  menuBtn?.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
    body.style.overflow = isOpen ? '' : 'hidden';
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.hidden = true; menuBtn?.setAttribute('aria-expanded','false'); body.style.overflow='';
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') {
      mobileNav.hidden = true; menuBtn.setAttribute('aria-expanded','false'); body.style.overflow=''; menuBtn.focus();
    }
  });

  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
  }), {threshold:.1, rootMargin:'0px 0px -40px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  document.querySelectorAll('video').forEach(v => v.addEventListener('error', () => v.style.display='none'));
  motionBtn?.addEventListener('click', () => {
    const paused = body.classList.toggle('paused');
    motionBtn.setAttribute('aria-pressed', String(paused));
    const label = motionBtn.querySelector('.motion-label');
    if (label) label.textContent = paused ? 'Play motion' : 'Pause motion';
    document.querySelectorAll('video').forEach(v => paused ? v.pause() : v.play().catch(()=>{}));
  });

  const rail = document.querySelector('.review-rail');
  document.querySelector('.review-next')?.addEventListener('click',()=>rail?.scrollBy({left:480,behavior:'smooth'}));
  document.querySelector('.review-prev')?.addEventListener('click',()=>rail?.scrollBy({left:-480,behavior:'smooth'}));

  const contact = document.getElementById('contact');
  const interest = document.querySelector('.contact-form select[name="interest"]');
  const message = document.querySelector('.contact-form textarea[name="message"]');
  document.querySelector('.valuation-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const address = e.currentTarget.querySelector('[name="property-address"]')?.value?.trim();
    if (interest) interest.value='Home Valuation';
    if (message) message.value = address ? `I'd like a home valuation for: ${address}` : "I'd like a home valuation.";
    contact?.scrollIntoView({behavior:'smooth'});
  });

  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const required = [...form.querySelectorAll('[required]')];
    const invalid = required.find(el => !String(el.value||'').trim());
    const email = form.querySelector('input[type=email]');
    const status = form.querySelector('.form-status');
    if (invalid) { invalid.focus(); if(status) status.textContent='Please complete the required fields.'; return; }
    if (email && !/^\S+@\S+\.\S+$/.test(email.value)) { email.focus(); if(status) status.textContent='Please enter a valid email address.'; return; }
    const data = new FormData(form);
    const subject = encodeURIComponent(`JL+CoRE website inquiry — ${data.get('interest') || 'Real estate inquiry'}`);
    const bodyText = [`Name: ${data.get('first-name')||''} ${data.get('last-name')||''}`.trim(),`Email: ${data.get('email')||''}`,`Phone: ${data.get('phone')||''}`,`Interest: ${data.get('interest')||''}`,'',data.get('message')||''].join('\n');
    if(status) status.textContent='Opening your email app…';
    window.location.href=`mailto:hello@jlcore.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  });
})();
