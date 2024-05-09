import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // createWebHistory 不带#
  // createWebHashHistory 带#
  // import.meta.env.BASE_URL 路由基准地址 vite中环境变量 在vite配置文件中base项配置
  // 默认是 '/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
