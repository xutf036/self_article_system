import request from '@/utils/request.js'

// 获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}
