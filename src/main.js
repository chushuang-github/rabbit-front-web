import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入重置样式代码和共用样式代码
import 'normalize.css'
import './assets/styles/common.less'
// 引入字体图标库
import './assets/styles/iconfont.css'

createApp(App).use(store).use(router).mount('#app')
