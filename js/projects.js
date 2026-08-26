(function () {
  function stackChips(stack) {
    return (stack || []).map((s) => `<span class="tag">${s}</span>`).join("");
  }

  function projectCard(p) {
    return `
      <article class="project-card" data-stack="${(p.stack || []).join(",").toLowerCase()}">
        <a href="./project.html?id=${encodeURIComponent(p.id)}">
          <img src="${p.thumb}" alt="${p.name} 缩略图" />
        </a>
        <div class="body">
          <h3><a href="./project.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3>
          <p class="muted">${p.summary}</p>
          <div class="tag-row">${stackChips(p.stack)}</div>
          <div class="detail-actions">
            <a class="btn btn-ghost" href="./project.html?id=${encodeURIComponent(p.id)}">详情</a>
            <a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a class="btn btn-ghost" href="${p.demo}">预览</a>
          </div>
        </div>
      </article>`;
  }

  function uniqueStacks(projects) {
    const set = new Set();
    projects.forEach((p) => (p.stack || []).forEach((s) => set.add(s)));
    return Array.from(set);
  }

  function initProjectsPage() {
    const root = document.querySelector("[data-projects]");
    const filters = document.querySelector("[data-project-filters]");
    if (!root || !window.SITE) return;

    const projects = SITE.projects || [];
    const stacks = uniqueStacks(projects);

    if (filters) {
      filters.innerHTML =
        `<button type="button" class="chip active" data-filter="all" aria-pressed="true">全部</button>` +
        stacks
          .map(
            (s) =>
              `<button type="button" class="chip" data-filter="${s.toLowerCase()}" aria-pressed="false">${s}</button>`
          )
          .join("");
    }

    function render(filter) {
      const list =
        filter === "all"
          ? projects
          : projects.filter((p) =>
              (p.stack || []).some((s) => s.toLowerCase() === filter)
            );
      root.innerHTML = list.length
        ? list.map(projectCard).join("")
        : `<div class="empty-state">该技术栈下暂无项目</div>`;
    }

    render("all");

    filters &&
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-filter]");
        if (!btn) return;
        filters.querySelectorAll(".chip").forEach((c) => {
          c.classList.remove("active");
          c.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        render(btn.getAttribute("data-filter"));
      });
  }

  function initProjectDetail() {
    const root = document.querySelector("[data-project-detail]");
    if (!root || !window.SITE) return;
    const id = new URLSearchParams(location.search).get("id");
    const project = (SITE.projects || []).find((p) => p.id === id);
    if (!project) {
      root.innerHTML = `<div class="empty-state">未找到该项目。<a href="./projects.html">返回列表</a></div>`;
      return;
    }
    document.title = `${project.name} · 项目详情`;
    root.innerHTML = `
      <div class="page-hero">
        <p class="muted"><a href="./projects.html">← 返回项目列表</a></p>
        <h1>${project.name}</h1>
        <p>${project.summary}</p>
        <div class="tag-row">${stackChips(project.stack)}</div>
        <div class="detail-actions">
          <a class="btn btn-primary" href="${project.github}" target="_blank" rel="noopener noreferrer">源码</a>
          <a class="btn btn-ghost" href="${project.demo}">在线预览</a>
        </div>
      </div>
      <div class="detail-media"><img src="${project.thumb}" alt="${project.name}" /></div>
      <div class="detail-body section">
        <h2>项目描述</h2>
        <p>${project.description}</p>
        <h2>技术要点</h2>
        <ul>${(project.points || []).map((x) => `<li>${x}</li>`).join("")}</ul>
        <h2>功能说明</h2>
        <ul>${(project.highlights || []).map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("[data-projects]")) initProjectsPage();
    if (document.querySelector("[data-project-detail]")) initProjectDetail();
  });
})();
