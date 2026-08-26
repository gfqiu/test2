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

/**
 * 用 SVG 精确画 15 条横线 + 15 条竖线，穿过每个交叉点（格子中心）。
 * @param {number} size
 */
function createGridSvg(size) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "board-grid");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  const step = 100 / size;
  for (let i = 0; i < size; i += 1) {
    const pos = step * i + step / 2;
    const v = document.createElementNS(NS, "line");
    v.setAttribute("x1", String(pos));
    v.setAttribute("y1", String(step / 2));
    v.setAttribute("x2", String(pos));
    v.setAttribute("y2", String(100 - step / 2));
    svg.appendChild(v);

    const h = document.createElementNS(NS, "line");
    h.setAttribute("x1", String(step / 2));
    h.setAttribute("y1", String(pos));
    h.setAttribute("x2", String(100 - step / 2));
    h.setAttribute("y2", String(pos));
    svg.appendChild(h);
  }

  // 天元与星位（标准 15 路）
  const starIndexes = [3, 7, 11];
  for (const r of starIndexes) {
    for (const c of starIndexes) {
      const cx = step * c + step / 2;
      const cy = step * r + step / 2;
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", String(cx));
      dot.setAttribute("cy", String(cy));
      dot.setAttribute("r", "0.9");
      dot.setAttribute("class", "star-point");
      svg.appendChild(dot);
    }
  }

  return svg;
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.setProperty("--size", String(BOARD_SIZE));
  boardEl.appendChild(createGridSvg(BOARD_SIZE));

  const cells = document.createElement("div");
  cells.className = "board-cells";
  cells.setAttribute("role", "presentation");

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
      cells.appendChild(cell);
    }
  }

  boardEl.appendChild(cells);
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
