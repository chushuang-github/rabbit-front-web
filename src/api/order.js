// 定义分类相关的API接口函数
import request from '../utils/request'

// 生成订单
// 不用传任何参数，因为后台也有一份购物车数据，后台是知道用于选择了哪些商品的
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

// 添加收货地址
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}

// 修改收货地址
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

// 提交订单 (提交订单之后，可以获取订单id)
export const submitOrder = (order) => {
  return request('/member/order', 'post', order)
}

// 根据订单id，获取订单详情
export const findOrderDetail = (orderId) => {
  return request(`/member/order/${orderId}`, 'get')
}
