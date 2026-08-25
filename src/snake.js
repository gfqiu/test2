/** @typedef {'up'|'down'|'left'|'right'} Direction */
/** @typedef {{x: number, y: number}} Point */

export const DEFAULT_GRID = 16;

const OPPOSITE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/**
 * @param {number} gridSize
 * @returns {{x: number, y: number}[]}
 */
export function createInitialSnake(gridSize = DEFAULT_GRID) {
  const mid = Math.floor(gridSize / 2);
  return [
    { x: mid - 1, y: mid },
    { x: mid, y: mid },
    { x: mid + 1, y: mid },
  ];
}

/**
 * @param {{x: number, y: number}[]} snake
 * @param {number} gridSize
 * @param {() => number} [rng]
 * @returns {Point}
 */
export function spawnFood(snake, gridSize = DEFAULT_GRID, rng = Math.random) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }
  if (free.length === 0) {
    throw new Error('No free cells for food');
  }
  return free[Math.floor(rng() * free.length)];
}

/**
 * @param {Direction} current
 * @param {Direction} next
 * @returns {Direction}
 */
export function resolveDirection(current, next) {
  if (!next || OPPOSITE[current] === next) return current;
  return next;
}

/**
 * @param {Point} head
 * @param {Direction} direction
 * @returns {Point}
 */
export function nextHead(head, direction) {
  switch (direction) {
    case 'up':
      return { x: head.x, y: head.y - 1 };
    case 'down':
      return { x: head.x, y: head.y + 1 };
    case 'left':
      return { x: head.x - 1, y: head.y };
    case 'right':
      return { x: head.x + 1, y: head.y };
    default:
      throw new Error(`Unknown direction: ${direction}`);
  }
}

/**
 * @param {Point} point
 * @param {number} gridSize
 * @returns {boolean}
 */
export function isOutOfBounds(point, gridSize = DEFAULT_GRID) {
  return point.x < 0 || point.y < 0 || point.x >= gridSize || point.y >= gridSize;
}

/**
 * @param {Point} point
 * @param {Point[]} body
 * @returns {boolean}
 */
export function hitsSelf(point, body) {
  return body.some((p) => p.x === point.x && p.y === point.y);
}

/**
 * @param {{
 *   snake: Point[],
 *   direction: Direction,
 *   food: Point,
 *   gridSize?: number,
 *   score?: number,
 *   alive?: boolean,
 *   rng?: () => number,
 * }} state
 */
export function step(state) {
  if (state.alive === false) {
    return { ...state, alive: false };
  }

  const gridSize = state.gridSize ?? DEFAULT_GRID;
  const snake = state.snake;
  const head = snake[snake.length - 1];
  const next = nextHead(head, state.direction);

  if (isOutOfBounds(next, gridSize) || hitsSelf(next, snake)) {
    return {
      ...state,
      alive: false,
    };
  }

  const ate = next.x === state.food.x && next.y === state.food.y;
  const grown = [...snake, next];
  const moved = ate ? grown : grown.slice(1);
  const score = (state.score ?? 0) + (ate ? 1 : 0);
  const food = ate ? spawnFood(moved, gridSize, state.rng ?? Math.random) : state.food;

  return {
    ...state,
    snake: moved,
    food,
    score,
    alive: true,
  };
}

/**
 * @param {number} [gridSize]
 * @param {() => number} [rng]
 */
export function createGame(gridSize = DEFAULT_GRID, rng = Math.random) {
  const snake = createInitialSnake(gridSize);
  return {
    gridSize,
    snake,
    direction: /** @type {Direction} */ ('right'),
    pendingDirection: /** @type {Direction|null} */ (null),
    food: spawnFood(snake, gridSize, rng),
    score: 0,
    alive: true,
    rng,
  };
}

/**
 * @param {ReturnType<typeof createGame>} game
 * @param {Direction} direction
 */
export function queueDirection(game, direction) {
  const effective = resolveDirection(
    game.pendingDirection ?? game.direction,
    direction,
  );
  return { ...game, pendingDirection: effective };
}

/**
 * @param {ReturnType<typeof createGame>} game
 */
export function tick(game) {
  const direction = resolveDirection(game.direction, game.pendingDirection ?? game.direction);
  const next = step({
    ...game,
    direction,
  });
  return {
    ...next,
    direction,
    pendingDirection: null,
  };
}
