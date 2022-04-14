// 购物车模块
import { getNewCartGoods } from '../../api/cart'
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表 (全部的商品列表，有失效的商品，也有不失效的商品)
      list: []
    }
  },
  getters: {
    // 有效商品列表：库存stock大于0；并且isEffective值为true
    validList (state) {
      return state.list.filter(goods => {
        return goods.stock > 0 && goods.isEffective
      })
    },
    // 有效商品个数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // return getters.validList.reduce((p, c) => p + c.count * 100 * c.nowPrice, 0) / 100
      // Math.round()是对一个数组进行四舍五入
      return getters.validList.reduce((p, c) => p + c.count * Math.round(100 * c.nowPrice), 0) / 100
    },
    // 无效商品列表
    inValidList (state) {
      return state.list.filter(goods => {
        return goods.stock <= 0 || !goods.isEffective
      })
    },
    // 已选商品列表(从有效的商品列表里面取)
    selectedList (state, getters) {
      return getters.validList.filter(goods => goods.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count * Math.round(100 * c.nowPrice), 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.validList.length !== 0
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 约定加入购物车字段 (必须和后端保持一致)，下面是payload的属性
      // 他们是：skuId name(商品名称) attrsText picture price nowPrice selected stock(库存) count(数量)
      // isEffective(是否为有效的商品-加入购物车的时候有商品，后来商品没了) id(商品id)
      // 插入数据规则：根据skuId判断是否有相同的商品
      // 1. 先找是否有相同的商品：如果有相同的商品，商品数量累加，并且该商品到购物车列表的第一条
      // 2. 没有找到相同的商品，直接在购物车列表前面添加该商品
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        // 原有商品的数量
        const count = state.list[sameIndex].count
        // 新添加的商品数量 + 购物车原本的商品数量
        payload.count += count
        // 在购物车里面删除原来的商品
        state.list.splice(sameIndex, 1)
      }
      // 添加商品
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods是商品信息，goods结构{ nowPrice: '最新价格', stock: '库存', isEffective: '商品是否有效' }
      // 注意：goods里面的信息是不固定的，传了什么字段，就去修改对应商品该字段的信息 (字段的值必须合理)
      // goods商品对象必须有skuId字段
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(goods => goods.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  // 登录和未登录，两种状态都在actions里面进行区分
  actions: {
    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          // 未登录
          // 同时发送请求 (购物车里面有几个商品，就要去发送几个请求，等所有请求成功，一并去修改本地的数据)
          // Promise.all([]).then(([]) => {})
          // 创建promise数组
          const promiseArr = ctx.state.list.map(goods => getNewCartGoods(goods.skuId))
          Promise.all(promiseArr).then(dataList => {
            // 更新本地购物车
            dataList.forEach((data, index) => {
              data.result.skuId = ctx.state.list[index].skuId
              ctx.commit('updateCart', { ...data.result })
            })
            // 调用resolve
            resolve()
          })
        }
      })
    },
    // 删除购物车商品，payload就是skuId
    deleteCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          // 未登录
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车 (选中状态，数量)
    // payload: 需要传skuId  可以有:selected count
    updateCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选 全不选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          // 未登录
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除购物车
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          // 未登录
          // isClear为true，是失效的商品列表；否则为选中的商品列表
          const list = isClear ? ctx.getters.inValidList : ctx.getters.selectedList
          list.forEach(goods => {
            ctx.commit('deleteCart', goods.skuId)
          })
          resolve()
        }
      })
    },
    // 修改规格(sku发生变化)
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          // 未登录
          // 1. 找出旧的商品信息
          // 2. 删除旧的商品信息
          // 3. 根据新的sku信息和旧的商品信息，合并成一条新的购物车商品
          // 4. 添加这条新的购物车数据
          const oldGoods = ctx.state.list.find(goods => goods.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock, oldPrice: price } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock, price }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    }
  }
}
