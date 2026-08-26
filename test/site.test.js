const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
let failed = 0;

function ok(cond, msg) {
  if (cond) {
    console.log(`✓ ${msg}`);
  } else {
    failed += 1;
    console.error(`✗ ${msg}`);
  }
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

const pages = [
  "index.html",
  "about.html",
  "projects.html",
  "project.html",
  "notes.html",
  "note.html",
  "skills.html",
  "experience.html",
  "contact.html",
  "404.html",
];

pages.forEach((p) => ok(exists(p), `页面存在: ${p}`));

[
  "css/main.css",
  "js/data.js",
  "js/main.js",
  "js/markdown.js",
  "js/projects.js",
  "js/pages.js",
  "assets/avatar.svg",
  "content/notes/vue-reactivity.md",
].forEach((p) => ok(exists(p), `资源存在: ${p}`));

const index = read("index.html");
ok(index.includes("./css/main.css"), "首页使用相对路径 CSS");
ok(index.includes("./js/data.js"), "首页引用数据脚本");
ok(index.includes("hero-brand") || index.includes("林砚"), "首页包含品牌标识");

const css = read("css/main.css");
ok(css.includes("--brand"), "主题 CSS 变量已定义");
ok(css.includes("[data-theme=\"dark\"]"), "支持暗色主题");
ok(css.includes("@media (max-width: 860px)"), "包含移动端响应式断点");

const data = read("js/data.js");
ok(data.includes("projects:"), "数据包含项目列表");
ok(data.includes("notes:"), "数据包含笔记列表");
ok(data.includes("skills:"), "数据包含技能列表");

const md = read("js/markdown.js");
ok(md.includes("renderMarkdown"), "Markdown 渲染函数存在");

// 执行 markdown 渲染的最小校验
const vm = require("vm");
const sandbox = { window: {}, console };
vm.runInNewContext(md, sandbox);
const html = sandbox.window.renderMarkdown("# Hello\n\n- item\n\n**bold**");
ok(html.includes("<h1>Hello</h1>"), "Markdown 可渲染标题");
ok(html.includes("<li>item</li>"), "Markdown 可渲染列表");
ok(html.includes("<strong>bold</strong>"), "Markdown 可渲染粗体");

const mainJs = read("js/main.js");
ok(mainJs.includes("data-theme-toggle"), "包含主题切换");
ok(mainJs.includes("data-search"), "包含站内搜索");
ok(mainJs.includes("menu-toggle") || mainJs.includes("data-menu-toggle"), "包含移动端菜单");

pages.forEach((p) => {
  const htmlPage = read(p);
  ok(htmlPage.includes("./css/main.css"), `${p} 相对路径样式`);
  ok(htmlPage.includes("data-site-nav"), `${p} 挂载导航`);
});

if (failed > 0) {
  console.error(`\n${failed} 项失败`);
  process.exit(1);
}
console.log("\n全部测试通过");
