<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores'

// VUE3 compositionAPI中
// 获取路由对象 const router = useRouter()
// 获取路由参数 const route = useRoute()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const goList = () => {
  // setup 中 this是undefined，不能用这种方法获取路由对象
  // this.$router.push('/list')
  console.log(router, route)
  router.push('/list')
}
</script>

<template>
  <div>
    <hr />
    <!-- 一级路由出口 -->
    <router-view></router-view>
    <hr />
    <hr />

    我是APP
    <test-demo></test-demo>
    <button @click="$router.push('/home')">跳转到首页</button>
    <button @click="goList">跳转到列表页</button>

    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <hr />
    <p>{{ userStore.token }}</p>
    <el-button type="primary" @click="userStore.setToken('666')"
      >登录</el-button
    >
    <el-button type="" @click="userStore.removeToken()">退出</el-button>
  </div>
</template>

<style scoped></style>
