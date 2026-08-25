import { createGame, queueDirection, tick } from './snake.js';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayBtn = document.getElementById('overlay-btn');
const restartBtn = document.getElementById('restart');

const KEY_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
};

const TICK_MS = 120;

let game = createGame();
let paused = false;
let lastTick = 0;
let rafId = 0;

function reset() {
  game = createGame();
  paused = false;
  hideOverlay();
  scoreEl.textContent = String(game.score);
}

function showOverlay(title, buttonLabel) {
  overlay.hidden = false;
  overlayTitle.textContent = title;
  overlayBtn.textContent = buttonLabel;
}

function hideOverlay() {
  overlay.hidden = true;
}

function cellSize() {
  return canvas.width / game.gridSize;
}

function drawCell(x, y, fill, radius = 6) {
  const size = cellSize();
  const px = x * size;
  const py = y * size;
  const pad = 2;
  ctx.fillStyle = fill;
  roundRect(px + pad, py + pad, size - pad * 2, size - pad * 2, radius);
  ctx.fill();
}

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCell(game.food.x, game.food.y, '#ff8f70', 10);

  game.snake.forEach((segment, index) => {
    const isHead = index === game.snake.length - 1;
    drawCell(segment.x, segment.y, isHead ? '#7dffb4' : '#2f9e68', isHead ? 8 : 5);
  });
}

function frame(ts) {
  rafId = requestAnimationFrame(frame);
  if (paused || !game.alive) {
    render();
    return;
  }
  if (ts - lastTick >= TICK_MS) {
    lastTick = ts;
    game = tick(game);
    scoreEl.textContent = String(game.score);
    if (!game.alive) {
      showOverlay(`游戏结束 · ${game.score} 分`, '再来一局');
    }
  }
  render();
}

window.addEventListener('keydown', (event) => {
  if (event.key === ' ' || event.code === 'Space') {
    event.preventDefault();
    if (!game.alive) return;
    paused = !paused;
    if (paused) showOverlay('暂停', '继续');
    else hideOverlay();
    return;
  }

  const direction = KEY_MAP[event.key];
  if (!direction) return;
  event.preventDefault();
  if (!game.alive || paused) return;
  game = queueDirection(game, direction);
});

overlayBtn.addEventListener('click', () => {
  if (!game.alive) {
    reset();
    return;
  }
  paused = false;
  hideOverlay();
});

restartBtn.addEventListener('click', () => {
  reset();
});

reset();
rafId = requestAnimationFrame(frame);

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(rafId);
});
