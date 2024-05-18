<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artEditService, artGetDetailService, artPublishService } from '@/api/article'
import axios from 'axios'
import { baseURL } from '@/utils/request.js'

const visibleDrawer = ref(false)
// 准备编辑文章表单数据
const formModel = ref({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
})
const formRef = ref()
const editorRef = ref()

// 封面处理逻辑
const imgUrl = ref('')
const onSelectFile = (UploadFile) => {
  console.log(UploadFile)
  // 将图片进行本地预览
  imgUrl.value = URL.createObjectURL(UploadFile.raw)
  formModel.value.cover_img = UploadFile.raw
}
// 向外暴露一个 open 方法，控制对话框的显示和隐藏
// 根据 open 方法传递过来的参数，来确定是 添加分类 / 编辑分类
// 因为 添加分类 不需要数据，所以传过来的是空数据
// 而   编辑分类 意味着要将之前的分类信息先回显，需要先将之前的分类信息传过来
const open = async (row) => {
  visibleDrawer.value = true
  // console.log('row', row)
  if (row.id) {
    console.log('编辑文章')
    formModel.value = row
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下
    formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    console.log(formModel.value)
  } else {
    // console.log('发布文章')
    // 清空表单数据
    formModel.value = { title: '', cate_id: '', content: '', cover_img: '', state: '' }
    // 封面 和 富文本编辑器内容需要单独重置
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
// 文章发布 逻辑
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state
  // 接口需要的是 formdata 数据，将 普通对象 转换为 formData 对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  console.log('formModel.value', formModel.value)

  if (formModel.value.id) {
    console.log('编辑文章')
    await artEditService(fd)
    ElMessage.success('修改文章成功')
    emit('success', 'edit')
  } else {
    // console.log('发布新文章')
    console.log(formModel.value)
    await artPublishService(fd)
    ElMessage.success('添加文章成功')
    emit('success', 'add')
  }
  visibleDrawer.value = false
  // await artPublishService()
}

defineExpose({
  open
})
</script>
<template>
  <!-- 因为 发布文章 与 编辑文章 均需要显示一个抽屉组件，故将其进行封装 -->
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" size="40%">
    <!-- 表单结构 -->
    <el-form ref="formRef" :value="formModel" :rules="rules" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" style="width: 100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 Element-Plus 中的文件自动上传，不需要配置 action 等参数
            只需要前端的本地预览图片即可，无需在提交之前上传图片
            语法：URL.createObjectURL(...) 创建本地预览的地址，来预览    
        -->
        <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="onSelectFile">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor ref="editorRef" theme="snow" v-model:content="formModel.content" contentType="html"></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>