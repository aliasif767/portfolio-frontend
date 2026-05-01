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

/* =============================================
   12. PROJECT MODAL LOGIC
   ============================================= */
const PROJECT_DATA = {
  iars: {
    title: "IARS — Intelligent Agentic Recruitment System",
    images: [
      "demo-images/IARS-images/image-1.png",
      "demo-images/IARS-images/image-2.png",
      "demo-images/IARS-images/image-3.png",
      "demo-images/IARS-images/image-4.png",
      "demo-images/IARS-images/image-5.png"
    ],
    intro: "A state-of-the-art, fully automated AI recruitment pipeline designed to modernize the hiring process. By leveraging multi-agent AI systems, IARS acts as a 24/7 digital recruiter.",
    problem: "Traditional recruitment faces inefficiency, human bias, slow response times, and data fragmentation. HR teams spend hours manually screening CVs, leading to inconsistent evaluation and loss of top talent.",
    solution: "IARS provides an Agentic AI Solution that automates the entire recruitment lifecycle including autonomous monitoring, agentic parsing, intelligent ranking, and automated communication.",
    features: [
      "Real-time Email Watcher: Automatically detects and downloads CVs every 30 seconds.",
      "Resume Parser: Extracts structured data (skills, experience, education) from PDF/DOCX.",
      "JD Generator: Automatically creates professional job descriptions using AI.",
      "Candidate Scorer: Performs deep semantic analysis to match candidate profiles.",
      "Intelligent Decision Engine: Categorizes candidates into MATCH, MAYBE, or NO MATCH.",
      "Automated Outreach: Integrated SMTP/IMAP system for personalized feedback.",
      "Premium Dashboard: Real-time pipeline funnel visualization and activity feed."
    ],
    tech: {
      backend: ["FastAPI", "Python", "MongoDB", "asyncio"],
      frontend: ["HTML5", "Vanilla CSS3", "Vanilla JavaScript", "Chart.js"],
      integrations: ["IMAP/SMTP", "PDF/DOCX Parsing", "Docker"]
    }
  },
  desibots: {
    title: "Desibots Hub — Unified AI Microservices Ecosystem",
    images: [
      "demo-images/desibots-images/image-1.png",
      "demo-images/desibots-images/image-2.png",
      "demo-images/desibots-images/image-3.png",
      "demo-images/desibots-images/image-4.png",
      "demo-images/desibots-images/image-5.png"
    ],
    intro: "A next-generation SaaS platform designed to centralize specialized AI assistants into a single, cohesive ecosystem. Instead of managing fragmented AI tools, Desibots provides a unified dashboard and a single WhatsApp interface for expert AI agents.",
    problem: "Fragmented experience across multiple platforms, cost inefficiency of separate subscriptions, security risks from exposed endpoints, and lack of local context (e.g., Pakistani legal systems or local business workflows).",
    solution: "A secure, centralized 'Bot Proxy' architecture featuring a unified React portal, a custom WhatsApp routing engine, and specialized microservices optimized for specific tasks using RAG and localized data.",
    features: [
      "Authenticated Dashboard: Secure JWT-based login with a modern, glassmorphic UI.",
      "Secure Bot Proxy: AI services run on internal networks, accessible only through the authenticated main backend.",
      "LawyerBot (Legal RAG): Expert legal assistant providing accurate references to local laws.",
      "HisabBot (Finance & Audit): Intelligent accounting assistant for managing ledgers and financial reporting.",
      "PakOrderBot (E-commerce): Streamlined bot for order management and inventory tracking.",
      "WhatsApp Dispatcher: Custom routing engine to switch between AI agents within a single WhatsApp conversation.",
      "SaaS Infrastructure: Tiered access (Free/Pro) and 'Pay-as-you-go' token billing system."
    ],
    tech: {
      frontend: ["React.js (Vite)", "Vanilla CSS3", "State Management (Context API)"],
      backend: ["Node.js & Express", "MongoDB", "JWT Auth", "Docker Compose"],
      ai_layer: ["Python (FastAPI)", "Groq LPU (Low-latency Inference)", "LangChain", "Vector Databases"]
    }
  },
  proctorai: {
    title: "ProctorAI — Agentic Online Examination Monitoring System",
    images: [
      "demo-images/exam-monitoring-images/image-1.png",
      "demo-images/exam-monitoring-images/image-2.png",
      "demo-images/exam-monitoring-images/image-3.png",
      "demo-images/exam-monitoring-images/image-4.png",
      "demo-images/exam-monitoring-images/image-5.png",
      "demo-images/exam-monitoring-images/image-6.png"
    ],
    intro: "A state-of-the-art, agentic online examination monitoring system designed to preserve academic integrity. It integrates advanced computer vision, biometric authentication, and real-time behavioral analysis to provide a secure environment for remote assessments.",
    problem: "Scalability issues with manual proctoring, academic dishonesty (impersonation, unauthorized collaboration), inconsistent enforcement of rules, and prohibitive costs for human proctors.",
    solution: "A fully automated, intelligent proctoring agent featuring biometric gatekeeping, real-time automated surveillance, risk-based auditing with violation logs, and an active agentic workflow for session management.",
    features: [
      "Biometric Identity Verification: FaceNet via DeepFace for 1:1 matching with registered student profiles.",
      "Tab & Window Security: Detection of tab switching and loss of window focus during exams.",
      "Multi-Monitor Detection: Extended screen and resolution monitoring to flag secondary display cheating.",
      "Real-time Behavioral Monitoring: Gaze tracking, multi-face detection, and head pose estimation using OpenCV.",
      "Dynamic Risk Scoring: Real-time risk level calculation (Low to Critical) based on violation severity.",
      "WebSocket Event Streaming: Sub-second latency for instant violation response and session tracking.",
      "Automated Attendance: Digital attendance marking and secure MongoDB logging for all events."
    ],
    tech: {
      frontend: ["HTML5", "JavaScript (ES6+)", "Vanilla CSS3 (Glassmorphism)"],
      backend: ["FastAPI (Python)", "WebSockets", "Asynchronous Thread Pooling"],
      ai_cv: ["DeepFace", "FaceNet", "OpenCV", "MTCNN"],
      database: ["MongoDB", "Uvicorn (ASGI)"]
    }
  },
  doctor: {
    title: "Virtual AI Doctor",
    images: [],
    intro: "An agentic healthcare assistant that provides intelligent triage and medical guidance.",
    problem: "Limited access to immediate medical advice leads to delayed care or unnecessary ER visits for minor issues.",
    solution: "A multi-agent architecture combining symptom-graph traversal with LLM reasoning for safe medical triage and escalation.",
    features: [
      "Symptom Analysis: Deep dive into patient symptoms using reasoning chains.",
      "OTC Advice: Provide over-the-counter medication suggestions for minor cases.",
      "Critical Condition Detection: Automatically escalate life-threatening symptoms.",
      "Appointment Booking: Integrated scheduling with local clinics.",
      "Multilingual Support: Communicate in local languages."
    ],
    tech: {
      backend: ["LangChain", "LangGraph", "FastAPI"],
      frontend: ["JavaScript", "CSS3"],
      integrations: ["OpenAI API", "Twilio (for bookings)"]
    }
  }
};

(function () {
  const modal = document.getElementById('proj-modal');
  const body = document.getElementById('modal-body');
  const close = document.getElementById('modal-close');
  const cards = document.querySelectorAll('.proj.feat[data-project]');

  const gModal = document.getElementById('gallery-modal');
  const gBody  = document.getElementById('gallery-body');
  const gClose = document.getElementById('gallery-close');

  function openModal(id) {
    const data = PROJECT_DATA[id];
    if (!data) return;

    let techHtml = '';
    for (const [cat, tags] of Object.entries(data.tech)) {
      techHtml += `
        <div class="tech-cat">
          <h4>${cat}</h4>
          <div class="tech-tags">${tags.map(t => `<span>${t}</span>`).join('')}</div>
        </div>
      `;
    }

    body.innerHTML = `
      <div class="modal-header">
        <h2>${data.title}</h2>
        ${data.images && data.images.length > 0 ? `
          <button class="demo-btn" id="open-demo">
            <i class="fas fa-play-circle"></i> Project Demo
          </button>
        ` : ''}
      </div>
      <div class="modal-section">
        <h3><i class="fas fa-info-circle"></i> Introduction</h3>
        <p>${data.intro}</p>
      </div>
      <div class="modal-section">
        <h3><i class="fas fa-exclamation-triangle"></i> Problem Statement</h3>
        <p>${data.problem}</p>
      </div>
      <div class="modal-section">
        <h3><i class="fas fa-lightbulb"></i> Proposed Solution</h3>
        <p>${data.solution}</p>
      </div>
      <div class="modal-section">
        <h3><i class="fas fa-star"></i> Key Features</h3>
        <ul class="modal-list">
          ${data.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-section">
        <h3><i class="fas fa-code"></i> Technology Stack</h3>
        <div class="tech-grid">
          ${techHtml}
        </div>
      </div>
    `;

    const demoBtn = document.getElementById('open-demo');
    if (demoBtn) {
      demoBtn.onclick = () => openGallery(data.images);
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function openGallery(images) {
    if (!images || images.length === 0) return;
    gBody.innerHTML = `
      <div class="gallery-header">
        <h3><i class="fas fa-images"></i> Project Showcase</h3>
        <p>Scroll through the system screenshots and features.</p>
      </div>
      <div class="gallery-grid">
        ${images.map((img, idx) => `
          <div class="gallery-item">
            <img src="${img}" alt="Demo Image ${idx + 1}">
            <div class="gallery-info">Image ${idx + 1} of ${images.length}</div>
          </div>
        `).join('')}
      </div>
    `;
    gModal.classList.add('open');
  }

  function closeAll() {
    modal.classList.remove('open');
    gModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.ghbtn')) return;
      openModal(card.getAttribute('data-project'));
    });
  });

  close.onclick = closeAll;
  gClose.onclick = () => gModal.classList.remove('open');
  
  modal.onclick = (e) => { if (e.target === modal) closeAll(); };
  gModal.onclick = (e) => { if (e.target === gModal) gModal.classList.remove('open'); };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
})();
