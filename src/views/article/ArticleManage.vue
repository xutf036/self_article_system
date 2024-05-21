<script setup>
import ChannelSelect from './components/ChannelSelect.vue'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artDeleteService, artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'

// 请求参数
const params = ref({
  pagenum: 1, // 当前页码
  pagesize: 5, // 每页几条文章
  cate_id: '', // 文章分类 id  （可选）
  state: '' // 文章状态 （可选）
})
// 文章总条数
const total = ref(0)
const loading = ref(false)

// 获取渲染文章列表
const articleList = ref([])

const getArtList = async () => {
  loading.value = true

  const res = await artGetListService(params.value) // .value!!!!
  // console.log(res)
  articleList.value = res.data.data
  total.value = res.data.total
  // console.log(total.value)

  loading.value = false
}
getArtList()

// 分页逻辑 两个相应的处理函数会获取最新的 页码值 / 每页条数值 作为形参
// 当前页变化
const handleCurrentChange = (pagenum) => {
  params.value.pagenum = pagenum
  getArtList()
}
// 每页数据条数变化
const handleSizeChange = (size) => {
  // 按照新的每页条数，从第一页开始 重新渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  getArtList()
}

// 检索文章
const onSearch = () => {
  params.value.pagenum = 1
  getArtList()
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArtList()
}

// 查看文章逻辑
const onReadArticle = (row) => {
  console.log('查看文章详情')
  // const read = true
  row.publish = true
  // console.log(row.publish)
  // console.log(row.id)
  articleEditRef.value.open(row)
}
// 编辑文章逻辑
const articleEditRef = ref()
const onEditArticle = (row) => {
  console.log('编辑文章')
  row.publish = false
  // console.log(row)
  articleEditRef.value.open(row)
}
// 添加文章逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 删除文章逻辑
const onDeleteArticle = async (row) => {
  console.log('删除文章')
  await ElMessageBox.confirm('你确定要删除这篇文章吗', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteService(row.id)
  ElMessage.success('文章删除成功')
  getArtList()
}

// 发布文章 / 修改文章 后的回显
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加文章，则渲染时可以跳转到最新一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
    getArtList()
  } else {
    // 如果是修改文章，修改完直接重新渲染当前页面即可
    getArtList()
  }
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary">发布文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <!-- 因为在 发布文章 时，会再次用到文章分类选择器，所以可以封装为一个组件 -->
        <!-- Vue2 v-model => :value + @update -->
        <!-- Vue3 v-model => :modelValue + @update: modelValue -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" style="width: 150px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域  data! dat a!!!! data!!!!  aaaaaaaaaaaaaa! 不是date c！-->
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column prop="title" label="文章标题">
        <template #default="{ row }">
          <el-link @click="onReadArticle(row)" :underline="false" type="primary">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发布时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="onEditArticle(row)" plain circle :icon="Edit" type="primary"></el-button>
          <el-button @click="onDeleteArticle(row)" plain circle :icon="Delete" type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="当前没有文章，快去发布一篇文章吧~"></el-empty>
      </template>
    </el-table>

    <!-- 分页管理 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next, "
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 编辑文章 使用 Elment-Plus 中抽屉组件 -->
    <article-edit @success="onSuccess" ref="articleEditRef"></article-edit>
  </page-container>
</template>
