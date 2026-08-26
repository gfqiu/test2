/**
 * 连连看核心逻辑：牌面生成与 ≤2 折连通判定
 * 可在浏览器与 Node 测试中共用
 */

const TILE_SYMBOLS = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🥝', '🍑', '🍍', '🥥', '🍌'];

/**
 * @param {number} rows
 * @param {number} cols
 * @param {number} [pairTypes] 使用的图案种类数
 * @returns {string[][]} 棋盘，空位为 null
 */
function createBoard(rows, cols, pairTypes = 8) {
  const cells = rows * cols;
  if (cells % 2 !== 0) {
    throw new Error('棋盘格子数必须为偶数');
  }
  const types = Math.min(pairTypes, TILE_SYMBOLS.length);
  const pairsNeeded = cells / 2;
  const pool = [];
  for (let i = 0; i < pairsNeeded; i++) {
    const symbol = TILE_SYMBOLS[i % types];
    pool.push(symbol, symbol);
  }
  shuffle(pool);
  const board = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(pool[idx++]);
    }
    board.push(row);
  }
  return board;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 在外围加一圈空边，便于绕行
 * @param {(string|null)[][]} board
 * @returns {(string|null)[][]}
 */
function withPadding(board) {
  const rows = board.length;
  const cols = board[0].length;
  const padded = [];
  padded.push(Array(cols + 2).fill(null));
  for (let r = 0; r < rows; r++) {
    padded.push([null, ...board[r], null]);
  }
  padded.push(Array(cols + 2).fill(null));
  return padded;
}

function isEmpty(board, r, c) {
  if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
  return board[r][c] === null;
}

/** 直线连通（不含端点，端点之间路径为空） */
function clearStraight(board, r1, c1, r2, c2) {
  if (r1 === r2) {
    const [minC, maxC] = c1 < c2 ? [c1, c2] : [c2, c1];
    for (let c = minC + 1; c < maxC; c++) {
      if (!isEmpty(board, r1, c)) return false;
    }
    return true;
  }
  if (c1 === c2) {
    const [minR, maxR] = r1 < r2 ? [r1, r2] : [r2, r1];
    for (let r = minR + 1; r < maxR; r++) {
      if (!isEmpty(board, r, c1)) return false;
    }
    return true;
  }
  return false;
}

/**
 * 查找两点连通路径（0/1/2 折），坐标为原棋盘坐标
 * @returns {{points: {r:number,c:number}[]}|null} 含两端点的折线顶点；不可通则 null
 */
function findPath(board, r1, c1, r2, c2) {
  if (r1 === r2 && c1 === c2) return null;
  if (board[r1][c1] == null || board[r2][c2] == null) return null;
  if (board[r1][c1] !== board[r2][c2]) return null;

  const pad = withPadding(board);
  // 原坐标 → 加边后坐标
  const a = { r: r1 + 1, c: c1 + 1 };
  const b = { r: r2 + 1, c: c2 + 1 };

  // 临时清空两端，视为可通过
  const v1 = pad[a.r][a.c];
  const v2 = pad[b.r][b.c];
  pad[a.r][a.c] = null;
  pad[b.r][b.c] = null;

  const path = findPathOnPadded(pad, a, b);

  pad[a.r][a.c] = v1;
  pad[b.r][b.c] = v2;

  if (!path) return null;
  // 转回原棋盘坐标（边框点会变成 -1 / rows/cols）
  return {
    points: path.map((p) => ({ r: p.r - 1, c: p.c - 1 })),
  };
}

function findPathOnPadded(board, a, b) {
  // 0 折：直线
  if (clearStraight(board, a.r, a.c, b.r, b.c)) {
    return [a, b];
  }

  // 1 折：一个拐角
  const corner1 = [
    { r: a.r, c: b.c },
    { r: b.r, c: a.c },
  ];
  for (const mid of corner1) {
    if (!isEmpty(board, mid.r, mid.c) && !(mid.r === b.r && mid.c === b.c) && !(mid.r === a.r && mid.c === a.c)) {
      continue;
    }
    if (
      clearStraight(board, a.r, a.c, mid.r, mid.c) &&
      clearStraight(board, mid.r, mid.c, b.r, b.c)
    ) {
      return [a, mid, b];
    }
  }

  // 2 折：两折——从 a 沿水平/垂直扫空位，再与 b 一折连通
  const rows = board.length;
  const cols = board[0].length;

  // 水平扫 a 所在行
  for (let c = 0; c < cols; c++) {
    if (c === a.c) continue;
    if (!isEmpty(board, a.r, c)) continue;
    if (!clearStraight(board, a.r, a.c, a.r, c)) continue;
    const mid = { r: a.r, c };
    // mid 到 b 需要一折或直线
    if (clearStraight(board, mid.r, mid.c, b.r, b.c)) {
      return [a, mid, b];
    }
    const corners = [
      { r: mid.r, c: b.c },
      { r: b.r, c: mid.c },
    ];
    for (const corner of corners) {
      if (!isEmpty(board, corner.r, corner.c) && !(corner.r === b.r && corner.c === b.c)) continue;
      if (
        clearStraight(board, mid.r, mid.c, corner.r, corner.c) &&
        clearStraight(board, corner.r, corner.c, b.r, b.c)
      ) {
        return [a, mid, corner, b];
      }
    }
  }

  // 垂直扫 a 所在列
  for (let r = 0; r < rows; r++) {
    if (r === a.r) continue;
    if (!isEmpty(board, r, a.c)) continue;
    if (!clearStraight(board, a.r, a.c, r, a.c)) continue;
    const mid = { r, c: a.c };
    if (clearStraight(board, mid.r, mid.c, b.r, b.c)) {
      return [a, mid, b];
    }
    const corners = [
      { r: mid.r, c: b.c },
      { r: b.r, c: mid.c },
    ];
    for (const corner of corners) {
      if (!isEmpty(board, corner.r, corner.c) && !(corner.r === b.r && corner.c === b.c)) continue;
      if (
        clearStraight(board, mid.r, mid.c, corner.r, corner.c) &&
        clearStraight(board, corner.r, corner.c, b.r, b.c)
      ) {
        return [a, mid, corner, b];
      }
    }
  }

  return null;
}

function canConnect(board, r1, c1, r2, c2) {
  return findPath(board, r1, c1, r2, c2) !== null;
}

function removeTiles(board, r1, c1, r2, c2) {
  board[r1][c1] = null;
  board[r2][c2] = null;
}

function isCleared(board) {
  return board.every((row) => row.every((cell) => cell === null));
}

function countTiles(board) {
  let n = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell != null) n++;
    }
  }
  return n;
}

/**
 * 是否存在至少一对可消的牌（用于死局检测）
 */
function hasAnyMove(board) {
  const positions = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c] != null) positions.push({ r, c, v: board[r][c] });
    }
  }
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (positions[i].v !== positions[j].v) continue;
      if (canConnect(board, positions[i].r, positions[i].c, positions[j].r, positions[j].c)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 重排剩余牌面（保持位置集合，打乱符号）
 */
function shuffleRemaining(board) {
  const values = [];
  const slots = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c] != null) {
        values.push(board[r][c]);
        slots.push({ r, c });
      }
    }
  }
  shuffle(values);
  slots.forEach((s, i) => {
    board[s.r][s.c] = values[i];
  });
}

const api = {
  TILE_SYMBOLS,
  createBoard,
  findPath,
  canConnect,
  removeTiles,
  isCleared,
  countTiles,
  hasAnyMove,
  shuffleRemaining,
  withPadding,
  clearStraight,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.LianLianKan = api;
}
