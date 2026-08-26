<script setup>
const services = [
  {
    title: '统一认证',
    desc: '一次登录，贯通办公、邮箱与协作工具。',
    to: '/services',
  },
  {
    title: '资源申请',
    desc: '会议室、设备与权限申请一站提交。',
    to: '/services',
  },
  {
    title: '知识库',
    desc: '制度、流程与常见问题随时可查。',
    to: '/services',
  },
]

const news = [
  {
    date: '08.24',
    tag: '公告',
    title: '青澜门户 2.0 上线：导航更清晰，服务更快达',
  },
  {
    date: '08.18',
    tag: '动态',
    title: '本周系统维护窗口调整至周五晚间',
  },
  {
    date: '08.12',
    tag: '指南',
    title: '新人入职指南：从账号开通到工具配置',
  },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-media" aria-hidden="true">
        <img class="hero-photo" src="../assets/hero.jpg" alt="" />
        <div class="hero-veil" />
        <div class="hero-glow" />
      </div>

      <div class="container hero-content">
        <p class="brand-signal reveal">青澜门户</p>
        <h1 class="hero-title reveal reveal-delay-1">把日常入口，收进一处清朗水面</h1>
        <p class="hero-lead reveal reveal-delay-2">
          资讯、服务与协作汇聚于此，打开即达，少绕路。
        </p>
        <div class="hero-actions reveal reveal-delay-3">
          <RouterLink class="btn btn-primary" to="/services">开始使用</RouterLink>
          <RouterLink class="btn btn-ghost" to="/news">浏览资讯</RouterLink>
        </div>
      </div>
    </section>

    <section class="section services-preview">
      <div class="container">
        <p class="section-kicker">服务</p>
        <h2 class="section-title">常用能力，一眼可及</h2>
        <p class="section-lead">从认证到申请，把高频操作放在最近的路径上。</p>

        <ul class="service-list">
          <li v-for="(item, index) in services" :key="item.title">
            <RouterLink
              class="service-link"
              :to="item.to"
              :style="{ animationDelay: `${0.08 * index}s` }"
            >
              <span class="index">0{{ index + 1 }}</span>
              <span class="copy">
                <strong>{{ item.title }}</strong>
                <span>{{ item.desc }}</span>
              </span>
              <span class="arrow" aria-hidden="true">→</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="section news-preview">
      <div class="container news-layout">
        <div>
          <p class="section-kicker">资讯</p>
          <h2 class="section-title">最近发生的事</h2>
          <p class="section-lead">公告、维护与指南，及时同步到门户首页。</p>
          <RouterLink class="btn btn-outline more" to="/news">查看全部资讯</RouterLink>
        </div>
        <ul class="news-list">
          <li v-for="item in news" :key="item.title">
            <RouterLink class="news-item" to="/news">
              <time>{{ item.date }}</time>
              <span class="tag">{{ item.tag }}</span>
              <strong>{{ item.title }}</strong>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  align-items: end;
  overflow: hidden;
  color: #fff;
}

.hero-media {
  position: absolute;
  inset: 0;
}

.hero-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
  animation: drift 18s ease-in-out infinite;
}

.hero-veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(8, 56, 54, 0.35) 0%, rgba(8, 56, 54, 0.55) 42%, rgba(8, 56, 54, 0.88) 100%),
    linear-gradient(90deg, rgba(8, 56, 54, 0.55), transparent 55%);
}

.hero-glow {
  position: absolute;
  width: 42vw;
  height: 42vw;
  right: -8vw;
  bottom: -12vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.28), transparent 68%);
  filter: blur(8px);
  animation: drift 12s ease-in-out infinite reverse;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding-bottom: clamp(4.5rem, 12vw, 7.5rem);
  padding-top: 8rem;
}

.brand-signal {
  margin: 0 0 1rem;
  font-family: var(--serif);
  font-size: clamp(2.6rem, 8vw, 4.8rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.05;
  color: #fff;
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.28);
}

.hero-title {
  margin: 0;
  max-width: 14ch;
  font-family: var(--serif);
  font-size: clamp(1.55rem, 3.6vw, 2.35rem);
  font-weight: 600;
  line-height: 1.35;
}

.hero-lead {
  margin: 1rem 0 0;
  max-width: 28rem;
  font-size: 1.08rem;
  color: rgba(255, 255, 255, 0.84);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.75rem;
}

.service-list {
  list-style: none;
  margin: 2.5rem 0 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.service-link {
  display: grid;
  grid-template-columns: 4rem 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.35rem 0.15rem;
  border-bottom: 1px solid var(--line);
  opacity: 0;
  animation: rise 0.8s var(--ease) forwards;
}

.service-link:hover {
  color: var(--brand);
}

.service-link .index {
  font-family: var(--serif);
  font-size: 1.1rem;
  color: var(--brand-glow);
}

.service-link .copy {
  display: grid;
  gap: 0.25rem;
}

.service-link strong {
  font-size: 1.15rem;
  font-weight: 600;
}

.service-link .copy span {
  color: var(--ink-soft);
}

.service-link .arrow {
  font-size: 1.25rem;
  transition: transform 0.3s var(--ease);
}

.service-link:hover .arrow {
  transform: translateX(6px);
}

.news-preview {
  background:
    linear-gradient(180deg, transparent, rgba(13, 79, 76, 0.04)),
    transparent;
}

.news-layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(2rem, 6vw, 4rem);
  align-items: start;
}

.more {
  margin-top: 1.5rem;
}

.news-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.news-item {
  display: grid;
  grid-template-columns: 3.2rem auto;
  grid-template-areas:
    'date tag'
    'date title';
  column-gap: 1rem;
  row-gap: 0.25rem;
  padding: 1.15rem 0;
  border-bottom: 1px solid var(--line);
  transition: transform 0.3s var(--ease);
}

.news-item:hover {
  transform: translateX(4px);
}

.news-item time {
  grid-area: date;
  font-family: var(--serif);
  font-size: 1.05rem;
  color: var(--brand);
}

.news-item .tag {
  grid-area: tag;
  width: fit-content;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--accent-deep);
}

.news-item strong {
  grid-area: title;
  font-weight: 600;
  line-height: 1.45;
}

@media (max-width: 860px) {
  .news-layout {
    grid-template-columns: 1fr;
  }

  .service-link {
    grid-template-columns: 3rem 1fr auto;
  }
}
</style>
