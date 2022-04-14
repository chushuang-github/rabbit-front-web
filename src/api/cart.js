// 定义分类相关的API接口函数
import request from '../utils/request'

// 如果用户很长时间没有登录该系统，系统里面添加到购物车里面的商品已经没有库存了(是无效的商品了)
// 我们需要在每次进入系统的时候，进行发送请求，查看购物车里面的商品是否是有效
// 如果商品是无效的，就需要去修改vuex里面购物车的数据
// 发送请求，拿着skuId去发送请求，后台告诉我们该商品是否是有效的
export const getNewCartGoods = (skuId) => {
  return request(`goods/stock/${skuId}`, 'get')
}
