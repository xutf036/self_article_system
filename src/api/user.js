import request from '@/utils/request.js'

// 注册服务
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 登录服务
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

// 获取用户基本信息
export const userGetInfoService = () => {
  return request.get('/my/userinfo')
}

// 更新用户基本资料
export const userUpdateInfo = (data) => request.put('/my/userinfo', data)

// 更新用户头像
export const userUpdateAvatar = (avatar) => request.patch('/my/update/avatar', { avatar })
