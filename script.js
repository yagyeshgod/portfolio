const sections = document.querySelectorAll('section');

function revealSections(){
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      section.classList.add('show');
    }
  });
}

window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', revealSections);

// Particles background (vanilla, lightweight)
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('bg-particles');
  if (!canvas || prefersReduced) return; // Respect accessibility
  const ctx = canvas.getContext('2d');

  let w, h, particles, mouse;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const CONFIG = {
    count: 90,
    maxVelocity: 0.6,
    linkDistance: 120,
    linkOpacity: 0.12,
    size: [1, 2.2],
    colors: ['#66a6ff', '#a78bfa', '#38bdf8', '#60a5fa']
  };

  function resize() {
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles() {
    const count = Math.floor(CONFIG.count * (w * h) / (1440 * 900)); // scale with viewport
    particles = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-CONFIG.maxVelocity, CONFIG.maxVelocity),
      vy: rand(-CONFIG.maxVelocity, CONFIG.maxVelocity),
      r: rand(CONFIG.size[0], CONFIG.size[1]),
      c: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)]
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    // Draw links
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // motion
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // mouse light attraction
      if (mouse) {
        const dx = p.x - mouse.x; const dy = p.y - mouse.y;
        const dist2 = dx*dx + dy*dy;
        if (dist2 < 160*160) {
          p.vx += dx * -0.00002; // slight attraction to mouse
          p.vy += dy * -0.00002;
        }
      }
    }

    // Links and dots
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      // draw node
      ctx.beginPath();
      ctx.fillStyle = p1.c;
      ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x; const dy = p1.y - p2.y;
        const d2 = dx*dx + dy*dy;
        const maxD2 = CONFIG.linkDistance * CONFIG.linkDistance;
        if (d2 < maxD2) {
          const alpha = CONFIG.linkOpacity * (1 - d2 / maxD2);
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }

  function handleMouse(e) {
    mouse = { x: e.clientX, y: e.clientY };
  }
  function clearMouse() { mouse = null; }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', handleMouse);
  window.addEventListener('mouseout', clearMouse);

  resize();
  initParticles();
  step();
})();

// Typed roles in header
(() => {
  const el = document.getElementById('typed-role');
  if (!el) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roles = [
    { text: 'UI/UX Designer', cls: 'role-uiux' },
    { text: 'Figma Expert', cls: 'role-figma' }
  ];
  let i = 0, j = 0, deleting = false;
  const typeDelay = 85;
  const pauseDelay = 900;

  function setClass(cls){
    el.classList.remove('role-uiux','role-figma');
    if (cls) el.classList.add(cls);
  }

  function tick(){
    const { text, cls } = roles[i];
    setClass(cls);
    if (!deleting) {
      el.textContent = text.slice(0, j + 1);
      j++;
      if (j === text.length) {
        deleting = true;
        return setTimeout(tick, pauseDelay);
      }
    } else {
      el.textContent = text.slice(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i = (i + 1) % roles.length;
      }
    }
    setTimeout(tick, typeDelay);
  }

  if (prefersReduced) {
    el.textContent = roles[0].text;
    setClass(roles[0].cls);
    return;
  }
  tick();
})();
