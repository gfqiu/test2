<script setup>
const articles = [
  {
    date: '2026-08-24',
    tag: '公告',
    title: '青澜门户 2.0 上线：导航更清晰，服务更快达',
    summary: '全新信息架构上线，常用服务与资讯分区更明确，支持移动端快速检索。',
  },
  {
    date: '2026-08-18',
    tag: '动态',
    title: '本周系统维护窗口调整至周五晚间',
    summary: '为减少工作日影响，统一认证与邮件服务将于周五 22:00–23:30 进行例行维护。',
  },
  {
    date: '2026-08-12',
    tag: '指南',
    title: '新人入职指南：从账号开通到工具配置',
    summary: '整理入职首周必做事项：账号申请、协作工具、权限开通与常见问题。',
  },
  {
    date: '2026-08-05',
    tag: '公告',
    title: '知识库开放部门共建权限',
    summary: '各部门可维护本团队词条，门户将按更新时间自动排序展示。',
  },
]
</script>

<template>
  <section class="page section">
    <div class="container">
      <p class="section-kicker reveal">资讯</p>
      <h1 class="section-title reveal reveal-delay-1">门户动态与公告</h1>
      <p class="section-lead reveal reveal-delay-2">
        这里汇集上线说明、维护通知与使用指南，帮助你跟上最新变化。
      </p>

      <ul class="article-list">
        <li
          v-for="(item, index) in articles"
          :key="item.title"
          class="article"
          :style="{ animationDelay: `${0.08 * index + 0.2}s` }"
        >
          <div class="meta">
            <time>{{ item.date }}</time>
            <span>{{ item.tag }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.summary }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding-top: clamp(6.5rem, 12vw, 8rem);
}

.article-list {
  list-style: none;
  margin: 2.75rem 0 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.article {
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--line);
  opacity: 0;
  animation: rise 0.8s var(--ease) forwards;
}

.meta {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  margin-bottom: 0.55rem;
  font-size: 0.88rem;
  color: var(--ink-soft);
}

.meta span {
  color: var(--accent-deep);
  font-weight: 600;
}

.article h2 {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(1.2rem, 2.4vw, 1.45rem);
  font-weight: 600;
  line-height: 1.4;
}

.article p {
  margin: 0.55rem 0 0;
  max-width: 46rem;
  color: var(--ink-soft);
}
</style>
