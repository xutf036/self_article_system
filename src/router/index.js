import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // createWebHistory 不带#
  // createWebHashHistory 带#
  // import.meta.env.BASE_URL 路由基准地址 vite中环境变量 在vite配置文件中base项配置
  // 默认是 '/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserAvatar.vue')
        }
      ]
    }
  ]
})

export default router
