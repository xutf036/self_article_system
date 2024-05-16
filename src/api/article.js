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
