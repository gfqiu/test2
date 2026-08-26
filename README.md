# 林砚 · 学生个人官网

轻量静态个人站点：简介、项目、笔记、技能、经历与联系页。无需构建即可部署到 Vercel / Netlify / GitHub Pages。

## 本地预览

直接用静态服务器打开仓库根目录（推荐，以便笔记 Markdown 可 fetch）：

```bash
npm start
# 或
npx serve .
```

也可直接打开 `index.html`（笔记详情在 `file://` 下可能无法加载 `.md`）。

## 测试

```bash
npm test
```

## 自定义

编辑 `js/data.js` 与 `content/notes/*.md` 替换为你的真实信息。
