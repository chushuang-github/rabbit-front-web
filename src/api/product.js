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

// 查找商品评价详情信息
// 这里使用的地址是yapi上面的Mock地址请求数据 (模拟一下后台数据没有返回的情况)
export const findGoodsCommentInfo = ({ id }) => {
  // axios虽然配置了baseURL，但是如果请求地址是https开头的，是不会追加baseURL默认地址的
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

// 获取商品评价列表列表
// page
// pageSize
// 是否有图片(hasPicture)
// 列表标签选择(tag)：音质好、充电快、材质很软、性价比高
// 排序字段(sortField)：可选值 最热(praiseCount)、最新(createTime)
// 列表排序方式(sortMethod)：desc(默认降序)、asc
export const findGoodsCommentList = (id, params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
