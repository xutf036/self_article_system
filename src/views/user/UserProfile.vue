<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfo } from '@/api/user.js'

const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()
// 表单校验 在el-form 上绑定的是 :model :rules 不是 :value :rules
const formModel = ref({
  username,
  nickname,
  email,
  id
})
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/, // {1,,10} 而不是 {1, 10} 服啦！
      message: '用户昵称必须为 1-10 位非空字符',
      trigger: 'blur'
    }
    // {
    // pattern: /^\S{1,10}$/,
    //   message: '昵称必须是2-10位的非空字符串',
    //   trigger: 'blur'
    // }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    { required: true, message: '请输入用户邮箱', trigger: 'blur' }
  ]
}
const formRef = ref()
const onSubmit = async () => {
  // 首先对表单内容进行预校验，需要获取表单组件元素
  await formRef.value.validate()
  await userUpdateInfo(formModel.value)
  ElMessage.success('修改个人资料成功')
  // 重新渲染页面上的用户昵称，由于数据是响应式的，所以可以直接修改仓库中的数据
  getUser()
}
</script>
<template>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form size="large" ref="formRef" :model="formModel" :rules="rules" label-width="100px">
          <el-form-item label="登录名称">
            <el-input disabled="true" v-model="formModel.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="formModel.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="formModel.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
