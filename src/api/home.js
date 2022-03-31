// 定义分类相关的API接口函数
import request from '../utils/request'

// 获取品牌
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

// 获取轮播图组件
export const findBanner = () => {
  return request('/home/banner', 'get')
}
