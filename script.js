const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let w, h;
let balls = [];

const mouse = {
  x: undefined,
  y: undefined
};

const color = [
  '00ff87',
  '60efff',
  '0061ff',
  'ff1b6b',
  'e81cff',
  'f89b29',
  '8364e8'
];

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function easeOut(x) {
  return 1 - Math.pow(1 - x, 4);
}

function randomColor() {
  return `#${color[~~(Math.random() * color.length)]}`;
}

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function spawn(x, y) {
  mouse.x = x;
  mouse.y = y;

  for (let i = 0; i < 3; i++) {
    balls.push(new Ball());
  }
}

function pointerMove(e) {
  spawn(e.clientX, e.clientY);
}

function touchMove(e) {
  const t = e.touches[0];
  spawn(t.clientX, t.clientY);
}

function clearPointer() {
  mouse.x = undefined;
  mouse.y = undefined;
}

function initAll() {
  resizeCanvas();
  initDraw();
}

function initDraw() {
  context.clearRect(0, 0, w, h);
  context.globalCompositeOperation = 'lighter';

  drawBalls();

  balls = balls.filter(b => b.time <= b.timeToLive);

  requestAnimationFrame(initDraw);
}

function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].draw();
  }
}

class Ball {
  constructor() {
    this.start = {
      x: mouse.x + getRandomInt(-30, 30),
      y: mouse.y + getRandomInt(-30, 30),
      size: getRandomInt(28, 38)
    };

    this.end = {
      x: this.start.x + getRandomInt(-300, 300),
      y: this.start.y + getRandomInt(-300, 300)
    };

    this.x = this.start.x;
    this.y = this.start.y;
    this.size = this.start.size;

    this.time = 0;
    this.style = randomColor();
    this.timeToLive = 100;
  }

  draw() {
    context.fillStyle = this.style;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }

  update() {
    if (this.time <= this.timeToLive) {
      let progress = 1 - (this.timeToLive - this.time) / this.timeToLive;
      this.size = this.start.size * (1 - easeOut(progress));
      this.x += (this.end.x - this.x) * 0.01;
      this.y += (this.end.y - this.y) * 0.01;
    }
    this.time++;
  }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('pointermove', pointerMove);
window.addEventListener('pointerleave', clearPointer);

window.addEventListener('touchmove', touchMove, { passive: true });
window.addEventListener('touchend', clearPointer);

window.addEventListener('DOMContentLoaded', initAll);
