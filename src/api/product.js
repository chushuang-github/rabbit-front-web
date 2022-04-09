// 定义分类相关的API接口函数
import request from '../utils/request'

// 获取商品详情
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

// 获取同类商品推荐(传入id查询商品相关推荐，不传入id是猜你喜欢)
export const findRelevant = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

// 获取热销版数据
// type的值：
// 1: '24小时热销版',
// 2: '周热销版',
// 3: '总热销版'
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}
