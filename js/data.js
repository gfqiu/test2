/**
 * 站点内容数据 — 可按需替换为真实信息
 */
window.SITE = {
  brand: "林砚",
  slogan: "前端 · AI 方向的在校学生",
  tagline: "用代码记录成长，用作品证明热爱",
  intro:
    "你好，我是林砚，计算机科学与技术专业在读。关注 Web 前端与 AI 应用落地，喜欢把课堂知识做成可运行的小项目。",
  tags: ["前端开发", "AI 应用", "开源学习者", "持续记录"],
  avatar: "./assets/avatar.svg",
  social: {
    github: "https://github.com/",
    gitee: "https://gitee.com/",
    blog: "./notes.html",
    email: "linyan@example.com",
  },
  about: {
    school: "某某大学",
    major: "计算机科学与技术",
    direction: "前端工程与 AI 应用开发",
    bio: [
      "我喜欢把复杂问题拆成可验证的小步骤，用可交付的作品闭环学习。",
      "课余时间会整理笔记、参与校园项目，并尝试把 AI 能力接入日常工具链。",
      "目标是成为能独立负责产品前端与智能化体验的工程师。",
    ],
    interests: ["交互体验", "可视化", "提示工程", "开源贡献"],
    goals: ["扎实前端基础", "完成 3+ 完整作品", "公开技术笔记"],
    timeline: [
      { year: "2023", text: "进入计算机专业，开始系统学习编程基础。" },
      { year: "2024", text: "专注前端，完成首个完整 Web 项目并开源。" },
      { year: "2025", text: "探索 AI 应用，将模型能力接入个人工具。" },
      { year: "2026", text: "持续打磨作品集与技术笔记，准备实习。" },
    ],
  },
  skills: [
    {
      category: "前端",
      items: [
        { name: "HTML / CSS", level: 88 },
        { name: "JavaScript", level: 85 },
        { name: "Vue 3", level: 78 },
        { name: "TypeScript", level: 70 },
      ],
    },
    {
      category: "后端",
      items: [
        { name: "Python", level: 75 },
        { name: "Node.js", level: 65 },
        { name: "FastAPI", level: 60 },
      ],
    },
    {
      category: "工具",
      items: [
        { name: "Git", level: 82 },
        { name: "Vite", level: 80 },
        { name: "Linux", level: 68 },
      ],
    },
    {
      category: "其他",
      items: [
        { name: "沟通协作", level: 80 },
        { name: "技术写作", level: 72 },
        { name: "问题拆解", level: 85 },
      ],
    },
  ],
  experience: [
    {
      type: "education",
      title: "某某大学 · 计算机科学与技术",
      period: "2023 — 至今",
      detail: "主修数据结构、操作系统、计算机网络；选修 Web 开发与机器学习导论。",
    },
    {
      type: "project",
      title: "校园项目 · 学习资源导航站",
      period: "2025",
      detail: "负责前端架构与组件库，实现检索、收藏与暗色模式。",
    },
    {
      type: "contest",
      title: "校级程序设计竞赛 · 二等奖",
      period: "2024",
      detail: "团队协作完成算法题挑战，负责前端可视化展示模块。",
    },
    {
      type: "internship",
      title: "实习意向 · 前端 / AI 应用开发",
      period: "2026 计划",
      detail: "希望参与真实产品迭代，积累工程化与协作经验。",
    },
    {
      type: "award",
      title: "证书 · 英语四级 / 计算机二级",
      period: "2024 — 2025",
      detail: "持续补充专业与语言能力，服务后续实习与项目沟通。",
    },
  ],
  projects: [
    {
      id: "campus-nav",
      name: "校园资源导航",
      summary: "聚合课程、实验室与竞赛信息的响应式导航站。",
      stack: ["Vue", "Vite", "CSS"],
      thumb: "./assets/project-campus.svg",
      github: "https://github.com/",
      demo: "#",
      highlights: ["按学院筛选资源", "收藏与本地缓存", "暗色模式"],
      description:
        "面向新生的校园信息聚合站。支持分类浏览、关键词搜索与收藏，方便快速找到实验室、社团与竞赛入口。",
      points: [
        "组件化拆分列表与筛选面板",
        "本地存储收藏状态",
        "移动端优先的信息架构",
      ],
    },
    {
      id: "notes-garden",
      name: "笔记花园",
      summary: "基于 Markdown 的轻量笔记站，支持标签与搜索。",
      stack: ["JavaScript", "Markdown"],
      thumb: "./assets/project-notes.svg",
      github: "https://github.com/",
      demo: "./notes.html",
      highlights: ["Markdown 渲染", "标签筛选", "静态部署"],
      description:
        "把课堂笔记与读书摘录做成可检索的静态站点，方便分享与长期归档。",
      points: ["自定义轻量 Markdown 解析", "标签与全文搜索", "GitHub Pages 友好"],
    },
    {
      id: "ai-flashcards",
      name: "AI 闪卡助手",
      summary: "用提示词批量生成复习闪卡，辅助期末复习。",
      stack: ["Python", "AI", "Vue"],
      thumb: "./assets/project-ai.svg",
      github: "https://github.com/",
      demo: "#",
      highlights: ["批量生成", "导出 Anki", "主题分类"],
      description:
        "输入知识点大纲，调用模型生成问答闪卡，并支持导出到常见复习工具。",
      points: ["结构化输出约束", "前端预览与编辑", "导出格式适配"],
    },
    {
      id: "portfolio-kit",
      name: "作品集脚手架",
      summary: "零构建依赖的静态作品集模板，开箱可部署。",
      stack: ["HTML", "CSS", "JavaScript"],
      thumb: "./assets/project-kit.svg",
      github: "https://github.com/",
      demo: "./index.html",
      highlights: ["主题切换", "站内搜索", "响应式导航"],
      description:
        "面向学生的个人官网模板，包含项目、笔记、技能与经历等常见模块。",
      points: ["相对路径静态资源", "无框架运行", "可替换数据层"],
    },
  ],
  notes: [
    {
      id: "vue-reactivity",
      title: "Vue 响应式原理笔记",
      summary: "从 Proxy 到依赖收集，整理一份可复习的知识地图。",
      date: "2026-07-18",
      tags: ["Vue", "前端"],
      file: "./content/notes/vue-reactivity.md",
    },
    {
      id: "css-layout",
      title: "现代 CSS 布局备忘",
      summary: "Grid / Flex / 容器查询的取舍与常见坑。",
      date: "2026-06-02",
      tags: ["CSS", "前端"],
      file: "./content/notes/css-layout.md",
    },
    {
      id: "prompt-basics",
      title: "提示工程入门清单",
      summary: "写好提示词的结构：角色、约束、示例与输出格式。",
      date: "2026-05-20",
      tags: ["AI", "Python"],
      file: "./content/notes/prompt-basics.md",
    },
    {
      id: "git-workflow",
      title: "小团队 Git 协作流",
      summary: "分支命名、PR 描述与常见冲突处理习惯。",
      date: "2026-04-11",
      tags: ["Git", "工具"],
      file: "./content/notes/git-workflow.md",
    },
  ],
};
