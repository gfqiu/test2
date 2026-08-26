<script setup>
const points = [
  {
    title: '统一入口',
    desc: '把分散系统收到同一门户，减少书签与记忆成本。',
  },
  {
    title: '清晰分层',
    desc: '首页只做到达，资讯与服务分区明确，避免信息堆砌。',
  },
  {
    title: '随时可及',
    desc: '桌面与移动端均可浏览，关键路径保持简洁可达。',
  },
]
</script>

<template>
  <section class="page section">
    <div class="container about">
      <div class="intro">
        <p class="section-kicker reveal">关于</p>
        <h1 class="section-title reveal reveal-delay-1">青澜门户是什么</h1>
        <p class="section-lead reveal reveal-delay-2">
          青澜是一个基于 Vue 构建的简易企业门户示例：以品牌与到达感为先，把资讯与服务收敛到少数清晰路径。
        </p>
      </div>

      <ul class="points">
        <li
          v-for="(item, index) in points"
          :key="item.title"
          :style="{ animationDelay: `${0.1 * index + 0.2}s` }"
        >
          <strong>{{ item.title }}</strong>
          <p>{{ item.desc }}</p>
        </li>
      </ul>

      <div class="cta-band reveal reveal-delay-3">
        <div>
          <h2>准备好开始了吗？</h2>
          <p>从服务目录进入常用能力，或先浏览最新资讯。</p>
        </div>
        <div class="actions">
          <RouterLink class="btn btn-primary" to="/services">进入服务</RouterLink>
          <RouterLink class="btn btn-outline" to="/news">查看资讯</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding-top: clamp(6.5rem, 12vw, 8rem);
}

.about {
  display: grid;
  gap: 2.5rem;
}

.points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.points li {
  opacity: 0;
  animation: rise 0.85s var(--ease) forwards;
}

.points strong {
  display: block;
  margin-bottom: 0.45rem;
  font-family: var(--serif);
  font-size: 1.2rem;
}

.points p {
  margin: 0;
  color: var(--ink-soft);
}

.cta-band {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem 0 0;
  border-top: 1px solid var(--line);
}

.cta-band h2 {
  margin: 0 0 0.4rem;
  font-family: var(--serif);
  font-size: 1.45rem;
}

.cta-band p {
  margin: 0;
  color: var(--ink-soft);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 860px) {
  .points {
    grid-template-columns: 1fr;
  }

  .cta-band {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
