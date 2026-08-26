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

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.setProperty("--size", String(BOARD_SIZE));

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
      boardEl.appendChild(cell);
    }
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
  // force reflow for replay
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
