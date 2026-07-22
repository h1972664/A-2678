/* ════════════════════════════════════════════════════════
   Creative Studio · main.js
   ════════════════════════════════════════════════════════ */

/* ── Hero reel videos (all uploaded videos, shuffled on load) ── */
const heroReelVideos = [
  'videos/tvc/冰红茶.mp4', 'videos/tvc/印章.mp4', 'videos/tvc/复古苏联怀表广告.mp4',
  'videos/tvc/美妆广告.mp4', 'videos/tvc/英文陶瓷碗广告.mp4', 'videos/tvc/豆浆机广告.mp4',
  'videos/tvc/酒杯.mp4', 'videos/tvc/铠甲.mp4', 'videos/tvc/香水广告.mp4',
  'videos/tvc/香水广告1.mp4', 'videos/tvc/香炉横屏.mp4', 'videos/tvc/鼠标广告.mp4',
  'videos/数字人/jimeng-2026-07-16-5805.mp4',
  'videos/漫剧/九域妖灵录-1.mp4', 'videos/漫剧/九域妖灵录-2.mp4',
  'videos/漫剧/九域妖灵录-3.mp4', 'videos/漫剧/九域妖灵录-4.mp4', 'videos/漫剧/九域妖灵录-第五章.mp4'
];

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

  // start hero reel ASAP (don't wait for the loader animation to finish)
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    initHeroReel();
    initScrollReveal();
    initStatCounters();
    initSkillBars();
    initOverviewSliders();
  }

  let i = 0;
  function step() {
    if (i >= steps.length) {
      setTimeout(() => {
        loader.classList.add('hidden');
        startHero();
      }, 200);
      return;
    }
    const { pct, msg } = steps[i++];
    bar.style.width = pct + '%';
    text.textContent = msg;
    setTimeout(step, i === 1 ? 160 : 220);
  }

  // start after a tiny delay so the browser has painted
  setTimeout(step, 100);

  // safety net: kick off the hero reel early so the carousel is ready
  // even before the loader visually finishes (poster shows instantly)
  setTimeout(startHero, 600);
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
   HERO REEL (shuffled video carousel)
   ═══════════════════════════════════════════════════════ */
function initHeroReel() {
  const reel = document.getElementById('heroReel');
  const dotsWrap = document.getElementById('reelDots');
  if (!reel || !dotsWrap) return;

  // build the two video layers (cross-fade between them)
  const backLayer = document.createElement('div');
  const frontLayer = document.createElement('div');
  backLayer.className = 'reel-layer reel-empty';
  frontLayer.className = 'reel-layer reel-empty';
  reel.innerHTML = '';
  reel.appendChild(backLayer);
  reel.appendChild(frontLayer);

  const playlist = shuffleArray(heroReelVideos);
  const count = playlist.length;
  let current = 0;
  let activeFront = true; // frontLayer is currently visible
  let timer = null;

  // derive poster path from a video src: videos/tvc/x.mp4 -> videos/posters/tvc/x.jpg
  function posterFor(src) {
    if (src.indexOf('videos/漫剧/') === 0) return '第三集最后一版-封面.jpg';
    return src.replace('videos/', 'videos/posters/').replace(/\.mp4$/i, '.jpg');
  }

  function createVideo(src, eager) {
    const video = document.createElement('video');
    const poster = posterFor(src);
    video.src = src;
    video.poster = poster;                 // 秒显封面静帧，视频缓冲期不再黑屏
    video.muted = true;
    video.loop = false;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    // 首个视频急加载，尽快开始播放；后续视频只取元数据省带宽
    video.setAttribute('preload', eager ? 'auto' : 'metadata');
    if (eager) video.setAttribute('fetchpriority', 'high');
    return video;
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.reel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function loadLayer(layer, src, eager) {
    layer.innerHTML = '';
    layer.classList.remove('reel-empty');
    // 图层背景先铺封面图，视频还没解码出画面时也不会黑屏
    layer.style.backgroundImage = `url("${posterFor(src)}")`;
    layer.style.backgroundSize = 'cover';
    layer.style.backgroundPosition = 'center';
    const video = createVideo(src, eager);
    layer.appendChild(video);
    video.play().catch(() => {});
  }

  function goToSlide(idx) {
    current = (idx + count) % count;
    const target = activeFront ? backLayer : frontLayer;
    const currentVisible = activeFront ? frontLayer : backLayer;

    loadLayer(target, playlist[current]);
    target.classList.add('active');
    currentVisible.classList.remove('active');
    activeFront = !activeFront;
    updateDots();

    clearTimeout(timer);
    timer = setTimeout(() => goToSlide(current + 1), 8000);
  }

  // build dots
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'reel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }

  // initial load: fill the visible layer with the first video (eager = fast start)
  loadLayer(frontLayer, playlist[0], true);
  frontLayer.classList.add('active');
  timer = setTimeout(() => goToSlide(1), 8000);

  // pause auto-advance while user is hovering the hero (keep playback running)
  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', () => clearTimeout(timer));
  hero.addEventListener('mouseleave', () => {
    clearTimeout(timer);
    timer = setTimeout(() => goToSlide(current + 1), 8000);
  });

  // respect visibility: pause hidden videos to save bandwidth
  document.addEventListener('visibilitychange', () => {
    reel.querySelectorAll('video').forEach(v => {
      v[document.hidden ? 'pause' : 'play']().catch(() => {});
    });
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
    const src = card.dataset.src;
    showVideoModal(title, src);
  });
});

function showVideoModal(title, src) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:2000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;padding:24px;';
  modal.innerHTML = `
    <div style="max-width:960px;width:100%;position:relative;">
      <button onclick="this.closest('[style]').remove()" style="position:absolute;top:-42px;right:0;background:none;border:none;color:#fff;font-size:30px;cursor:pointer;line-height:1;">×</button>
      <p style="font-size:11px;letter-spacing:3px;color:#c9a96e;margin-bottom:10px;font-weight:300;">NOW PLAYING</p>
      <video src="${src}" controls autoplay playsinline style="width:100%;border-radius:6px;background:#000;max-height:80vh;display:block;"></video>
      <p style="font-size:16px;color:#fff;font-weight:400;margin-top:14px;text-align:center;">${title}</p>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

/* ═══════════════════════════════════════════════════════
   IMAGE LIGHTBOX (zoom · wheel / buttons) — global
   ═══════════════════════════════════════════════════════ */
function openLightbox(src, caption) {
  if (!src) return;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-toolbar">
      <button class="lb-btn lb-zoom-out" type="button" aria-label="缩小" title="缩小">&minus;</button>
      <span class="lb-zoom-level">100%</span>
      <button class="lb-btn lb-zoom-in" type="button" aria-label="放大" title="放大">+</button>
      <button class="lb-btn lightbox-close" type="button" aria-label="关闭" title="关闭">&times;</button>
    </div>
    <div class="lightbox-stage">
      <img src="${src}" alt="${(caption || '').replace(/"/g, '&quot;')}" draggable="false">
    </div>`;

  const img   = lb.querySelector('.lightbox-stage img');
  const level = lb.querySelector('.lb-zoom-level');
  let scale = 1, tx = 0, ty = 0;

  function apply() {
    scale = Math.min(Math.max(scale, 0.5), 6);
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    level.textContent = Math.round(scale * 100) + '%';
  }
  function zoomBy(f) { scale *= f; if (scale <= 1) { tx = 0; ty = 0; } apply(); }

  lb.querySelector('.lb-zoom-in').addEventListener('click', e => { e.stopPropagation(); zoomBy(1.2); });
  lb.querySelector('.lb-zoom-out').addEventListener('click', e => { e.stopPropagation(); zoomBy(1 / 1.2); });

  lb.addEventListener('wheel', e => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  let dragging = false, sx = 0, sy = 0, stx = 0, sty = 0;
  function onMove(e) {
    if (!dragging) return;
    tx = stx + (e.clientX - sx);
    ty = sty + (e.clientY - sy);
    apply();
  }
  function onUp() { if (dragging) { dragging = false; img.classList.remove('grabbing'); } }
  img.addEventListener('mousedown', e => {
    if (scale <= 1) return;
    dragging = true; sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
    img.classList.add('grabbing'); e.preventDefault();
  });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  let pinchStart = 0, baseScale = 1;
  lb.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      pinchStart = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      baseScale = scale;
    }
  }, { passive: false });
  lb.addEventListener('touchmove', e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (pinchStart) { scale = baseScale * (d / pinchStart); tx = 0; ty = 0; apply(); }
    }
  }, { passive: false });

  const close = () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    lb.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = e => {
    if (e.key === 'Escape') close();
    else if (e.key === '+' || e.key === '=') zoomBy(1.2);
    else if (e.key === '-' || e.key === '_') zoomBy(1 / 1.2);
    else if (e.key === '0') { scale = 1; tx = 0; ty = 0; apply(); }
  };
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox-stage')) close();
  });
  lb.querySelector('.lightbox-close').addEventListener('click', e => { e.stopPropagation(); close(); });
  img.addEventListener('dblclick', e => { e.stopPropagation(); scale = 1; tx = 0; ty = 0; apply(); });
  document.addEventListener('keydown', onKey);

  document.body.appendChild(lb);
}

/* ═══════════════════════════════════════════════════════
   DESIGN SECTION LIGHTBOX HOOKS
   ═══════════════════════════════════════════════════════ */
(function initDesignLightbox() {
  const section = document.getElementById('design-section');
  if (!section) return;

  // real <img> inside design cards
  section.querySelectorAll('.design-img img').forEach(img => {
    img.addEventListener('click', () => {
      const cat = img.closest('.design-card')?.querySelector('.design-cat')?.textContent || '';
      openLightbox(img.src, cat);
    });
  });

  // background-image detail strips (详情页)
  section.querySelectorAll('.detail-strip').forEach(strip => {
    const bg = getComputedStyle(strip).backgroundImage;
    const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (!m) return;
    strip.addEventListener('click', () => openLightbox(m[1], ''));
  });

  // IP 形象真实图片
  section.querySelectorAll('.ip-display img').forEach(img => {
    img.addEventListener('click', () => {
      const cat = img.closest('.ip-card')?.querySelector('.ip-info h3')?.textContent || 'IP形象';
      openLightbox(img.src, cat);
    });
  });

  // Logo 真实图片
  section.querySelectorAll('.logo-display img').forEach(img => {
    img.addEventListener('click', () => {
      const cat = img.closest('.logo-card')?.querySelector('p')?.textContent || 'Logo';
      openLightbox(img.src, cat);
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   OVERVIEW SLIDERS (首页总览 · 手动滑动 + 灯箱)
   ═══════════════════════════════════════════════════════ */
function initOverviewSliders() {
  document.querySelectorAll('.ov-slider').forEach(slider => {
    const track = slider.querySelector('.ov-track');
    const imgs  = track.querySelectorAll('img');
    const total = imgs.length;
    if (total === 0) return;

    const dotsWrap = slider.querySelector('.ov-dots');
    const btnPrev  = slider.querySelector('.ov-prev');
    const btnNext  = slider.querySelector('.ov-next');
    const cardCat  = slider.closest('.ov-card')?.querySelector('.ov-card-cat')?.textContent || '';
    let current = 0, autoTimer = null;
    const interval = 5000;

    if (total <= 1) {
      btnPrev.style.display = 'none';
      btnNext.style.display = 'none';
      dotsWrap.style.display = 'none';
    }

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'ov-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    }

    function updateUI() {
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.ov-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function goTo(idx) { current = (idx + total) % total; updateUI(); }
    function startAuto() { if (total <= 1) return; autoTimer = setInterval(() => goTo(current + 1), interval); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    btnPrev.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); resetAuto(); });
    btnNext.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); resetAuto(); });

    // 触摸滑动
    let touchX = 0;
    slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    }, { passive: true });

    // 点击图片放大（复用灯箱）
    imgs.forEach(img => img.addEventListener('click', () => openLightbox(img.src, cardCat)));

    startAuto();
    updateUI();
  });
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
