<script setup>
const groups = [
  {
    name: '身份与协作',
    items: [
      { title: '统一认证', desc: '账号登录、密码重置与多因素验证。' },
      { title: '企业邮箱', desc: '邮件、日历与通讯录入口。' },
      { title: '即时协作', desc: '消息、群组与文档共创。' },
    ],
  },
  {
    name: '行政与资源',
    items: [
      { title: '资源申请', desc: '会议室、设备与临时权限申请。' },
      { title: '报销助手', desc: '费用填报、单据状态与进度查询。' },
      { title: '访客登记', desc: '来访预约与当日通行码。' },
    ],
  },
  {
    name: '知识与支持',
    items: [
      { title: '知识库', desc: '制度、流程与操作手册。' },
      { title: '服务工单', desc: 'IT 与行政问题一键提单。' },
      { title: '培训中心', desc: '新人课程与专题直播回放。' },
    ],
  },
]
</script>

<template>
  <section class="page section">
    <div class="container">
      <p class="section-kicker reveal">服务</p>
      <h1 class="section-title reveal reveal-delay-1">服务目录</h1>
      <p class="section-lead reveal reveal-delay-2">
        按场景归类的常用入口，点击即可进入对应系统或申请流程。
      </p>

      <div
        v-for="(group, gIndex) in groups"
        :key="group.name"
        class="group"
        :style="{ animationDelay: `${0.1 * gIndex + 0.15}s` }"
      >
        <h2>{{ group.name }}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.title">
            <button type="button" class="entry">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding-top: clamp(6.5rem, 12vw, 8rem);
}

.group {
  margin-top: 2.75rem;
  opacity: 0;
  animation: rise 0.85s var(--ease) forwards;
}

.group h2 {
  margin: 0 0 1rem;
  font-family: var(--serif);
  font-size: 1.35rem;
  font-weight: 600;
}

.group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.entry {
  width: 100%;
  min-height: 100%;
  padding: 1.2rem 1.15rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid var(--line);
  border-radius: 1rem;
  transition:
    transform 0.3s var(--ease),
    border-color 0.25s ease,
    background 0.25s ease;
}

.entry:hover {
  transform: translateY(-3px);
  border-color: rgba(13, 79, 76, 0.28);
  background: #fff;
}

.entry strong {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 1.05rem;
}

.entry span {
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.55;
}

@media (max-width: 860px) {
  .group ul {
    grid-template-columns: 1fr;
  }
}
</style>
