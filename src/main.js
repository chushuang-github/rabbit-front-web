import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './mock'

// 导入自己的UI组件库
import UI from './components/library'

// 引入重置样式代码和共用样式代码
import 'normalize.css'
import './assets/styles/common.less'
// 引入字体图标库
import './assets/styles/iconfont.css'

const app = createApp(App)
app.use(store)
app.use(router)
// 使用app.use注册自己的UI组件库
app.use(UI)
app.mount('#app')
