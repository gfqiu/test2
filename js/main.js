(function () {
  const NAV = [
    { href: "./index.html", label: "首页", id: "home" },
    { href: "./about.html", label: "关于", id: "about" },
    { href: "./projects.html", label: "项目", id: "projects" },
    { href: "./notes.html", label: "笔记", id: "notes" },
    { href: "./skills.html", label: "技能", id: "skills" },
    { href: "./experience.html", label: "经历", id: "experience" },
    { href: "./contact.html", label: "联系", id: "contact" },
  ];

  function currentPage() {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!file || file === "/") return "home";
    if (file.startsWith("project")) return "projects";
    if (file.startsWith("note")) return "notes";
    if (file.includes("404")) return "404";
    const hit = NAV.find((n) => n.href.endsWith(file));
    return hit ? hit.id : "home";
  }

  function renderNav() {
    const page = currentPage();
    const links = NAV.map(
      (n) =>
        `<li><a href="${n.href}" ${page === n.id ? 'aria-current="page"' : ""}>${n.label}</a></li>`
    ).join("");

    const brand = (window.SITE && window.SITE.brand) || "林砚";
    return `
      <a class="skip-link" href="#main">跳到主要内容</a>
      <header class="site-header">
        <div class="nav-inner">
          <a class="brand" href="./index.html">${brand}<span>.</span></a>
          <ul class="nav-links">${links}</ul>
          <div class="nav-actions">
            <button class="icon-btn" type="button" data-search-open aria-label="打开搜索">⌕</button>
            <button class="icon-btn" type="button" data-theme-toggle aria-label="切换主题">◐</button>
            <button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-label="打开菜单" aria-expanded="false">☰</button>
          </div>
        </div>
        <nav class="mobile-panel" data-mobile-panel hidden>
          <ul>${links}</ul>
        </nav>
      </header>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const brand = (window.SITE && window.SITE.brand) || "林砚";
    const github = (window.SITE && window.SITE.social && window.SITE.social.github) || "#";
    return `
      <footer class="site-footer">
        <div class="footer-inner">
          <div>© ${year} ${brand} · 学生个人官网</div>
          <div>
            <a href="${github}" rel="noopener noreferrer" target="_blank">GitHub</a>
            · 备案信息可在此替换
          </div>
        </div>
      </footer>
      <div class="search-overlay" data-search-overlay>
        <div class="search-panel" role="dialog" aria-modal="true" aria-label="站内搜索">
          <input class="search-input" type="search" placeholder="搜索项目或笔记…" data-search-input />
          <div class="search-results" data-search-results></div>
        </div>
      </div>
      <div class="copy-toast" data-copy-toast>已复制到剪贴板</div>
    `;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  function searchItems(query) {
    const q = query.trim().toLowerCase();
    if (!q || !window.SITE) return [];
    const projects = (SITE.projects || []).map((p) => ({
      type: "项目",
      title: p.name,
      summary: p.summary,
      href: `./project.html?id=${encodeURIComponent(p.id)}#${encodeURIComponent(p.id)}`,
      hay: `${p.name} ${p.summary} ${(p.stack || []).join(" ")}`.toLowerCase(),
    }));
    const notes = (SITE.notes || []).map((n) => ({
      type: "笔记",
      title: n.title,
      summary: n.summary,
      href: `./note.html?id=${encodeURIComponent(n.id)}#${encodeURIComponent(n.id)}`,
      hay: `${n.title} ${n.summary} ${(n.tags || []).join(" ")}`.toLowerCase(),
    }));
    return [...projects, ...notes].filter((item) => item.hay.includes(q)).slice(0, 12);
  }

  function renderSearchResults(container, items) {
    if (!items.length) {
      container.innerHTML = `<div class="empty-state">没有匹配结果</div>`;
      return;
    }
    container.innerHTML = items
      .map(
        (item) => `
        <a href="${item.href}">
          <strong>${item.title}</strong>
          <div class="muted">${item.type} · ${item.summary}</div>
        </a>`
      )
      .join("");
  }

  function initShell() {
    const mountNav = document.querySelector("[data-site-nav]");
    const mountFooter = document.querySelector("[data-site-footer]");
    if (mountNav) mountNav.innerHTML = renderNav();
    if (mountFooter) mountFooter.innerHTML = renderFooter();

    initTheme();

    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        applyTheme(next);
      });
    }

    const menuBtn = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");
    if (menuBtn && panel) {
      panel.hidden = false;
      menuBtn.addEventListener("click", () => {
        const open = panel.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
    }

    const overlay = document.querySelector("[data-search-overlay]");
    const openBtn = document.querySelector("[data-search-open]");
    const input = document.querySelector("[data-search-input]");
    const results = document.querySelector("[data-search-results]");

    function openSearch() {
      if (!overlay) return;
      overlay.classList.add("open");
      input && input.focus();
    }

    function closeSearch() {
      overlay && overlay.classList.remove("open");
    }

    openBtn && openBtn.addEventListener("click", openSearch);
    overlay &&
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeSearch();
      });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") closeSearch();
    });
    input &&
      input.addEventListener("input", () => {
        renderSearchResults(results, searchItems(input.value));
      });
  }

  function animateSkillBars() {
    document.querySelectorAll(".bar > span[data-level]").forEach((el) => {
      const level = Number(el.getAttribute("data-level") || 0);
      requestAnimationFrame(() => {
        el.style.width = `${level}%`;
      });
    });
  }

  function showToast(message) {
    const toast = document.querySelector("[data-copy-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1600);
  }

  window.SiteApp = {
    initShell,
    animateSkillBars,
    showToast,
    searchItems,
    currentPage,
  };

  document.addEventListener("DOMContentLoaded", initShell);
})();
