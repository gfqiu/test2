(function () {
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var total = slides.length;
  var index = 0;
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var progressBar = document.getElementById("progressBar");
  var currentNum = document.getElementById("currentNum");
  var totalNum = document.getElementById("totalNum");

  if (!total) return;

  totalNum.textContent = String(total);

  function goTo(next) {
    if (next < 0 || next >= total || next === index) return;
    slides[index].classList.remove("is-active");
    index = next;
    slides[index].classList.add("is-active");
    updateChrome();
  }

  function updateChrome() {
    currentNum.textContent = String(index + 1);
    progressBar.style.width = ((index + 1) / total) * 100 + "%";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(total - 1);
    }
  });

  var touchStartX = 0;
  document.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  document.addEventListener(
    "touchend",
    function (e) {
      var dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true }
  );

  updateChrome();
})();
