# 青麓中学官网

静态托管的学校官网演示页，可直接打开 `index.html`，无需开发服务器。

## 本地预览

```bash
# 任选其一
open index.html
python3 -m http.server 8080
```

浏览器访问 `http://localhost:8080`（若使用本地服务器）。

## 结构

- `index.html` — 页面入口
- `css/styles.css` — 样式
- `js/main.js` — 导航、滚动显现与预约表单
- `assets/` — 校园图片

## 校验

```bash
python3 scripts/check_site.py
```
