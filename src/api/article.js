import request from '@/utils/request.js'

// 文章分类相关
// 获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}
// 添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add', data)
}
// 编辑文章分类
export const artEditChannelService = (data) => request.put('/my/cate/info', data)
// 删除文章分类
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 文章管理相关
// 获取文章列表
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })
// 发布文章
export const artPublishService = (data) => request.post('/my/article/add', data)
// 获取文章详情 params 参数必须放在一个 {}中！！！！！！！{} { } params: {}
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })
// 更新文章详情
export const artEditService = (data) => request.put('/my/article/info', data)
// 删除文章
export const artDeleteService = (id) =>
  request.delete('/my/article/info', {
    params: { id }
  })
