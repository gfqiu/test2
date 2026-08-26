const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  createBoard,
  canConnect,
  findPath,
  removeTiles,
  isCleared,
  countTiles,
  hasAnyMove,
  shuffleRemaining,
} = require('../js/logic.js');

describe('createBoard', () => {
  it('生成偶数格且成对出现', () => {
    const board = createBoard(4, 4, 4);
    assert.equal(board.length, 4);
    assert.equal(board[0].length, 4);
    const counts = {};
    for (const row of board) {
      for (const cell of row) {
        counts[cell] = (counts[cell] || 0) + 1;
      }
    }
    for (const n of Object.values(counts)) {
      assert.equal(n % 2, 0);
    }
  });

  it('奇数格抛错', () => {
    assert.throws(() => createBoard(3, 3), /偶数/);
  });
});

describe('连通判定', () => {
  it('直线可连', () => {
    const board = [
      ['A', null, 'A'],
      [null, null, null],
      [null, null, null],
    ];
    assert.equal(canConnect(board, 0, 0, 0, 2), true);
    const path = findPath(board, 0, 0, 0, 2);
    assert.ok(path);
    assert.equal(path.points.length, 2);
  });

  it('一折可连', () => {
    const board = [
      ['A', null, null],
      [null, null, null],
      [null, null, 'A'],
    ];
    // 拐角 (0,2) 或 (2,0)
    assert.equal(canConnect(board, 0, 0, 2, 2), true);
    const path = findPath(board, 0, 0, 2, 2);
    assert.ok(path);
    assert.ok(path.points.length <= 3);
  });

  it('两折可连（经外缘）', () => {
    const board = [
      ['A', 'X', 'A'],
      ['Y', 'Z', 'W'],
      [null, null, null],
    ];
    // 顶部两 A 被 X 挡住，需绕外缘两折
    assert.equal(canConnect(board, 0, 0, 0, 2), true);
  });

  it('图案不同不可连', () => {
    const board = [
      ['A', null, 'B'],
      [null, null, null],
    ];
    assert.equal(canConnect(board, 0, 0, 0, 2), false);
  });

  it('相邻同色可连', () => {
    const board = [
      ['A', 'A'],
      ['B', 'C'],
    ];
    assert.equal(canConnect(board, 0, 0, 0, 1), true);
  });

  it('对角被占满需三折则不可连', () => {
    const board = [
      ['A', 'X'],
      ['Y', 'A'],
    ];
    assert.equal(canConnect(board, 0, 0, 1, 1), false);
  });
});

describe('消除与终局', () => {
  it('removeTiles 后计数下降', () => {
    const board = [
      ['A', 'A'],
      ['B', 'B'],
    ];
    assert.equal(countTiles(board), 4);
    removeTiles(board, 0, 0, 0, 1);
    assert.equal(countTiles(board), 2);
    assert.equal(isCleared(board), false);
    removeTiles(board, 1, 0, 1, 1);
    assert.equal(isCleared(board), true);
  });

  it('hasAnyMove 能发现可消对', () => {
    const board = [
      ['A', null, 'A'],
      ['B', 'C', 'B'],
    ];
    assert.equal(hasAnyMove(board), true);
  });

  it('对角同色被堵且需三折时无解', () => {
    const board = [
      ['A', 'B'],
      ['C', 'A'],
    ];
    // 对角 A 经外缘需三折，经典规则不可消
    assert.equal(canConnect(board, 0, 0, 1, 1), false);
    assert.equal(hasAnyMove(board), false);
  });

  it('shuffleRemaining 保持数量', () => {
    const board = [
      ['A', null, 'B'],
      ['A', 'B', null],
    ];
    const before = countTiles(board);
    shuffleRemaining(board);
    assert.equal(countTiles(board), before);
  });
});
