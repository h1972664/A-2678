/* ════════════════════════════════════════════════════════
   Creative Studio · main.js
   ════════════════════════════════════════════════════════ */

/* ── Hero reel data ──────────────────────────────────── */
const reelSlides = [
  {
    gradient: 'linear-gradient(135deg, #0e0e0e 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)',
    label: 'TVC 广告片'
  },
  {
    gradient: 'linear-gradient(135deg, #1c1c1c 0%, #2d1b69 50%, #11998e 100%)',
    label: 'MV 音乐视频'
  },
  {
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #3d1c02 50%, #7b3f00 100%)',
    label: '品牌形象片'
  },
  {
    gradient: 'linear-gradient(135deg, #0e0e1a 0%, #1a0e2e 40%, #2d0c3a 70%, #1a0828 100%)',
    label: '漫剧系列'
  }
];

/* ═══════════════════════════════════════════════════════
   LOADER
   ═══════════════════════════════════════════════════════ */
(function initLoader() {
  const bar  = document.getElementById('loaderBar');
  const text = document.getElementById('loaderText');
  const loader = document.getElementById('loader');

  const steps = [
    { pct: 20, msg: 'Initializing assets…' },
    { pct: 45, msg: 'Loading gallery…' },
    { pct: 70, msg: 'Building interface…' },
    { pct: 90, msg: 'Almost there…' },
    { pct: 100, msg: 'Welcome ✦' }
  ];

  let i = 0;
  function step() {
    if (i >= steps.length) {
      setTimeout(() => {
        loader.classList.add('hidden');
        initHeroReel();
        initScrollReveal();
        initStatCounters();
        initSkillBars();
      }, 400);
      return;
    }
    const { pct, msg } = steps[i++];
    bar.style.width = pct + '%';
    text.textContent = msg;
    setTimeout(step, i === 1 ? 300 : 450);
  }

  // start after a tiny delay so the browser has painted
  setTimeout(step, 180);
})();

/* ═══════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ═══════════════════════════════════════════════════════
   HERO REEL
   ═══════════════════════════════════════════════════════ */
function initHeroReel() {
  const reel = document.getElementById('heroReel');
  const dotsWrap = document.getElementById('reelDots');

  // build slides
  reelSlides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'reel-slide' + (i === 0 ? ' active' : '');
    const bg = document.createElement('div');
    bg.className = 'reel-slide-bg';
    bg.style.background = s.gradient;
    slide.appendChild(bg);
    reel.appendChild(slide);

    // dot
    const dot = document.createElement('div');
    dot.className = 'reel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  let current = 0;
  const slides = reel.querySelectorAll('.reel-slide');
  const dots = dotsWrap.querySelectorAll('.reel-dot');

  function goToSlide(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  // auto-play
  let timer = setInterval(() => goToSlide(current + 1), 5000);

  // pause on hover
  reel.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  reel.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => goToSlide(current + 1), 5000);
  });
}

/* ═══════════════════════════════════════════════════════
   VIDEO TABS
   ═══════════════════════════════════════════════════════ */
(function initVideoTabs() {
  const tabBar = document.getElementById('videoTabs');
  tabBar.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabBar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + target).classList.add('active');
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   DESIGN TABS
   ═══════════════════════════════════════════════════════ */
(function initDesignTabs() {
  const tabBar = document.getElementById('designTabs');
  tabBar.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabBar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.dtab;
      document.querySelectorAll('.design-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('dpanel-' + target).classList.add('active');
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  // mark targets
  const targets = document.querySelectorAll(
    '.video-card, .design-card, .logo-card, .ip-card, .detail-card, .contact-card, .stat-item, .about-wrap, .section-header'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 60 + 'ms';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════════
   STAT COUNTERS
   ═══════════════════════════════════════════════════════ */
function initStatCounters() {
  const nums = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════════
   SKILL BARS
   ═══════════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const w = el.dataset.w;
      el.style.width = w + '%';
      io.unobserve(el);
    });
  }, { threshold: 0.4 });

  bars.forEach(b => io.observe(b));
}

/* ═══════════════════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════════════════ */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const success = document.getElementById('formSuccess');

  btn.textContent = '发送中…';
  btn.disabled = true;

  setTimeout(() => {
    btn.style.display = 'none';
    success.style.display = 'block';
    e.target.reset();
  }, 1200);
}

/* ═══════════════════════════════════════════════════════
   VIDEO CARD CLICK (placeholder demo)
   ═══════════════════════════════════════════════════════ */
document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3').textContent;
    showModal(title);
  });
});

function showModal(title) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:2000;
    display:flex;align-items:center;justify-content:center;
    animation:fadeIn 0.3s ease;
  `;
  modal.innerHTML = `
    <div style="background:#111;border-radius:8px;padding:48px;text-align:center;max-width:480px;width:90%;position:relative;">
      <button onclick="this.closest('[style]').remove()" style="position:absolute;top:16px;right:20px;background:none;border:none;color:#888;font-size:20px;cursor:pointer;">×</button>
      <div style="width:64px;height:64px;border:1px solid #c9a96e;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#c9a96e"><polygon points="5,3 19,12 5,21"/></svg>
      </div>
      <p style="font-size:12px;letter-spacing:3px;color:#c9a96e;margin-bottom:10px;font-weight:300;">NOW PLAYING</p>
      <p style="font-size:16px;color:#fff;font-weight:400;">${title}</p>
      <p style="font-size:12px;color:#555;margin-top:12px;">（请替换为真实视频链接）</p>
    </div>
  `;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

/* ═══════════════════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT
   ═══════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => io.observe(s));
})();
