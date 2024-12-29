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

function mouseMove(e) {
  mouse.x = e.x;
  mouse.y = e.y;

  for (let i = 0; i < 3; i++) {
    balls.push(new Ball());
  }
}

function mouseOut() {
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

  let temp = [];
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].time <= balls[i].timeToLive) {
      temp.push(balls[i]);
    }
  }
  balls = temp;

  requestAnimationFrame(initDraw);
}

function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].draw();
  }
}

function touchInit(e) {
  window.addEventListener('touchmove', touchMove);
  window.addEventListener('touchend', touchEnd);

  function touchMove(e) {
    const { clientX: x, clientY: y } = e.touches[0];
    mouse.x = x;
    mouse.y = y;
    console.log(balls.length)

    for (let i = 0; i < 3; i++) {
      balls.push(new Ball());
    }
  }

  function touchEnd() {
    mouse.x = undefined;
    mouse.y = undefined;
    window.removeEventListener('touchmove', touchMove);
    window.removeEventListener('touchend', touchEnd);
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
      this.x = this.x + (this.end.x - this.x) * 0.01;
      this.y = this.y + (this.end.y - this.y) * 0.01;
    }
    this.time++;
  }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', mouseMove);
window.addEventListener('mouseout', mouseOut);
window.addEventListener('DOMContentLoaded', initAll);
window.addEventListener('touchstart', touchInit);
