# Vue 响应式原理笔记

## 核心思路

Vue 3 使用 `Proxy` 代理对象读写，在 **get** 时收集依赖，在 **set** 时触发更新。

## 关键步骤

1. 创建响应式对象
2. 渲染函数执行时读取属性，触发依赖收集
3. 数据变化后，通知相关副作用重新执行

## 示例

```
const state = reactive({ count: 0 })
effect(() => {
  console.log(state.count)
})
state.count++
```

## 复习要点

- `ref` 与 `reactive` 的适用场景
- 为何解构会丢失响应性
- `computed` 的懒计算与缓存
