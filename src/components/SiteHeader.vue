<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)
const scrolled = ref(false)

const links = [
  { to: '/', label: '首页' },
  { to: '/news', label: '资讯' },
  { to: '/services', label: '服务' },
  { to: '/about', label: '关于' },
]

const isHome = computed(() => route.path === '/')

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function closeMenu() {
  open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="site-header"
    :class="{
      'is-scrolled': scrolled || !isHome,
      'is-home': isHome && !scrolled,
      'is-open': open,
    }"
  >
    <div class="container header-inner">
      <RouterLink class="brand" to="/" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true" />
        <span class="brand-text">青澜门户</span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="site-nav"
        @click="open = !open"
      >
        <span class="sr-only">菜单</span>
        <span class="bar" />
        <span class="bar" />
      </button>

      <nav id="site-nav" class="nav" :aria-hidden="!open && undefined">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink class="nav-cta btn btn-primary" to="/services" @click="closeMenu">
          进入服务
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 40;
  transition:
    background 0.35s ease,
    box-shadow 0.35s ease,
    backdrop-filter 0.35s ease;
}

.site-header.is-home {
  color: #fff;
}

.site-header.is-scrolled {
  color: var(--ink);
  background: rgba(242, 247, 246, 0.88);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 var(--line);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4.25rem;
  gap: 1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  z-index: 2;
}

.brand-mark {
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 0.45rem;
  background:
    radial-gradient(circle at 70% 28%, var(--accent) 0 28%, transparent 29%),
    linear-gradient(145deg, var(--brand-glow), var(--brand-deep));
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.is-scrolled .brand-mark {
  box-shadow: none;
}

.brand-text {
  font-family: var(--serif);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.35rem 1.25rem;
}

.nav-link {
  position: relative;
  padding: 0.35rem 0.15rem;
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.86;
  transition: opacity 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  opacity: 1;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.2rem;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  opacity: 0.55;
}

.nav-cta {
  margin-left: 0.4rem;
  min-height: 2.4rem;
  padding: 0.45rem 1.05rem;
  font-size: 0.9rem;
}

.menu-toggle {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  background: transparent;
  z-index: 2;
}

.menu-toggle .bar {
  display: block;
  width: 1.25rem;
  height: 2px;
  margin: 0.22rem 0;
  background: currentColor;
  transition: transform 0.3s var(--ease);
}

.is-open .menu-toggle .bar:first-of-type {
  transform: translateY(5px) rotate(45deg);
}

.is-open .menu-toggle .bar:last-of-type {
  transform: translateY(-5px) rotate(-45deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: grid;
  }

  .nav {
    position: fixed;
    inset: 0;
    flex-direction: column;
    justify-content: center;
    gap: 1.4rem;
    background:
      radial-gradient(800px 500px at 50% 0%, rgba(26, 122, 116, 0.28), transparent 60%),
      var(--brand-deep);
    color: #fff;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-8px);
    transition:
      opacity 0.3s ease,
      transform 0.3s var(--ease);
  }

  .is-open .nav {
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }

  .nav-link {
    font-family: var(--serif);
    font-size: 1.6rem;
  }

  .nav-cta {
    margin-left: 0;
  }
}
</style>
