// main.js - 优化版本
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const speechBtn = document.getElementById('speechToggle');
  const loader = document.getElementById('loader');

  // 初始化
  addVideoBackground(header, main, footer);
  setActiveNav();
  animateCardsOnScroll();
  setupHeroVisualization();
  setupBubbleCanvas();

  // Loader 隐藏
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);
  }

  // 滚动处理
  window.addEventListener('scroll', () => handleScroll(header));

  // 语音助手切换
  if (speechBtn) {
    speechBtn.addEventListener('click', handleSpeechToggle);
  }
});

/* ================= 视频背景 ================= */
function addVideoBackground(header, main, footer) {
  if (document.querySelector('.video-background')) return;

  const videoBg = document.createElement('div');
  videoBg.className = 'video-background';
  videoBg.innerHTML = `
    <video autoplay muted loop playsinline>
      <source src="images/bg.MP4" type="video/mp4">
      您的浏览器不支持视频标签。
    </video>
    <div class="video-overlay"></div>
    <div class="chinese-pattern"></div>
  `;

  document.body.insertBefore(videoBg, document.body.firstChild);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'content-wrapper';
  [header, main, footer].forEach(el => el && contentWrapper.appendChild(el));
  document.body.appendChild(contentWrapper);
}

/* ================= 导航激活 ================= */
function setActiveNav() {
  const page = window.pageName || 'index';
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href.includes(page)) link.classList.add('active');
  });
}

/* ================= 滚动效果 ================= */
function handleScroll(header) {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 50);
}

/* ================= 卡片滚动动画 ================= */
function animateCardsOnScroll() {
  const cards = document.querySelectorAll('.card, .herb-card, .ai-panel, .upload-panel');
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

/* ================= 语音助手 ================= */
function handleSpeechToggle() {
  const speechBtn = document.getElementById('speechToggle');
  if (!speechBtn) return;

  if (window.speechHelper) {
    window.speechHelper.toggleSpeech();
    speechBtn.classList.toggle('active');
    const msg = speechBtn.classList.contains('active') ? '语音助手已开启' : '语音助手已关闭';
    showMessage(msg, speechBtn.classList.contains('active') ? 'success' : 'info');
  } else {
    showMessage('语音助手初始化中...', 'warning');
  }
}

/* ================= Hero 可视化 ================= */
function setupHeroVisualization() {
  const heroRight = document.querySelector('.hero-right');
  if (!heroRight) return;

  heroRight.innerHTML = '<div class="hero-visual"><canvas></canvas></div>';
  const canvas = heroRight.querySelector('canvas');

  function resizeCanvas() {
    const rect = heroRight.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  startHarmoniousAnimation(canvas);
}

/* ================= 草药动画 ================= */
function startHarmoniousAnimation(canvas) {
  const ctx = canvas.getContext('2d');
  let t = 0;
  let herbs = Array.from({ length: 12 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 8 + 6,
    speed: Math.random() * 0.6 + 0.2,
    angle: Math.random() * Math.PI * 2,
    color: `rgba(42, 143, 122, ${Math.random() * 0.4 + 0.4})`,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.015,
    pulsePhase: Math.random() * Math.PI * 2
  }));

  let pulses = [];

  function createPulse(x, y) {
    pulses.push({ x, y, radius: 0, maxRadius: 50, speed: 1.5, alpha: 0.8, color: 'rgba(42,143,122,0.25)' });
  }

  setInterval(() => {
    if (herbs.length && Math.random() > 0.3) {
      const herb = herbs[Math.floor(Math.random() * herbs.length)];
      createPulse(herb.x, herb.y);
    }
  }, 1200);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(234, 250, 246, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 脉动
    pulses.forEach((pulse, i) => {
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, pulse.radius);
      grad.addColorStop(0, 'rgba(42,143,122,0.4)');
      grad.addColorStop(1, 'rgba(42,143,122,0)');
      ctx.fillStyle = grad;
      ctx.fill();
      pulse.radius += pulse.speed;
      if (pulse.radius > pulse.maxRadius) pulses.splice(i, 1);
    });
	// 绘制中医太极符号
	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	
	const glowGradient = ctx.createRadialGradient(0, 0, 45, 0, 0, 60);
	glowGradient.addColorStop(0, 'rgba(42, 143, 122, 0.3)');
	glowGradient.addColorStop(1, 'rgba(42, 143, 122, 0)');
	ctx.fillStyle = glowGradient;
	ctx.beginPath();
	ctx.arc(0, 0, 60, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.strokeStyle = 'rgba(42, 143, 122, 0.4)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(0, 0, 45, 0, Math.PI * 2);
	ctx.stroke();
	
	ctx.rotate(t * 0.005);
	
	ctx.fillStyle = 'rgba(42, 143, 122, 0.25)';
	ctx.beginPath();
	ctx.arc(0, 0, 40, 0, Math.PI);
	ctx.fill();
	
	ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
	ctx.beginPath();
	ctx.arc(0, 0, 40, Math.PI, Math.PI * 2);
	ctx.fill();
	
	ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
	ctx.beginPath();
	ctx.arc(-20, 0, 8, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.fillStyle = 'rgba(42, 143, 122, 0.6)';
	ctx.beginPath();
	ctx.arc(20, 0, 8, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.restore();
	

    // 草药粒子
    herbs.forEach(herb => {
      herb.x += Math.cos(herb.angle) * herb.speed;
      herb.y += Math.sin(herb.angle) * herb.speed;
      herb.rotation += herb.rotationSpeed;
      herb.pulsePhase += 0.05;

      // 边界循环
      if (herb.x < -20) herb.x = canvas.width + 20;
      if (herb.x > canvas.width + 20) herb.x = -20;
      if (herb.y < -20) herb.y = canvas.height + 20;
      if (herb.y > canvas.height + 20) herb.y = -20;

      const pulseSize = Math.sin(herb.pulsePhase) * 2;
      const size = herb.size + pulseSize;

      ctx.save();
      ctx.translate(herb.x, herb.y);
      ctx.rotate(herb.rotation);
      ctx.fillStyle = herb.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,143,122,0.9)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * size * 1.8, Math.sin(angle) * size * 1.8);
        ctx.stroke();
      }
      ctx.restore();
    });

    t++;
    requestAnimationFrame(draw);
  }

  draw();
}

/* ================= 气泡背景 ================= */
function setupBubbleCanvas() {
  const bubbleCanvas = document.getElementById('bubbleCanvas');
  if (!bubbleCanvas) return;
  const ctx = bubbleCanvas.getContext('2d');

  function resize() {
    bubbleCanvas.width = bubbleCanvas.offsetWidth;
    bubbleCanvas.height = bubbleCanvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let bubbles = Array.from({ length: 25 }, () => ({
    x: Math.random() * bubbleCanvas.width,
    y: bubbleCanvas.height + Math.random() * 200,
    r: Math.random() * 6 + 3,
    speed: Math.random() * 0.5 + 0.5
  }));

  function animate() {
    ctx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
    bubbles.forEach(b => {
      b.y -= b.speed;
      if (b.y < -20) {
        b.y = bubbleCanvas.height + 10;
        b.x = Math.random() * bubbleCanvas.width;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100,170,220,0.35)';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
