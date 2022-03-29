import { createStore } from 'vuex'
// vuex持久化插件
import createPersistedState from 'vuex-persistedstate'

import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  modules: {
    cart,
    category,
    user
  },
  // 配置vuex持久化插件
  plugins: [
    // vuex数据持久化：这个插件默认存储在localStorage里面
    createPersistedState({
      // 本地存储名字
      key: 'rabbit-front-web-store',
      // 指定需要本地缓存的模块 (就是modules里面定义的模块)
      paths: ['user', 'cart']
    })
  ]
})
