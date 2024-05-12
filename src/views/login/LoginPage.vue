<script setup>
import { ref, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isRegister = ref(false)
const router = useRouter()

// element-plus中表单校验
// 1.收集整个表单中所有数据 el-form => :model="formModel"
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 2.编写校验表单所需规则(与表单中数据一一对应) el-form => :rules="rulse"
// 2.1 规则格式是 数组包对象，一条规则占一个对象
// 2.2 required 非空校验，min/max长度校验，pattern正则校验
// 2.3 validator: (rules, value, callback) => {}
//       rules 当前校验规则相关信息
//       value 当前表单中值
//       callback 回调函数，无论校验成功还是失败，必须执行回调函数
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,10}$/,
      message: '请输入 1-10 位大小写字母或数字',
      trigger: 'blur'
    }
    // { min: 5, max: 10, message: '用户名必须是 5-10 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{1,15}$/,
      message: '密码必须是 1-15 位非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码不一致'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
}
// 3.在要校验的表单元素与formModel中数据进行绑定 v-model="formModel.username"
// 4.在要校验的表单元素上一层（el-form-item）对下面数据绑定相应个规则 prop="username"

const form = ref()
// 注册前的预校验,用到了element-plus中form组件暴露出来的方法，所以需要获取form组件 （ref）
const register = async () => {
  await form.value.validate()
  // 成功 => 发送请求
  await userRegisterService(formModel.value) // .value!!!!
  // 提示用户
  ElMessage.success('注册成功')
}

// 登录前的预校验
const login = async () => {
  await form.value.validate()
  // 校验成功 => 发送请求
  const res = await userLoginService(formModel.value)
  // console.log(res)
  // 将 token 存入本地
  const userStore = useUserStore()
  userStore.setToken(res.data.token)
  // 我们安装了element-plus两个插件实现了按需自动导入，所以不需要导入ElMessage
  // 但是ESLint会显示未定义ElMessage，需要在配置文件中进行配置
  ElMessage.success('登录成功')
  router.push('/')
}

// 登录页注册页切换的时候重置表单数据
watch(isRegister, () => {
  // element-plus组件暴露出的方法，重置表单数据
  form.value.resetFields()
})
</script>
<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册页表单 -->
      <el-form ref="form" :model="formModel" :rules="rules" v-if="isRegister" size="large">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" :prefix-icon="Lock" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input v-model="formModel.repassword" :prefix-icon="Lock" type="password" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>注册</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link :underline="false" type="info" @click="isRegister = false">← 返回</el-link>
        </el-form-item>
      </el-form>

      <!-- 登录页表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" v-else size="large">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" :prefix-icon="Lock" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link :underline="false" type="info" @click="isRegister = true">注册 →</el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
