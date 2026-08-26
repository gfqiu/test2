const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function exists(rel) {
  assert.ok(fs.existsSync(path.join(root, rel)), "缺少文件: " + rel);
}

exists("index.html");
exists("css/style.css");
exists("js/game.js");

const html = read("index.html");
assert.ok(html.includes('href="./css/style.css"'), "CSS 应使用相对路径 ./css/style.css");
assert.ok(html.includes('src="./js/game.js"'), "JS 应使用相对路径 ./js/game.js");
assert.ok(html.includes('id="board"'), "应包含游戏棋盘 #board");
assert.ok(html.includes('id="startBtn"'), "应包含开始按钮 #startBtn");
assert.ok(html.includes('id="score"'), "应包含得分 #score");
assert.ok(html.includes("打地鼠"), "页面应包含品牌标题");

const css = read("css/style.css");
assert.ok(css.includes(".hole"), "样式应定义地鼠洞 .hole");
assert.ok(css.includes(".mole"), "样式应定义地鼠 .mole");
assert.ok(css.includes("@keyframes"), "样式应包含动画");

const js = read("js/game.js");
assert.ok(js.includes("startGame"), "游戏脚本应包含 startGame");
assert.ok(js.includes("popRandomMole"), "游戏脚本应包含 popRandomMole");
assert.ok(js.includes("HOLE_COUNT"), "游戏脚本应定义洞数量");

execFileSync(process.execPath, ["--check", path.join(root, "js/game.js")], {
  stdio: "pipe",
});

console.log("smoke tests passed");
