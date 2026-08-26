(function () {
  "use strict";

  const HOLE_COUNT = 9;
  const GAME_SECONDS = 30;
  const BASE_UP_MS = 900;
  const BASE_GAP_MS = 700;

  const board = document.getElementById("board");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const comboEl = document.getElementById("combo");
  const startBtn = document.getElementById("startBtn");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayMsg = document.getElementById("overlayMsg");
  const restartBtn = document.getElementById("restartBtn");

  /** @type {{ hole: HTMLElement, mole: HTMLElement, up: boolean }[]} */
  const holes = [];

  let score = 0;
  let combo = 0;
  let timeLeft = GAME_SECONDS;
  let playing = false;
  let activeIndex = -1;
  let tickTimer = null;
  let popTimer = null;
  let hideTimer = null;

  function createMole() {
    const mole = document.createElement("div");
    mole.className = "mole";
    mole.innerHTML =
      '<div class="mole-body">' +
      '<span class="mole-eye left"></span>' +
      '<span class="mole-eye right"></span>' +
      '<span class="mole-nose"></span>' +
      '<span class="mole-whisker l1"></span>' +
      '<span class="mole-whisker l2"></span>' +
      '<span class="mole-whisker r1"></span>' +
      '<span class="mole-whisker r2"></span>' +
      "</div>";
    return mole;
  }

  function buildBoard() {
    board.innerHTML = "";
    holes.length = 0;
    for (let i = 0; i < HOLE_COUNT; i += 1) {
      const hole = document.createElement("button");
      hole.type = "button";
      hole.className = "hole";
      hole.setAttribute("aria-label", "地鼠洞 " + (i + 1));
      hole.dataset.index = String(i);
      const mole = createMole();
      hole.appendChild(mole);
      hole.addEventListener("pointerdown", onHoleHit);
      board.appendChild(hole);
      holes.push({ hole, mole, up: false });
    }
  }

  function updateHud() {
    scoreEl.textContent = String(score);
    timeEl.textContent = String(timeLeft);
    comboEl.textContent = String(combo);
  }

  function clearTimers() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
    if (popTimer) {
      clearTimeout(popTimer);
      popTimer = null;
    }
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function hideMole(index, animated) {
    const cell = holes[index];
    if (!cell || !cell.up) return;
    cell.up = false;
    cell.mole.classList.remove("up");
    if (!animated) {
      cell.mole.classList.remove("hit");
    }
    if (activeIndex === index) {
      activeIndex = -1;
    }
  }

  function hideAll() {
    for (let i = 0; i < holes.length; i += 1) {
      hideMole(i, false);
    }
  }

  function difficultyFactor() {
    const elapsed = GAME_SECONDS - timeLeft;
    return Math.min(1.6, 1 + elapsed / 25);
  }

  function scheduleNextPop() {
    if (!playing) return;
    const gap = Math.max(280, BASE_GAP_MS / difficultyFactor());
    popTimer = setTimeout(popRandomMole, gap);
  }

  function popRandomMole() {
    if (!playing) return;
    hideAll();

    let index = Math.floor(Math.random() * HOLE_COUNT);
    if (HOLE_COUNT > 1) {
      let guard = 0;
      while (index === activeIndex && guard < 6) {
        index = Math.floor(Math.random() * HOLE_COUNT);
        guard += 1;
      }
    }

    const cell = holes[index];
    cell.up = true;
    activeIndex = index;
    cell.mole.classList.remove("hit");
    cell.mole.classList.add("up");

    const upMs = Math.max(320, BASE_UP_MS / difficultyFactor());
    hideTimer = setTimeout(function () {
      if (cell.up) {
        combo = 0;
        updateHud();
        hideMole(index, false);
        scheduleNextPop();
      }
    }, upMs);
  }

  function onHoleHit(event) {
    if (!playing) return;
    const hole = event.currentTarget;
    const index = Number(hole.dataset.index);
    const cell = holes[index];
    if (!cell || !cell.up) {
      combo = 0;
      updateHud();
      return;
    }

    event.preventDefault();
    cell.up = false;
    activeIndex = -1;
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    combo += 1;
    const bonus = Math.min(combo - 1, 5);
    score += 1 + bonus;
    updateHud();

    cell.mole.classList.remove("up");
    cell.mole.classList.add("hit");
    setTimeout(function () {
      cell.mole.classList.remove("hit");
    }, 320);

    scheduleNextPop();
  }

  function endGame() {
    playing = false;
    clearTimers();
    hideAll();
    startBtn.disabled = false;
    startBtn.textContent = "开始游戏";

    overlayTitle.textContent = "时间到！";
    overlayMsg.textContent = "你的得分是 " + score + (combo > 0 ? "，最高连击值得一夸" : "");
    overlay.classList.remove("hidden");
  }

  function startGame() {
    clearTimers();
    hideAll();
    score = 0;
    combo = 0;
    timeLeft = GAME_SECONDS;
    playing = true;
    activeIndex = -1;
    updateHud();
    startBtn.disabled = true;
    startBtn.textContent = "游戏中…";
    overlay.classList.add("hidden");

    tickTimer = setInterval(function () {
      timeLeft -= 1;
      updateHud();
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    popTimer = setTimeout(popRandomMole, 450);
  }

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  buildBoard();
  updateHud();
})();
