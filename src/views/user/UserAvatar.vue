<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatar } from '@/api/user'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()

const onSelectFile = (uploadFile) => {
  // 头像图片预览
  // imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 头像预览方法2：基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}
const onUpdateAvatar = async () => {
  await userUpdateAvatar(imgUrl.value)
  await userStore.getUser()
  ElMessage.success('更改头像成功')
}
</script>
<template>
  <page-container title="更换头像">
    <el-upload :on-change="onSelectFile" ref="uploadRef" class="avatar-uploader" :show-file-list="false">
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br />
    <el-button @click="uploadRef.$el.querySelector('input').click()" type="primary" size="large" :icon="Plus">选择图片</el-button>
    <el-button @click="onUpdateAvatar" type="success" size="large" :icon="Upload">上传头像</el-button>
  </page-container>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
