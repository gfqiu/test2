import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BLACK,
  WHITE,
  EMPTY,
  BOARD_SIZE,
  createBoard,
  placeStone,
  checkWin,
  isBoardFull,
  nextPlayer,
  playerLabel,
} from "../js/gomoku.js";

describe("createBoard", () => {
  it("creates empty 15x15 board by default", () => {
    const board = createBoard();
    assert.equal(board.length, BOARD_SIZE);
    assert.equal(board[0].length, BOARD_SIZE);
    assert.ok(board.every((row) => row.every((c) => c === EMPTY)));
  });
});

describe("placeStone", () => {
  it("places a stone on empty cell", () => {
    const board = createBoard();
    const result = placeStone(board, 7, 7, BLACK);
    assert.equal(result.ok, true);
    assert.equal(result.board[7][7], BLACK);
    assert.equal(board[7][7], EMPTY);
  });

  it("rejects occupied cell", () => {
    let board = createBoard();
    board = placeStone(board, 0, 0, BLACK).board;
    const result = placeStone(board, 0, 0, WHITE);
    assert.equal(result.ok, false);
    assert.equal(result.reason, "occupied");
  });

  it("rejects out of bounds", () => {
    const board = createBoard();
    assert.equal(placeStone(board, -1, 0, BLACK).ok, false);
    assert.equal(placeStone(board, 0, 15, BLACK).ok, false);
  });
});

describe("checkWin", () => {
  it("detects horizontal five", () => {
    const board = createBoard();
    for (let c = 0; c < 5; c += 1) board[7][c] = BLACK;
    assert.equal(checkWin(board, 7, 2), true);
  });

  it("detects vertical five", () => {
    const board = createBoard();
    for (let r = 3; r < 8; r += 1) board[r][4] = WHITE;
    assert.equal(checkWin(board, 5, 4), true);
  });

  it("detects diagonal five", () => {
    const board = createBoard();
    for (let i = 0; i < 5; i += 1) board[i][i] = BLACK;
    assert.equal(checkWin(board, 2, 2), true);
  });

  it("detects anti-diagonal five", () => {
    const board = createBoard();
    for (let i = 0; i < 5; i += 1) board[i][4 - i] = WHITE;
    assert.equal(checkWin(board, 2, 2), true);
  });

  it("returns false for four in a row", () => {
    const board = createBoard();
    for (let c = 0; c < 4; c += 1) board[0][c] = BLACK;
    assert.equal(checkWin(board, 0, 1), false);
  });
});

describe("helpers", () => {
  it("nextPlayer toggles black and white", () => {
    assert.equal(nextPlayer(BLACK), WHITE);
    assert.equal(nextPlayer(WHITE), BLACK);
  });

  it("playerLabel returns Chinese labels", () => {
    assert.equal(playerLabel(BLACK), "黑棋");
    assert.equal(playerLabel(WHITE), "白棋");
  });

  it("isBoardFull detects full board", () => {
    const board = createBoard(2);
    assert.equal(isBoardFull(board), false);
    board[0][0] = BLACK;
    board[0][1] = WHITE;
    board[1][0] = BLACK;
    board[1][1] = WHITE;
    assert.equal(isBoardFull(board), true);
  });
});
