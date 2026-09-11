(() => {
  const header = document.querySelector('.header');
  const progress = document.querySelector('.progress span');
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const year = document.getElementById('year');
  const motionBtn = document.querySelector('.motion-toggle');
  const body = document.body;
  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 32);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    mobileNav.hidden = open;
    body.style.overflow = open ? '' : 'hidden';
    if (!open) mobileNav?.querySelector('a')?.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') {
      mobileNav.hidden = true;
      menuBtn.setAttribute('aria-expanded','false');
      body.style.overflow = '';
      menuBtn.focus();
    }
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuBtn?.setAttribute('aria-expanded','false');
    body.style.overflow = '';
  }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', () => video.style.display = 'none');
  });

  motionBtn?.addEventListener('click', () => {
    const paused = body.classList.toggle('paused');
    motionBtn.setAttribute('aria-pressed', String(paused));
    const label = motionBtn.querySelector('.motion-label');
    if (label) label.textContent = paused ? 'Play motion' : 'Pause motion';
    document.querySelectorAll('video').forEach(v => paused ? v.pause() : v.play().catch(() => {}));
  });

  document.querySelector('.property-search')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('.valuation-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  });

  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = [...form.querySelectorAll('[required]')];
    const invalid = required.find(el => !String(el.value || '').trim());
    const email = form.querySelector('input[type=email]');
    const status = form.querySelector('.form-status');
    if (invalid) {
      invalid.focus();
      if (status) status.textContent = 'Please complete the required fields.';
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
      email.focus();
      if (status) status.textContent = 'Please enter a valid email address.';
      return;
    }
    if (status) status.textContent = 'Concept preview — this form is not collecting or sending data yet.';
  });
})();
