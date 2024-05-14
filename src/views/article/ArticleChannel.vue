<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

// 获取数据
const channelList = ref([])
const loading = ref(false)

const getChannelList = async () => {
  // 发送请求之前可以添加loading效果
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
  // 得到数据后删除loading效果
  // channelList.value = []
  // console.log(channelList.value)
}
// 一进入页面就获取数据
getChannelList()

// 编辑文章分类
const onEditChannel = (row) => {
  console.log(row)
}
// 删除文章分类
const onDelChannel = (row) => {
  console.log(row)
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary">添加分类</el-button>
    </template>

    <!-- 文章分类情况表格 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column width="100" type="index" label="序号"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column width="100" label="操作">
        <template #default="{ row }">
          <!-- 通过 slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据
            row 表示表格当前行数据 $index 表示当行序号 
            默认接受的是包含这些数据的一个对象，所以可以进行解构
          -->
          <el-button :icon="Edit" plain type="primary" circle @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" plain type="danger" circle @click="onDelChannel(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="当前没有数据，快去添加一个文章分类吧~" />
      </template>
    </el-table>
  </page-container>
</template>
