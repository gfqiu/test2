import {
  BLACK,
  WHITE,
  createBoard,
  placeStone,
  checkWin,
  isBoardFull,
  nextPlayer,
  playerLabel,
  BOARD_SIZE,
} from "./gomoku.js";

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const undoBtn = document.getElementById("undo");

/** @type {number[][]} */
let board = createBoard();
/** @type {number} */
let current = BLACK;
/** @type {boolean} */
let gameOver = false;
/** @type {{ board: number[][], current: number }[]} */
let history = [];

/** @type {HTMLCanvasElement | null} */
let gridCanvas = null;
/** @type {HTMLDivElement | null} */
let cellsEl = null;

/**
 * 按实际像素尺寸用 Canvas 画网格，避免亚像素模糊与缺边。
 * @param {HTMLCanvasElement} canvas
 * @param {number} size
 */
function drawGrid(canvas, size) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  if (cssW < 2 || cssH < 2) return;

  const w = Math.max(1, Math.round(cssW * dpr));
  const h = Math.max(1, Math.round(cssH * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#5c4030";
  ctx.fillStyle = "#5c4030";
  ctx.lineWidth = Math.max(1, Math.round(dpr));
  ctx.lineCap = "square";

  const cell = Math.min(w, h) / size;
  const originX = (w - cell * size) / 2 + cell / 2;
  const originY = (h - cell * size) / 2 + cell / 2;
  const endX = originX + cell * (size - 1);
  const endY = originY + cell * (size - 1);

  ctx.beginPath();
  for (let i = 0; i < size; i += 1) {
    const x = Math.round(originX + i * cell) + 0.5;
    const y = Math.round(originY + i * cell) + 0.5;
    ctx.moveTo(x, Math.round(originY) + 0.5);
    ctx.lineTo(x, Math.round(endY) + 0.5);
    ctx.moveTo(Math.round(originX) + 0.5, y);
    ctx.lineTo(Math.round(endX) + 0.5, y);
  }
  ctx.stroke();

  const starIndexes = [3, 7, 11];
  const r = Math.max(2, Math.round(cell * 0.08));
  for (const row of starIndexes) {
    for (const col of starIndexes) {
      const cx = Math.round(originX + col * cell) + 0.5;
      const cy = Math.round(originY + row * cell) + 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function ensureBoardShell() {
  if (gridCanvas && cellsEl) return;

  boardEl.innerHTML = "";
  boardEl.style.setProperty("--size", String(BOARD_SIZE));

  gridCanvas = document.createElement("canvas");
  gridCanvas.className = "board-grid";
  gridCanvas.setAttribute("aria-hidden", "true");
  boardEl.appendChild(gridCanvas);

  cellsEl = document.createElement("div");
  cellsEl.className = "board-cells";
  cellsEl.setAttribute("role", "presentation");
  boardEl.appendChild(cellsEl);

  const redraw = () => {
    if (gridCanvas) drawGrid(gridCanvas, BOARD_SIZE);
  };
  requestAnimationFrame(redraw);

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(redraw).observe(boardEl);
  } else {
    window.addEventListener("resize", redraw);
  }
}

function renderBoard() {
  ensureBoardShell();
  if (!cellsEl) return;

  cellsEl.innerHTML = "";

  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      cell.setAttribute("aria-label", `第 ${r + 1} 行第 ${c + 1} 列`);

      const stone = board[r][c];
      if (stone === BLACK || stone === WHITE) {
        const piece = document.createElement("span");
        piece.className = `stone ${stone === BLACK ? "black" : "white"}`;
        piece.setAttribute("aria-hidden", "true");
        cell.appendChild(piece);
        cell.disabled = true;
      } else if (gameOver) {
        cell.disabled = true;
      }

      cell.addEventListener("click", () => onCellClick(r, c));
      cellsEl.appendChild(cell);
    }
  }

  if (gridCanvas) {
    requestAnimationFrame(() => drawGrid(gridCanvas, BOARD_SIZE));
  }
}

function updateStatus(message) {
  statusEl.textContent = message;
}

function onCellClick(row, col) {
  if (gameOver) return;

  const result = placeStone(board, row, col, current);
  if (!result.ok) return;

  history.push({ board: board.map((r) => r.slice()), current });
  board = result.board;

  if (checkWin(board, row, col)) {
    gameOver = true;
    updateStatus(`${playerLabel(current)}获胜！`);
    renderBoard();
    celebrate();
    return;
  }

  if (isBoardFull(board)) {
    gameOver = true;
    updateStatus("平局 — 棋盘已满");
    renderBoard();
    return;
  }

  current = nextPlayer(current);
  updateStatus(`轮到${playerLabel(current)}`);
  renderBoard();
}

function celebrate() {
  boardEl.classList.remove("win-pulse");
  void boardEl.offsetWidth;
  boardEl.classList.add("win-pulse");
}

function restart() {
  board = createBoard();
  current = BLACK;
  gameOver = false;
  history = [];
  boardEl.classList.remove("win-pulse");
  updateStatus(`轮到${playerLabel(current)}`);
  renderBoard();
}

function undo() {
  if (history.length === 0 || gameOver) return;
  const prev = history.pop();
  board = prev.board;
  current = prev.current;
  updateStatus(`轮到${playerLabel(current)}`);
  renderBoard();
}

restartBtn.addEventListener("click", restart);
undoBtn.addEventListener("click", undo);

restart();
