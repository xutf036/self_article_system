<script setup>
import { userUpdatePassword } from '@/api/user'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const formRef = ref()
const formModel = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '原密码为 6-15 位非空字符', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '新密码为 6-15 位非空字符', trigger: 'blur' },
    // 自定义表单校验
    {
      validator: (rule, value, callback) => {
        if (value === formModel.value.old_pwd) {
          callback(new Error('新密码和旧密码不能一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '新密码为 6-15 位非空字符', trigger: 'blur' },
    {
      validator: (rull, value, callback) => {
        if (value !== formModel.value.new_pwd) {
          callback(new Error('新密码两次输入不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const userStore = useUserStore()
const router = useRouter()

const onReset = () => {
  formRef.value.resetFields()
}
const onSubmit = async () => {
  await formRef.value.validate()
  await userUpdatePassword(formModel.value)
  ElMessage.success('修改密码成功')
  // 修改密码后，清除本地存储的 token 和 个人信息，拦截到登录页
  userStore.setToken = ''
  userStore.setUser({})
  router.push('/login')
}
</script>

<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px">
          <el-form-item prop="old_pwd" label="原密码">
            <el-input show-password v-model="formModel.old_pwd" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item prop="new_pwd" label="新密码">
            <el-input show-password v-model="formModel.new_pwd" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="re_pwd" label="确认新密码">
            <el-input show-password v-model="formModel.re_pwd" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary">修改密码</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
