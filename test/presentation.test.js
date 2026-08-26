const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const required = ["index.html", "css/styles.css", "js/slides.js"];
let failed = 0;

function fail(msg) {
  console.error("FAIL:", msg);
  failed += 1;
}

function ok(msg) {
  console.log("OK:", msg);
}

for (const rel of required) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) fail(`缺少文件 ${rel}`);
  else ok(`存在 ${rel}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "css/styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "js/slides.js"), "utf8");

if (!html.includes('href="./css/styles.css"')) fail("index.html 未使用相对路径引用 CSS");
else ok("CSS 相对路径正确");

if (!html.includes('src="./js/slides.js"')) fail("index.html 未使用相对路径引用 JS");
else ok("JS 相对路径正确");

const slideCount = (html.match(/data-slide="/g) || []).length;
if (slideCount < 5) fail(`幻灯片数量过少：${slideCount}`);
else ok(`幻灯片数量 ${slideCount}`);

if (!html.includes("极光纪元")) fail("缺少品牌标题「极光纪元」");
else ok("品牌标题存在");

if (!css.includes("--accent")) fail("CSS 缺少设计变量");
else ok("CSS 设计变量存在");

if (!js.includes("ArrowRight") || !js.includes("goTo")) fail("JS 缺少翻页逻辑");
else ok("JS 翻页逻辑存在");

if (failed > 0) {
  console.error(`\n${failed} 项检查失败`);
  process.exit(1);
}

console.log("\n全部检查通过");
