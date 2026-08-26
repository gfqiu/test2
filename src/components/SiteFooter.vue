<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <p class="name">青澜门户</p>
        <p class="desc">统一入口，汇聚资讯、服务与协作，让日常工作更顺畅。</p>
      </div>
      <div>
        <p class="label">导航</p>
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/news">资讯</RouterLink>
        <RouterLink to="/services">服务</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </div>
      <div>
        <p class="label">联系</p>
        <a href="mailto:hello@qinglan.portal">hello@qinglan.portal</a>
        <p>服务时段 工作日 9:00 – 18:00</p>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© {{ year }} 青澜门户</p>
      <p>Vue 3 构建的简易企业门户</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 3.5rem 0 1.75rem;
  color: rgba(255, 255, 255, 0.78);
  background:
    linear-gradient(160deg, var(--brand-deep), var(--brand) 55%, #145a56);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 2rem;
  padding-bottom: 2.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.name {
  margin: 0 0 0.7rem;
  font-family: var(--serif);
  font-size: 1.45rem;
  font-weight: 700;
  color: #fff;
}

.desc {
  margin: 0;
  max-width: 22rem;
  line-height: 1.7;
}

.label {
  margin: 0 0 0.85rem;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.footer-grid a,
.footer-grid p {
  display: block;
  margin: 0 0 0.55rem;
}

.footer-grid a:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.25rem;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
  }
}
</style>
