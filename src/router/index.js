import { useUserStore } from '@/stores'
import {
  createRouter,
  // createWebHistory,
  createWebHashHistory
} from 'vue-router'

const router = createRouter({
  // createWebHistory 不带#
  // createWebHashHistory 带#
  // import.meta.env.BASE_URL 路由基准地址 vite中环境变量 在vite配置文件中base项配置
  // 默认是 '/'
  history: createWebHashHistory(import.meta.env.BASE_URL),
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

// 登录访问拦截 => 默认是直接放行 (全局前置守卫)
// 返回值是 true / undefined 放行
//          false 拦截到 from 的页面
//          具体路径或路径对象，拦截到相对应的地址
// 参数 to 去哪 即将要进入的目标
//      from 从哪来 当前导航正要离开的路由
// const userStore = useUserStore() // 这行代码放这里会报错
router.beforeEach((to) => {
  // 如果当前访问的是非登录页，且没有token，=> 拦截到登录页 ，其余情况正常放行（默认）
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
