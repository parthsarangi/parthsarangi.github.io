/* Portfolio interactions: nav, scroll progress, reveal, showcase filters. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeNav();
    });
  }

  /* ---------- scroll progress ---------- */
  var progress = document.querySelector(".scroll-progress");

  function paintProgress() {
    if (!progress) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
  }

  /* ---------- reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- showcase filters ---------- */
  var filterBar = document.querySelector("[data-filters]");

  if (filterBar) {
    var chips = Array.prototype.slice.call(filterBar.querySelectorAll(".chip"));
    var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-tile]"));
    var count = document.querySelector("[data-filter-count]");

    function applyFilter(value) {
      var shown = 0;

      tiles.forEach(function (tile) {
        var domains = (tile.getAttribute("data-domain") || "").split(/\s+/);
        var match = value === "all" || domains.indexOf(value) !== -1;
        tile.hidden = !match;
        if (match) shown += 1;
      });

      chips.forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.getAttribute("data-filter") === value));
      });

      if (count) {
        count.textContent = String(shown).padStart(2, "0") + " / " + String(tiles.length).padStart(2, "0") + " briefs shown";
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        applyFilter(chip.getAttribute("data-filter") || "all");
      });
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- run ---------- */
  paintProgress();
  window.addEventListener("scroll", paintProgress, { passive: true });
  window.addEventListener("resize", paintProgress);
})();
