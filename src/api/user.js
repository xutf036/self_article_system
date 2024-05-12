import request from '@/utils/request.js'

// 注册服务
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 登录服务
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}
