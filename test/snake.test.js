import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame,
  createInitialSnake,
  hitsSelf,
  isOutOfBounds,
  nextHead,
  queueDirection,
  resolveDirection,
  spawnFood,
  step,
  tick,
} from '../src/snake.js';

describe('snake core', () => {
  it('creates a centered horizontal snake', () => {
    const snake = createInitialSnake(16);
    assert.equal(snake.length, 3);
    assert.deepEqual(snake[snake.length - 1], { x: 9, y: 8 });
  });

  it('spawns food on an empty cell', () => {
    const snake = createInitialSnake(4);
    const food = spawnFood(snake, 4, () => 0);
    assert.ok(!snake.some((p) => p.x === food.x && p.y === food.y));
  });

  it('ignores reverse direction', () => {
    assert.equal(resolveDirection('right', 'left'), 'right');
    assert.equal(resolveDirection('up', 'down'), 'up');
    assert.equal(resolveDirection('left', 'up'), 'up');
  });

  it('moves head by direction', () => {
    assert.deepEqual(nextHead({ x: 2, y: 2 }, 'up'), { x: 2, y: 1 });
    assert.deepEqual(nextHead({ x: 2, y: 2 }, 'right'), { x: 3, y: 2 });
  });

  it('detects walls and self collision', () => {
    assert.equal(isOutOfBounds({ x: -1, y: 0 }, 4), true);
    assert.equal(isOutOfBounds({ x: 1, y: 1 }, 4), false);
    assert.equal(hitsSelf({ x: 1, y: 1 }, [{ x: 1, y: 1 }, { x: 2, y: 1 }]), true);
  });

  it('grows and scores when eating food', () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    const next = step({
      snake,
      direction: 'right',
      food: { x: 3, y: 0 },
      gridSize: 8,
      score: 0,
      rng: () => 0,
    });
    assert.equal(next.alive, true);
    assert.equal(next.score, 1);
    assert.equal(next.snake.length, 4);
  });

  it('dies when hitting a wall', () => {
    const next = step({
      snake: [{ x: 0, y: 0 }],
      direction: 'left',
      food: { x: 2, y: 2 },
      gridSize: 4,
      score: 0,
    });
    assert.equal(next.alive, false);
  });

  it('queues direction then ticks once per frame', () => {
    let game = createGame(8, () => 0.9);
    game = queueDirection(game, 'up');
    game = tick(game);
    assert.equal(game.direction, 'up');
    assert.equal(game.pendingDirection, null);
    assert.equal(game.alive, true);
  });
});
