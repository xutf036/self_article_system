import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'https://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  // 1.配置基地址，超时时间
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 2.携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    // 3.响应成功，并且业务处理成功,摘取核心业务数据
    if (response.data.code === 0) {
      return response
    }
    // 4.响应成功，但业务处理失败
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  (error) => {
    // 对响应错误做点什么
    // 5.错误的特殊情况 => 401 权限不足 或 身份认证过期 => 拦截到登录页
    if (error.response?.status === 401) {
      router.push('/login')
    }

    // 默认错误情况 => 只给提示
    ElMessage.error(error.response.data.message || '服务异常')
    return Promise.reject(error)
  }
)
