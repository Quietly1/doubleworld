// 统一脚本：魔幻星空 + 灵动鼠标光点 + 滚动进度 + 进入按钮 + 加载文章与分类筛选
(function () {
  // ===================== 魔幻星空背景核心逻辑 =====================
  class MagicStarSky {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.stars = []; // 普通星星
      this.cometStars = []; // 流星星星
      this.speed = 0.2; // 基础速度
      this.isMobile = window.innerWidth < 768;
      this.initCanvas();
      this.createStars();
      this.createCometStars();
      this.animate();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    // 初始化画布
    initCanvas() {
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.zIndex = '-3';
      this.canvas.style.pointerEvents = 'none';
      this.resizeCanvas();
      document.body.insertBefore(this.canvas, document.body.firstChild);
      // 背景渐变底色（魔幻紫蓝渐变）
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
      gradient.addColorStop(0, '#050020');
      gradient.addColorStop(0.5, '#1a0040');
      gradient.addColorStop(1, '#000830');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 适配窗口大小
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    // 创建普通星星（彩色、大小不一、呼吸闪烁）
    createStars() {
      const starCount = this.isMobile ? 800 : 1500; // 移动端减少数量
      for (let i = 0; i < starCount; i++) {
        // 随机彩色（紫/蓝/粉/白 魔幻色系）
        const colors = ['#ff6eff', '#6e6cff', '#00f0ff', '#ffffff', '#ff9dcf'];
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 1.2 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.8 + 0.2,
          blinkSpeed: Math.random() * 0.005 + 0.001, // 呼吸速度
          blinkDir: Math.random() > 0.5 ? 1 : -1, // 呼吸方向
        });
      }
    }

    // 创建流星星星（带拖尾、快速划过）
    createCometStars() {
      const cometCount = this.isMobile ? 5 : 10;
      for (let i = 0; i < cometCount; i++) {
        this.cometStars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          length: Math.random() * 80 + 30, // 拖尾长度
          speed: Math.random() * 3 + 1, // 流星速度
          angle: Math.PI / 4 + Math.random() * Math.PI / 6, // 流星角度
          opacity: Math.random() * 0.8 + 0.2,
          color: '#ffffff',
        });
      }
    }

    // 绘制普通星星（呼吸闪烁效果）
    drawStars() {
      this.stars.forEach(star => {
        // 呼吸效果：透明度动态变化
        star.opacity += star.blinkSpeed * star.blinkDir;
        if (star.opacity > 0.9) star.blinkDir = -1;
        if (star.opacity < 0.1) star.blinkDir = 1;

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `${star.color}${Math.floor(star.opacity * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fill();

        // 星星缓慢移动
        star.x += this.speed * (star.radius / 2);
        star.y += this.speed * (star.radius / 2);
        // 超出边界重置
        if (star.x > this.canvas.width) star.x = -10;
        if (star.y > this.canvas.height) star.y = -10;
      });
    }

    // 绘制流星（带拖尾）
    drawCometStars() {
      this.cometStars.forEach(comet => {
        this.ctx.beginPath();
        // 流星主体
        this.ctx.arc(comet.x, comet.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `${comet.color}${Math.floor(comet.opacity * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fill();

        // 流星拖尾（渐变透明）
        this.ctx.beginPath();
        this.ctx.moveTo(comet.x, comet.y);
        this.ctx.lineTo(
          comet.x - Math.cos(comet.angle) * comet.length,
          comet.y + Math.sin(comet.angle) * comet.length
        );
        this.ctx.lineWidth = 1.5;
        const gradient = this.ctx.createLinearGradient(comet.x, comet.y,
          comet.x - Math.cos(comet.angle) * comet.length,
          comet.y + Math.sin(comet.angle) * comet.length
        );
        gradient.addColorStop(0, `${comet.color}${Math.floor(comet.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${comet.color}00`);
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();

        // 流星移动
        comet.x += Math.cos(comet.angle) * comet.speed;
        comet.y -= Math.sin(comet.angle) * comet.speed;
        // 超出边界重置
        if (comet.x > this.canvas.width || comet.y < 0) {
          comet.x = Math.random() * -100;
          comet.y = Math.random() * this.canvas.height;
          comet.speed = Math.random() * 3 + 1;
        }
      });
    }

    // 动画循环
    animate() {
      // 半透明清空画布，实现拖影效果
      this.ctx.fillStyle = 'rgba(5, 0, 32, 0.05)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.drawStars();
      this.drawCometStars();
      requestAnimationFrame(() => this.animate());
    }
  }

  // ===================== 灵动鼠标光点核心逻辑（优化重点） =====================
  class MagicMouseLight {
    constructor() {
      this.light = document.querySelector('.light');
      if (!this.light) return;
      
      // 初始化样式（保证光点基础效果）
      this.light.style.position = 'fixed';
      this.light.style.pointerEvents = 'none';
      this.light.style.zIndex = '9999';
      this.light.style.borderRadius = '50%';
      this.light.style.background = 'radial-gradient(circle, #ff6eff 0%, #6e6cff 50%, transparent 70%)';
      this.light.style.boxShadow = '0 0 20px #00f0ff, 0 0 40px #ff6eff';
      this.light.style.transition = 'none'; // 关闭默认过渡，用requestAnimationFrame实现缓动
      
      // 缓动参数（控制灵动性）
      this.targetX = 0;
      this.targetY = 0;
      this.currentX = 0;
      this.currentY = 0;
      this.easeFactor = 0.15; // 缓动系数（越小越跟得慢，越灵动）
      this.baseSize = 40; // 基础大小
      this.maxSize = 80; // 最大大小
      
      this.initEvent();
      this.animate();
    }

    // 初始化鼠标事件
    initEvent() {
      document.addEventListener('mousemove', (e) => {
        // 记录目标位置
        this.targetX = e.clientX - this.baseSize / 2;
        this.targetY = e.clientY - this.baseSize / 2;
        
        // 鼠标移动速度影响光点大小和透明度（增加灵动性）
        const speedX = Math.abs(e.movementX);
        const speedY = Math.abs(e.movementY);
        const speed = Math.min(speedX + speedY, 20); // 限制最大速度
        const scale = 1 + (speed / 20) * (this.maxSize / this.baseSize - 1);
        const opacity = 0.6 + (1 - speed / 20) * 0.4; // 移动越快越透明
        
        // 动态更新样式
        this.light.style.width = `${this.baseSize * scale}px`;
        this.light.style.height = `${this.baseSize * scale}px`;
        this.light.style.opacity = opacity;
      });

      // 鼠标离开页面时隐藏光点
      document.addEventListener('mouseleave', () => {
        this.light.style.opacity = 0;
      });

      // 鼠标进入页面时显示光点
      document.addEventListener('mouseenter', () => {
        this.light.style.opacity = 0.8;
      });
    }

    // 缓动动画（核心：让光点不是瞬间跟随，而是有延迟的灵动跟随）
    animate() {
      // 缓动计算：当前位置 = 当前位置 + (目标位置 - 当前位置) * 缓动系数
      this.currentX += (this.targetX - this.currentX) * this.easeFactor;
      this.currentY += (this.targetY - this.currentY) * this.easeFactor;
      
      // 应用位置
      this.light.style.left = `${this.currentX}px`;
      this.light.style.top = `${this.currentY}px`;
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // ===================== 初始化所有功能 =====================
  document.addEventListener('DOMContentLoaded', () => {
    // 初始化魔幻星空
    new MagicStarSky();
    // 初始化灵动鼠标光点
    new MagicMouseLight();

    // ===================== 原有功能：滚动进度、进入按钮、文章加载 =====================
    const progress = document.querySelector('.progress');
    window.addEventListener('scroll', () => {
      if (!progress) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progress.style.width = `${percent}%`;
    });

    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        const about = document.querySelector('.about');
        if (about) about.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // 文章与分类
    let allPosts = [];
    const postGrid = document.querySelector('.post-grid');

    function renderPosts(posts) {
      if (!postGrid) return;
      if (!posts || posts.length === 0) {
        postGrid.innerHTML = '<div style="text-align:center;grid-column:1/-1;padding:20px;">暂无该分类文章</div>';
        return;
      }
      postGrid.innerHTML = posts.map(post => `
        <div class="post-item">
          <div class="post-img" style="background-image: url('${post.imgUrl || 'https://via.placeholder.com/300x200?text=暂无图片'}')"></div>
          <h3>${post.title}</h3>
          <p class="post-category">${post.category}</p>
          <p class="date">${post.date}</p>
          <p>${post.intro}</p>
        </div>
      `).join('');
    }

    async function loadPosts(category = 'all') {
      try {
        const res = await fetch('/data.json');
        if (!res.ok) throw new Error('fetch data.json failed');
        const data = await res.json();
        allPosts = Array.isArray(data.posts) ? data.posts : [];
        const filtered = category === 'all' ? allPosts : allPosts.filter(p => p.category === category);
        renderPosts(filtered);
      } catch (err) {
        console.error('加载文章失败:', err);
      }
    }

    // 分类点击
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const category = card.dataset.category || 'all';
        loadPosts(category);
      });
    });

    // 初始加载文章
    loadPosts();
  });
})();