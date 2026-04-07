/* =============================================
   ASIF ALI PORTFOLIO — script.js
   Clean, simple, no opacity:0 traps
   ============================================= */

/* 1. NEURAL CANVAS */
(function () {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes, raf;
  const N = 65, DIST = 150;

  function resize() {
    W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
    H = canvas.height = canvas.offsetHeight || window.innerHeight;
  }

  function mkNode() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1
    };
  }

  function col() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? '0,160,210' : '0,212,255';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const c = col();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${c},${(1 - d / DIST) * 0.45})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},0.85)`;
      ctx.shadowColor = `rgba(${c},0.5)`;
      ctx.shadowBlur  = 5;
      ctx.fill();
      ctx.shadowBlur  = 0;
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    raf = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    nodes = Array.from({ length: N }, mkNode);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  });

  init();
  draw();
})();


/* 2. TYPED TEXT */
(function () {
  const el = document.getElementById('typed');
  if (!el) return;
  const phrases = [
    'ML Engineers',
    'Agentic AI Systems',
    'RAG Pipelines',
    'Deep Learning Models',
    'AI that actually works'
  ];
  let pi = 0, ci = 0, del = false;

  function tick() {
    const p = phrases[pi];
    if (!del) {
      el.textContent = p.slice(0, ++ci);
      if (ci === p.length) { del = true; return setTimeout(tick, 1800); }
    } else {
      el.textContent = p.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 400); }
    }
    setTimeout(tick, del ? 38 : 75);
  }
  setTimeout(tick, 900);
})();


/* 3. SCROLL PROGRESS */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();


/* 4. NAVBAR */
(function () {
  const nav   = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const secs  = document.querySelectorAll('section[id]');

  function upd() {
    nav.classList.toggle('on', window.scrollY > 20);
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }
  window.addEventListener('scroll', upd, { passive: true });
  upd();
})();


/* 5. HAMBURGER */
(function () {
  const btn   = document.getElementById('burger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('x');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('x');
    links.classList.remove('open');
  }));
})();


/* 6. SCROLL ANIMATIONS (simple, no opacity:0 trap) */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .anim { transition: opacity 0.65s ease, transform 0.65s ease; }
    .anim.hidden { opacity: 0; transform: translateY(30px); }
    .anim.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  // Apply only to non-hero section children
  const targets = document.querySelectorAll(
    '.sec .card, .sec .sh, .sec .about-txt, .sec .about-side, ' +
    '.sec .tli, .sec .rcard, .sec .gcard, .sec .proj, ' +
    '.cinfo, .cform'
  );

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.replace('hidden', 'visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => {
    // Only animate if NOT already in viewport
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight) {
      el.classList.add('anim', 'hidden');
      io.observe(el);
    }
  });
})();


/* 7. DARK / LIGHT TOGGLE */
(function () {
  const btn  = document.getElementById('theme-btn');
  const icon = document.getElementById('theme-icon');
  if (!btn) return;
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', next);
  });
})();


/* 8. BACK TO TOP */
(function () {
  const btn = document.getElementById('totop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* 9. SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 68;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});


/* 10. CONTACT FORM */
(function () {
  const form = document.getElementById('cform');
  if (!form) return;
  const status = document.getElementById('fstatus');
  const sbtn   = document.getElementById('sbtn');

  function setStatus(msg, cls) {
    status.textContent = msg;
    status.className = 'fstatus ' + cls;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = (document.getElementById('fn').value || '').trim();
    const email   = (document.getElementById('fe').value || '').trim();
    const subject = (document.getElementById('fs').value || '').trim() || 'Portfolio Contact';
    const msg     = (document.getElementById('fm').value || '').trim();

    if (!name || !email || !msg) { setStatus('⚠️ Please fill in name, email and message.', 'err'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('⚠️ Enter a valid email address.', 'err'); return; }

    sbtn.disabled = true;
    sbtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    setStatus('✉️ Sending your message…', 'wait');

    try {
      const res = await fetch('http://localhost:5000/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message: msg })
      });
      if (res.ok) {
        setStatus('✅ Message sent! Asif will get back to you soon.', 'ok');
        form.reset();
      } else {
        throw new Error('server');
      }
    } catch {
      // Fallback to mailto
      const ml = `mailto:asifaali1917@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + msg)}`;
      window.location.href = ml;
      setStatus('📧 Opening your email client…', 'wait');
    } finally {
      sbtn.disabled = false;
      sbtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });
})();


/* 11. CURSOR GLOW (desktop only) */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const g = document.createElement('div');
  Object.assign(g.style, {
    position: 'fixed', width: '280px', height: '280px', borderRadius: '50%',
    pointerEvents: 'none', zIndex: '0', transform: 'translate(-50%,-50%)',
    background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
    transition: 'opacity 0.3s'
  });
  document.body.appendChild(g);
  window.addEventListener('mousemove', e => {
    g.style.left = e.clientX + 'px';
    g.style.top  = e.clientY + 'px';
  }, { passive: true });
})();