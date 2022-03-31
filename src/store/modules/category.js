// 分类模块
import { findAllCategory } from '../../api/category'
import { topCategory } from '../../api/constants'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合，给一个初始值(和后台返回的一样)，防止白屏
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    // 修改分类的数据
    setList (state, payload) {
      state.list = payload
    },
    // 定时show和hide方法，修改当前分类数据里面的open
    show (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = true
    },
    hide (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = false
    }
  },
  actions: {
    // 获取分类数据
    getList (ctx) {
      findAllCategory().then(res => {
        // 给每个分类加上控制二级分类显示或隐藏的数据
        res.result.forEach(top => top.open = false)
        ctx.commit('setList', res.result)
      })
    }
  }
}
