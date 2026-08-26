(function () {
  const L = window.LianLianKan;
  const ROWS = 6;
  const COLS = 8;
  const PAIR_TYPES = 8;
  const TIME_LIMIT = 180;

  const boardEl = document.getElementById('board');
  const pathSvg = document.getElementById('path-layer');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const remainEl = document.getElementById('remain');
  const statusEl = document.getElementById('status');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayMsg = document.getElementById('overlay-msg');

  let board = null;
  let selected = null;
  let score = 0;
  let remainTime = TIME_LIMIT;
  let timerId = null;
  let busy = false;
  let gameOver = false;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = 'status' + (kind ? ` ${kind}` : '');
  }

  function updateHud() {
    scoreEl.textContent = String(score);
    timeEl.textContent = formatTime(remainTime);
    remainEl.textContent = String(L.countTiles(board));
  }

  function clearPath() {
    while (pathSvg.firstChild) pathSvg.removeChild(pathSvg.firstChild);
  }

  function tileCenter(r, c) {
    const tile = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    if (!tile) return null;
    const br = boardEl.getBoundingClientRect();
    const tr = tile.getBoundingClientRect();
    return {
      x: tr.left - br.left + tr.width / 2,
      y: tr.top - br.top + tr.height / 2,
    };
  }

  /**
   * 路径点含边框外坐标（-1 / rows / cols），用相邻真实格子推算边缘中点
   */
  function pointToXy(p) {
    const rows = board.length;
    const cols = board[0].length;
    let r = p.r;
    let c = p.c;
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      return tileCenter(r, c);
    }
    // 落在外围：夹到最近有效格边
    const clampR = Math.max(0, Math.min(rows - 1, r));
    const clampC = Math.max(0, Math.min(cols - 1, c));
    const base = tileCenter(clampR, clampC);
    if (!base) return null;
    const tile = boardEl.querySelector(`[data-r="${clampR}"][data-c="${clampC}"]`);
    const size = tile ? tile.offsetWidth : 50;
    const gap = 6;
    if (r < 0) return { x: base.x, y: base.y - size / 2 - gap };
    if (r >= rows) return { x: base.x, y: base.y + size / 2 + gap };
    if (c < 0) return { x: base.x - size / 2 - gap, y: base.y };
    if (c >= cols) return { x: base.x + size / 2 + gap, y: base.y };
    return base;
  }

  function drawPath(points) {
    clearPath();
    const wrap = boardEl.parentElement;
    pathSvg.setAttribute('width', String(wrap.clientWidth));
    pathSvg.setAttribute('height', String(wrap.clientHeight));
    pathSvg.style.width = wrap.clientWidth + 'px';
    pathSvg.style.height = wrap.clientHeight + 'px';

    for (let i = 0; i < points.length - 1; i++) {
      const a = pointToXy(points[i]);
      const b = pointToXy(points[i + 1]);
      if (!a || !b) continue;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(a.x));
      line.setAttribute('y1', String(a.y));
      line.setAttribute('x2', String(b.x));
      line.setAttribute('y2', String(b.y));
      line.setAttribute('stroke-dasharray', '8 6');
      pathSvg.appendChild(line);
    }
  }

  function renderBoard() {
    boardEl.style.gridTemplateColumns = `repeat(${COLS}, auto)`;
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tile';
        btn.dataset.r = String(r);
        btn.dataset.c = String(c);
        const val = board[r][c];
        if (val == null) {
          btn.classList.add('empty');
          btn.disabled = true;
          btn.textContent = '';
        } else {
          btn.textContent = val;
          btn.setAttribute('aria-label', `图案 ${val}，第 ${r + 1} 行第 ${c + 1} 列`);
          btn.addEventListener('click', () => onTileClick(r, c));
        }
        boardEl.appendChild(btn);
      }
    }
  }

  function getTileEl(r, c) {
    return boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  }

  function clearSelection() {
    if (selected) {
      const el = getTileEl(selected.r, selected.c);
      if (el) el.classList.remove('selected');
    }
    selected = null;
  }

  async function onTileClick(r, c) {
    if (busy || gameOver) return;
    if (board[r][c] == null) return;

    if (!selected) {
      selected = { r, c };
      getTileEl(r, c).classList.add('selected');
      setStatus('再选一个相同图案');
      return;
    }

    if (selected.r === r && selected.c === c) {
      clearSelection();
      setStatus('已取消选择');
      return;
    }

    const first = selected;
    if (board[first.r][first.c] !== board[r][c]) {
      clearSelection();
      selected = { r, c };
      getTileEl(r, c).classList.add('selected');
      setStatus('图案不同，已改选');
      return;
    }

    const path = L.findPath(board, first.r, first.c, r, c);
    if (!path) {
      clearSelection();
      selected = { r, c };
      getTileEl(r, c).classList.add('selected');
      setStatus('连不通，换一对试试');
      return;
    }

    busy = true;
    clearSelection();
    drawPath(path.points);
    const el1 = getTileEl(first.r, first.c);
    const el2 = getTileEl(r, c);
    el1.classList.add('matched');
    el2.classList.add('matched');

    await wait(320);
    L.removeTiles(board, first.r, first.c, r, c);
    clearPath();
    score += 10;
    remainTime = Math.min(TIME_LIMIT, remainTime + 2);
    updateHud();
    renderBoard();
    busy = false;

    if (L.isCleared(board)) {
      endGame(true);
      return;
    }
    if (!L.hasAnyMove(board)) {
      setStatus('没有可连的牌了，试试重排', 'fail');
    } else {
      setStatus('漂亮！继续');
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      if (gameOver) return;
      remainTime -= 1;
      updateHud();
      if (remainTime <= 0) {
        remainTime = 0;
        updateHud();
        endGame(false);
      }
    }, 1000);
  }

  function endGame(won) {
    gameOver = true;
    stopTimer();
    overlay.classList.add('show');
    if (won) {
      overlayTitle.textContent = '通关！';
      overlayMsg.textContent = `得分 ${score}，用时 ${formatTime(TIME_LIMIT - remainTime)}`;
      setStatus('全部消除，干得漂亮！', 'win');
    } else {
      overlayTitle.textContent = '时间到';
      overlayMsg.textContent = `得分 ${score}，还剩 ${L.countTiles(board)} 张`;
      setStatus('再来一局吧', 'fail');
    }
  }

  function newGame() {
    stopTimer();
    overlay.classList.remove('show');
    board = L.createBoard(ROWS, COLS, PAIR_TYPES);
    // 保证开局有解：若无解则重洗几次
    let tries = 0;
    while (!L.hasAnyMove(board) && tries < 20) {
      board = L.createBoard(ROWS, COLS, PAIR_TYPES);
      tries++;
    }
    selected = null;
    score = 0;
    remainTime = TIME_LIMIT;
    busy = false;
    gameOver = false;
    clearPath();
    renderBoard();
    updateHud();
    setStatus('点击两张相同图案，折线不超过两折即可消除');
    startTimer();
  }

  function reshuffle() {
    if (gameOver || busy) return;
    L.shuffleRemaining(board);
    clearSelection();
    clearPath();
    renderBoard();
    if (!L.hasAnyMove(board)) {
      setStatus('重排后仍无解，再点一次重排', 'fail');
    } else {
      setStatus('已重排剩余牌面');
    }
  }

  document.getElementById('btn-restart').addEventListener('click', newGame);
  document.getElementById('btn-shuffle').addEventListener('click', reshuffle);
  document.getElementById('btn-overlay-restart').addEventListener('click', newGame);

  newGame();
})();
