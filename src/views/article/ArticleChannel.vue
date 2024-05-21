<script setup>
import { artDelChannelService, artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

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
  // console.log(row)
  dialog.value.open(row)
}
// 删除文章分类
const onDelChannel = async (row) => {
  console.log(row)
  await ElMessageBox.confirm('你确认要删除该文章分类吗？', '温馨提示', {
    type: 'warning',
    confirButton: '确认',
    concelButton: '取消'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除文章分类成功！')
  // 删除文章分类后重新进行渲染
  getChannelList()
}
// 对话框相关
// 如何使用组件暴露出的方法？ => 1. ref 绑定组件 2. 使用组件暴露出的方法
const dialog = ref()
// 添加文章分类
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
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
        <el-empty description="快添加一个文章分类吧，有了分类才能发布文章哦~" />
      </template>
    </el-table>

    <!-- 点击 添加分类 编辑分类 显示的对话框 -->
    <channel-edit @success="onSuccess" ref="dialog"></channel-edit>
  </page-container>
</template>
