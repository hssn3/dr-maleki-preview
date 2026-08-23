/* دکتر فریبرز ملکی — اسکریپت اصلی سایت */
document.addEventListener('DOMContentLoaded', () => {

  /* نوار پیشرفت اسکرول */
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* منوی موبایل */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.textContent = '☰';
    }));
  }

  /* شمارنده آمار */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = el => {
    const target = +el.dataset.count;
    const dur = 1800, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString('fa-IR');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target); cObs.unobserve(e.target); }
  }), { threshold: .6 });
  counters.forEach(c => cObs.observe(c));

  /* انیمیشن ورود بخش‌ها */
  const rObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); rObs.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

  /* آکاردئون سوالات متداول */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* اسلایدر قبل/بعد — سازگار با لمس موبایل (touch-action:pan-y روی خود عنصر) */
  document.querySelectorAll('.ba-wrap').forEach(wrap => {
    const set = clientX => {
      const r = wrap.getBoundingClientRect();
      let x = Math.min(Math.max(clientX - r.left, 24), r.width - 24);
      wrap.style.setProperty('--pos', x + 'px');
    };
    let dragging = false;
    const start = e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      try { wrap.setPointerCapture(e.pointerId); } catch (err) {}
      set(e.clientX);
    };
    const move = e => { if (dragging) set(e.clientX); };
    const end = () => { dragging = false; };
    wrap.addEventListener('pointerdown', start);
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', end);
    wrap.addEventListener('lostpointercapture', end);
  });

  /* ارسال فرم → واتس‌اپ مطب */
  document.querySelectorAll('form[data-wa]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const get = n => (form.querySelector('[name="' + n + '"]') || {}).value || '';
      const lines = [
        'درخواست نوبت از سایت دکتر ملکی:',
        '👤 نام: ' + get('name'),
        '📞 تماس: ' + get('phone'),
        '🏥 خدمت: ' + (get('service') || get('subject') || 'مشاوره جراحی بینی')
      ];
      const note = get('message') || get('desc');
      if (note) lines.push('📝 توضیح: ' + note);
      const url = 'https://wa.me/989100471009?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
      const msg = form.querySelector('.form-msg');
      if (msg) { msg.style.display = 'block'; }
      form.reset();
      setTimeout(() => { if (msg) msg.style.display = 'none'; }, 12000);
    });
  });

  /* کنترل پخش/توقف ویدیوی لندینگ */
  document.querySelectorAll('.video-toggle').forEach(btn => {
    const video = btn.parentElement.querySelector('video');
    if (!video) return;
    const setLabel = () => btn.textContent = video.paused ? '▶' : '❚❚';
    btn.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
    ['play', 'pause'].forEach(ev => video.addEventListener(ev, setLabel));
    setLabel();
    // در موبایل: پخش خودکار فقط در حالت بی‌صدا مجاز است؛ اگر شروع نشد، دکمه ▶ نشان بده
    const tryPlay = video.play();
    if (tryPlay && tryPlay.catch) tryPlay.catch(() => {});
    // کاربرانی که کاهش انیمیشن خواسته‌اند: ویدیو در حالت توقف نمایش داده شود
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
  });

  /* سال شمسی فوتر */
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());
  });
  /* کلید سه‌حالته تم: روشن / تیره / خودکار */
  const themeBtn = document.querySelector('.theme-toggle');
  const MODES = [
    { id: 'light', icon: '☀️', label: 'روشن' },
    { id: 'dark',  icon: '🌙', label: 'تیره' },
    { id: 'auto',  icon: '🌓', label: 'خودکار' }
  ];
  const applyMode = mode => {
    const dark = mode === 'dark' || (mode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-mode', mode);
    try { localStorage.setItem('theme-mode', mode); } catch (e) {}
    if (themeBtn) {
      const m = MODES.find(x => x.id === mode);
      themeBtn.querySelector('.tt-ic').textContent = m.icon;
      const lb = themeBtn.querySelector('.tt-label');
      if (lb) lb.textContent = m.label;
      themeBtn.title = 'تم فعلی: ' + m.label + ' (کلیک برای تغییر)';
    }
  };
  if (themeBtn) {
    let mode = document.documentElement.getAttribute('data-mode') || 'auto';
    applyMode(mode);
    themeBtn.addEventListener('click', () => {
      mode = MODES[(MODES.findIndex(x => x.id === mode) + 1) % MODES.length].id;
      applyMode(mode);
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (mode === 'auto') applyMode('auto');
    });
  }
});
