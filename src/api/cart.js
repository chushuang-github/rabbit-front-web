// 定义分类相关的API接口函数
import request from '../utils/request'

// 如果用户很长时间没有登录该系统，系统里面添加到购物车里面的商品已经没有库存了(是无效的商品了)
// 我们需要在每次进入系统的时候，进行发送请求，查看购物车里面的商品是否是有效
// 如果商品是无效的，就需要去修改vuex里面购物车的数据
// 发送请求，拿着skuId去发送请求，后台告诉我们该商品是否是有效的
export const getNewCartGoods = (skuId) => {
  return request(`goods/stock/${skuId}`, 'get')
}

// 根据商品skuId获取商品的specs和skus
export const getGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

// 合并购物车：登录的时候将本地的购物车商品保存到服务端
// 这个接口的参数：Array<ojbect> [{ skuId, count, selected }, {}, {}]
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

// 获取服务端购物车的列表
export const findCartList = () => {
  return request('/member/cart', 'get')
}

// 加入购物车
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}

// 删除购物车商品 (单个删除，批量删除)
// ids是一个数组，数字里面是一个一个skuId的集合
export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', { ids })
}

// 购物车商品选中 和修改数量
export const updateCart = ({ skuId, count, selected }) => {
  return request(`/member/cart/${skuId}`, 'put', { count, selected })
}

// 全选 与 反选
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
