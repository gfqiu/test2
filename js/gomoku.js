/** 五子棋核心逻辑（浏览器与 Node 测试共用） */

export const BOARD_SIZE = 15;
export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = 2;

/**
 * @returns {number[][]}
 */
export function createBoard(size = BOARD_SIZE) {
  return Array.from({ length: size }, () => Array(size).fill(EMPTY));
}

/**
 * @param {number[][]} board
 * @param {number} row
 * @param {number} col
 * @param {number} player
 * @returns {{ ok: true, board: number[][] } | { ok: false, reason: string }}
 */
export function placeStone(board, row, col, player) {
  const size = board.length;
  if (row < 0 || col < 0 || row >= size || col >= size) {
    return { ok: false, reason: "out_of_bounds" };
  }
  if (board[row][col] !== EMPTY) {
    return { ok: false, reason: "occupied" };
  }
  if (player !== BLACK && player !== WHITE) {
    return { ok: false, reason: "invalid_player" };
  }
  const next = board.map((r) => r.slice());
  next[row][col] = player;
  return { ok: true, board: next };
}

/**
 * 检查落子后是否形成五连
 * @param {number[][]} board
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
export function checkWin(board, row, col) {
  const player = board[row]?.[col];
  if (!player) return false;

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    let count = 1;
    count += countDirection(board, row, col, dr, dc, player);
    count += countDirection(board, row, col, -dr, -dc, player);
    if (count >= 5) return true;
  }
  return false;
}

/**
 * @param {number[][]} board
 * @param {number} row
 * @param {number} col
 * @param {number} dr
 * @param {number} dc
 * @param {number} player
 */
function countDirection(board, row, col, dr, dc, player) {
  const size = board.length;
  let count = 0;
  let r = row + dr;
  let c = col + dc;
  while (r >= 0 && c >= 0 && r < size && c < size && board[r][c] === player) {
    count += 1;
    r += dr;
    c += dc;
  }
  return count;
}

/**
 * @param {number[][]} board
 * @returns {boolean}
 */
export function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== EMPTY));
}

/**
 * @param {number} player
 * @returns {number}
 */
export function nextPlayer(player) {
  return player === BLACK ? WHITE : BLACK;
}

/**
 * @param {number} player
 * @returns {string}
 */
export function playerLabel(player) {
  if (player === BLACK) return "黑棋";
  if (player === WHITE) return "白棋";
  return "";
}
