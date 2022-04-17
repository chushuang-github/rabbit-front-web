// 定义分类相关的API接口函数
import request from '../utils/request'

// 获取收藏数据，collectType为收藏的类型
// 1：商品；2为专题；3为品牌
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}
