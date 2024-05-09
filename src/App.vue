<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

// VUE3 compositionAPI中
// 获取路由对象 const router = useRouter()
// 获取路由参数 const route = useRoute()
const router = useRouter()
const route = useRoute()
const goList = () => {
  // setup 中 this是undefined，不能用这种方法获取路由对象
  // this.$router.push('/list')
  console.log(router, route)
  router.push('/list')
}
</script>

<template>
  <div>
    我是APP
    <test-demo></test-demo>
    <button @click="$router.push('/home')">跳转到首页</button>
    <button @click="goList">跳转到列表页</button>

    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
  </div>
</template>

<style scoped></style>
