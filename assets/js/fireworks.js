// fireworks.js
(function () {
  // ========================
  // 配置项（可自定义）
  // ========================
  const CONFIG = {
    particles: 30,           // 每次爆炸粒子数量
    particleColors: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'],
    explosionDuration: 1000, // 爆炸动画时长（毫秒）
    gravity: 0.05,           // 重力加速度
    autoResize: true,        // 窗口缩放时调整画布
    zIndex: 99999999,        // 画布层级
    pointerEvents: 'none',   // 是否穿透点击
  };

  // ========================
  // 创建并初始化 canvas
  // ========================
  const canvas = document.createElement('canvas');
  canvas.classList.add('fireworks');
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: CONFIG.zIndex,
    pointerEvents: CONFIG.pointerEvents,
    display: 'block',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let canvasWidth, canvasHeight;

  function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth * 2;
    canvas.height = canvasHeight * 2;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    ctx.scale(2, 2);
  }

  // 初始化
  resizeCanvas();
  if (CONFIG.autoResize) {
    window.addEventListener('resize', resizeCanvas);
  }

  // ========================
  // 跟踪鼠标/触摸位置
  // ========================
  let pointerX = 0;
  let pointerY = 0;

  function updatePointer(e) {
    pointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    pointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  }

  document.addEventListener('mousemove', updatePointer);
  document.addEventListener('touchstart', updatePointer, { passive: true });

  // ========================
  // 创建粒子
  // ========================
  function createParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed * 5,
      vy: Math.sin(angle) * speed * 5,
      color: CONFIG.particleColors[Math.floor(Math.random() * CONFIG.particleColors.length)],
      size: Math.random() * 5 + 3,
      alpha: 1,
      update() {
        this.x += this.vx;
        this.vy += CONFIG.gravity; // 重力
        this.y += this.vy;
        this.alpha *= 0.95; // 透明度衰减
      },
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      },
    };
  }

  // ========================
  // 烟花爆炸主函数
  // ========================
  function explode(x, y) {
    const particles = [];

    // 创建粒子
    for (let i = 0; i < CONFIG.particles; i++) {
      particles.push(createParticle(x, y));
    }

    // 动画循环
    const animation = anime({
      duration: CONFIG.explosionDuration,
      easing: 'linear',
      update() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        particles.forEach(p => {
          if (p.alpha > 0.01) {
            p.update();
            p.draw();
          }
        });
      },
      complete() {
        // 动画结束后清理引用（可选）
        particles.length = 0;
      },
    });

    return animation; // 可用于暂停或控制
  }

  // ========================
  // 绑定点击/触摸事件
  // ========================
  function handleClick(e) {
    explode(e.clientX, e.clientY);
  }

  function handleTouch(e) {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      explode(touch.clientX, touch.clientY);
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('touchstart', handleTouch, { passive: true });

  // ========================
  // 暴露接口（可选）
  // ========================
  window.fireworks = {
    explode, // 外部可调用：fireworks.explode(100, 100)
    canvas,
    CONFIG,
    resize: resizeCanvas,
  };

})();