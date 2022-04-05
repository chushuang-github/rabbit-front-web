// 定义分类相关的API接口函数
import request from '../utils/request'

// 获取所有分类(顶级、二级分类 + 对应的商品)
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

// 获取顶级分类数据
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

// 获取二级类目下面的筛选数据
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

// 获取二级类目下面的商品列表数据
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'post', params)
}
