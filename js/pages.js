(function () {
  function noteHref(id) {
    return `./note.html?id=${encodeURIComponent(id)}#${encodeURIComponent(id)}`;
  }

  function noteCard(n) {
    const href = noteHref(n.id);
    return `
      <article class="note-card" data-tags="${(n.tags || []).join(",").toLowerCase()}">
        <div class="body">
          <p class="muted">${n.date}</p>
          <h3><a href="${href}">${n.title}</a></h3>
          <p class="muted">${n.summary}</p>
          <div class="tag-row">${(n.tags || [])
            .map((t) => `<span class="tag">${t}</span>`)
            .join("")}</div>
        </div>
      </article>`;
  }

  function uniqueTags(notes) {
    const set = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }

  function initNotesPage() {
    const root = document.querySelector("[data-notes]");
    const filters = document.querySelector("[data-note-filters]");
    const search = document.querySelector("[data-note-search]");
    if (!root || !window.SITE) return;

    const notes = [...(SITE.notes || [])].sort((a, b) =>
      a.date < b.date ? 1 : -1
    );
    let activeTag = "all";
    let query = "";

    if (filters) {
      filters.innerHTML =
        `<button type="button" class="chip active" data-tag="all" aria-pressed="true">全部</button>` +
        uniqueTags(notes)
          .map(
            (t) =>
              `<button type="button" class="chip" data-tag="${t.toLowerCase()}" aria-pressed="false">${t}</button>`
          )
          .join("");
    }

    function render() {
      const list = notes.filter((n) => {
        const tagOk =
          activeTag === "all" ||
          (n.tags || []).some((t) => t.toLowerCase() === activeTag);
        const hay = `${n.title} ${n.summary} ${(n.tags || []).join(" ")}`.toLowerCase();
        const qOk = !query || hay.includes(query);
        return tagOk && qOk;
      });
      root.innerHTML = list.length
        ? list.map(noteCard).join("")
        : `<div class="empty-state">没有匹配的笔记</div>`;
    }

    render();

    filters &&
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-tag]");
        if (!btn) return;
        activeTag = btn.getAttribute("data-tag");
        filters.querySelectorAll(".chip").forEach((c) => {
          c.classList.remove("active");
          c.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        render();
      });

    search &&
      search.addEventListener("input", () => {
        query = search.value.trim().toLowerCase();
        render();
      });
  }

  async function initNoteDetail() {
    const root = document.querySelector("[data-note-detail]");
    if (!root || !window.SITE) return;
    const id =
      new URLSearchParams(location.search).get("id") ||
      decodeURIComponent((location.hash || "").replace(/^#/, "")) ||
      null;
    const note = (SITE.notes || []).find((n) => n.id === id);
    if (!note) {
      root.innerHTML = `<div class="empty-state">未找到该笔记。<a href="./notes.html">返回列表</a></div>`;
      return;
    }
    document.title = `${note.title} · 学习笔记`;
    root.innerHTML = `
      <div class="page-hero">
        <p class="muted"><a href="./notes.html">← 返回笔记列表</a></p>
        <h1>${note.title}</h1>
        <p>${note.date} · ${(note.tags || []).join(" / ")}</p>
        <p class="muted">${note.summary}</p>
      </div>
      <article class="markdown-body section" data-md-body>加载中…</article>`;

    try {
      const res = await fetch(note.file);
      if (!res.ok) throw new Error("fetch failed");
      const md = await res.text();
      root.querySelector("[data-md-body]").innerHTML = window.renderMarkdown(md);
    } catch (err) {
      root.querySelector("[data-md-body]").innerHTML =
        `<div class="empty-state">笔记内容加载失败，请通过本地静态服务器打开站点。</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("[data-notes]")) initNotesPage();
    if (document.querySelector("[data-note-detail]")) initNoteDetail();
  });
})();
