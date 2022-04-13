import { createRouter, createWebHashHistory } from 'vue-router'

// 引入组件
const Layout = () => import('../views/Layout.vue')
const Home = () => import('../views/home/index.vue')
const TopCategory = () => import('../views/category/index.vue')
const SubCategory = () => import('../views/category/sub.vue')
const Goods = () => import('../views/goods/index.vue')
const Login = () => import('../views/login/index.vue')
const LoginCallback = () => import('../views/login/callback.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: LoginCallback }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，或者自己定义滚动的位置
  // vue-router的scrollBehavior配置项，它让你可以自定义路由切换时页面如何滚动
  // 使用的时候，注意vue-router版本，使用的时候，去看不同vue-router版本的官网
  // vue-router 3.x的版本使用的是return { x: 0, y: 0 }
  // vue-router 4.x的版本使用的是return { top: 0, left: 0 }
  scrollBehavior (to, from, savedPosition) {
    return {
      top: 0,
      left: 0,
      behavior: 'smooth'
    }
  }
})

export default router
