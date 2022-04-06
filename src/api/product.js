// 定义分类相关的API接口函数
import request from '../utils/request'

// 获取商品详情
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}
