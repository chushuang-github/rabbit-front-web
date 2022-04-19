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

// 我的订单列表
// orderState是订单状态
// 0为全部；1为待付款；2为待发货；3为待收货；4为待评价；5为已完成；6为已取消
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request('/member/order', 'get', { page, pageSize, orderState })
}

// 取消订单
export const cancelOrder = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}

// 删除订单
export const deleteOrder = (orderId) => {
  return request('/member/order', 'delete', { ids: [orderId] })
}

// 待发货 (手动去浏览器调接口，因为我们是买东西的人，不能自己发货)
// https://apipc-xiaotuxian-front.itheima.net/member/order/consignment/1515309928262836226

// 确认收货
export const confirmOrder = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, 'put')
}

// 查询物流
export const logisticsOrder = (orderId) => {
  return request(`/member/order/${orderId}/logistics`, 'get')
}

// 获取再次购买的订单结算信息
export const findOrderRepurchase = (orderId) => {
  return request(`/member/order/repurchase/${orderId}`, 'get')
}
