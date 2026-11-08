let enteredName = '';

const userNameInput = document.getElementById('userNameInput');
const p1NextBtn = document.getElementById('p1NextBtn');

// १. नाव टाकल्यावरच पुढे Continue बटण दिसणे
userNameInput.addEventListener('input', function () {
  enteredName = this.value.trim();
  if (enteredName.length > 0) {
    p1NextBtn.classList.remove('hidden');
  } else {
    p1NextBtn.classList.add('hidden');
  }
});

// २. Page 1 वरून पडद्यांची ओढ आणि बंद होणे (Pulled from both sides)
function triggerCurtainTransition() {
  if (!enteredName) return;

  const curtainOverlay = document.getElementById('curtainOverlay');
  const anarStage = document.getElementById('anarStage');
  const page1 = document.getElementById('page1');

  // Page 1 हळुवार फिकट (fade-out) करणे
  page1.classList.add('page-fade-out');

  // पडद्यांचा पडदा ॲक्टिव्ह करून दोन्ही बाजूंनी मधोमध ओढणे
  curtainOverlay.classList.add('active');

  setTimeout(() => {
    curtainOverlay.classList.add('closed');
  }, 40);

  // पडदे पूर्णपणे मधोमध बंद झाल्यावर अनार समोर आणणे
  setTimeout(() => {
    anarStage.classList.remove('hidden');
    page1.classList.add('hidden');
  }, 1350);
}

// ३. अनारवर क्लिक केल्यावर स्फोट, स्क्रीन शेक आणि पाऊस
let isIgnited = false;
function igniteAnar() {
  if (isIgnited) return;
  isIgnited = true;

  document.getElementById('anarInstruction').classList.add('hidden');
  document.getElementById('wickSpark').style.display = 'none';

  // स्क्रीन शेक
  document.body.classList.add('screen-shake');
  setTimeout(() => {
    document.body.classList.remove('screen-shake');
  }, 650);

  const canvas = document.getElementById('sparkFountainCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 380;
  canvas.height = 500;

  const ambientLight = document.getElementById('ambientLight');
  ambientLight.style.background = 'radial-gradient(circle, rgba(255, 180, 0, 0.5) 0%, transparent 75%)';

  const sparks = [];
  const originX = canvas.width / 2;
  const originY = canvas.height - 65;

  const fountainPalette = [
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 225, b: 70 },
    { r: 255, g: 150, b: 0 },
    { r: 255, g: 50, b: 15 },
    { r: 0, g: 229, b: 255 }
  ];

  class PhysicsSpark {
    constructor() {
      this.x = originX + (Math.random() - 0.5) * 8;
      this.y = originY;

      const ejectionAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.44;
      const speed = Math.random() * 12 + 8.5;

      this.vx = Math.cos(ejectionAngle) * speed;
      this.vy = Math.sin(ejectionAngle) * speed;

      this.gravity = 0.34;
      this.airDrag = 0.982;

      this.color = fountainPalette[Math.floor(Math.random() * fountainPalette.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.024 + 0.014;
      this.size = Math.random() * 2.6 + 1.2;
    }

    update() {
      this.vx *= this.airDrag;
      this.vy *= this.airDrag;
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha <= 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      ctx.shadowBlur = 9;
      ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.85)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const startTime = Date.now();
  const burnDuration = 2500;

  function runSparksEngine() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (elapsed < burnDuration) {
      for (let i = 0; i < 18; i++) {
        sparks.push(new PhysicsSpark());
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].draw();
      if (sparks[i].update()) {
        sparks.splice(i, 1);
      }
    }

    if (elapsed < burnDuration + 800) {
      requestAnimationFrame(runSparksEngine);
    } else {
      ambientLight.style.background = 'none';
      // अनार संपल्यावर पडदे उघडून Page 2 दाखवणे
      revealPage2WithCurtain();
    }
  }

  runSparksEngine();
}

// ४. पडदे दोन्ही बाजूंना मागे खेचून Page 2 उघडणे
function revealPage2WithCurtain() {
  const curtainOverlay = document.getElementById('curtainOverlay');
  const anarStage = document.getElementById('anarStage');
  const page2 = document.getElementById('page2');

  // अनार लपवणे
  anarStage.classList.add('hidden');

  // Page 2 तयार ठेवणे
  document.getElementById('p2DisplayName').innerText = enteredName;
  page2.classList.remove('hidden');
  page2.classList.add('page-fade-in');

  // पडदे दोन्ही बाजूंना मागे ओढणे (Pulled Open)
  curtainOverlay.classList.remove('closed');

  setTimeout(() => {
    curtainOverlay.classList.remove('active');
  }, 1350);
}

// ५. Page 2 वरून Page 3 वर जाताना थेट न जाता पडद्यांचा पुन्हा वापर (Direct Switch नाही)
function revealPage3() {
  const curtainOverlay = document.getElementById('curtainOverlay');
  const page2 = document.getElementById('page2');
  const page3 = document.getElementById('page3');

  // १. Page 2 फिकट होणे
  page2.classList.add('page-fade-out');

  // २. पडदे पुन्हा दोन्ही बाजूंनी मधोमध ओढून बंद होणे
  curtainOverlay.classList.add('active');
  setTimeout(() => {
    curtainOverlay.classList.add('closed');
  }, 40);

  // ३. पडदे बंद असताना आत Page 2 काढून Page 3 लावणे
  setTimeout(() => {
    page2.classList.add('hidden');
    page2.classList.remove('page-fade-out');

    document.getElementById('p3DisplayName').innerText = enteredName;
    page3.classList.remove('hidden');
    page3.classList.add('page-fade-in');

    // ४. आता पडदे पुन्हा दोन्ही बाजूंना डौलदारपणे उघडणे
    setTimeout(() => {
      curtainOverlay.classList.remove('closed');
      setTimeout(() => {
        curtainOverlay.classList.remove('active');
      }, 1350);
    }, 400);

  }, 1350);
}

// ६. बॅकग्राउंड भरपूर रॉकेट्स सिस्टीम
(function initHeavyRocketShow() {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  let rockets = [];
  let sparkles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Rocket {
    constructor() {
      this.x = Math.random() * (canvas.width * 0.85) + (canvas.width * 0.075);
      this.y = canvas.height;
      this.targetY = Math.random() * (canvas.height * 0.42) + 50;
      this.speed = Math.random() * 4.5 + 7;
      this.smokeTail = [];
      this.hue = Math.floor(Math.random() * 360);
    }

    update() {
      this.smokeTail.push({ x: this.x, y: this.y, alpha: 0.65 });
      if (this.smokeTail.length > 10) this.smokeTail.shift();

      this.y -= this.speed;
      this.speed *= 0.988;

      if (this.y <= this.targetY || this.speed < 1.4) {
        this.detonate();
        return true;
      }
      return false;
    }

    draw() {
      ctx.save();
      for (let s of this.smokeTail) {
        ctx.fillStyle = `rgba(255, 185, 60, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();
        s.alpha -= 0.07;
      }
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffe600';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    detonate() {
      const sparkCount = Math.floor(Math.random() * 35 + 45);
      for (let i = 0; i < sparkCount; i++) {
        sparkles.push(new AerialBurster(this.x, this.y, this.hue));
      }
    }
  }

  class AerialBurster {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5.5 + 1.2;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity;
      this.gravity = 0.07;
      this.friction = 0.968;
      this.alpha = 1;
      this.decay = Math.random() * 0.016 + 0.011;
      this.hue = Math.random() > 0.35 ? 45 : hue;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha <= 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = `hsl(${this.hue}, 100%, 72%)`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function loopEngine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.065) {
      rockets.push(new Rocket());
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      rockets[i].draw();
      if (rockets[i].update()) rockets.splice(i, 1);
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      sparkles[i].draw();
      if (sparkles[i].update()) sparkles.splice(i, 1);
    }

    requestAnimationFrame(loopEngine);
  }
  loopEngine();
})();