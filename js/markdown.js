/**
 * 轻量 Markdown → HTML（覆盖标题/段落/列表/代码/链接/粗斜体）
 */
window.renderMarkdown = function renderMarkdown(src) {
  if (!src) return "";
  const escaped = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const parts = [];
  const text = escaped.replace(/```([\s\S]*?)```/g, (_, code) => {
    const token = `@@CODE${parts.length}@@`;
    parts.push(`<pre><code>${code.trim()}</code></pre>`);
    return token;
  });

  const lines = text.split(/\r?\n/);
  const html = [];
  let inList = false;

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  function inlineFormat(s) {
    return s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" rel="noopener noreferrer">$1</a>'
      );
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    if (/^###\s+/.test(line)) {
      closeList();
      html.push(`<h3>${inlineFormat(line.replace(/^###\s+/, ""))}</h3>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      closeList();
      html.push(`<h2>${inlineFormat(line.replace(/^##\s+/, ""))}</h2>`);
      continue;
    }
    if (/^#\s+/.test(line)) {
      closeList();
      html.push(`<h1>${inlineFormat(line.replace(/^#\s+/, ""))}</h1>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineFormat(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    closeList();
    if (/@@CODE\d+@@/.test(line.trim())) {
      html.push(line.trim());
    } else {
      html.push(`<p>${inlineFormat(line.trim())}</p>`);
    }
  }
  closeList();

  return html
    .join("\n")
    .replace(/@@CODE(\d+)@@/g, (_, i) => parts[Number(i)] || "");
};
