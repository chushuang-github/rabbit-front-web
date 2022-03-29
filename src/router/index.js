import { createRouter, createWebHistory } from 'vue-router'

// 引入组件
const Layout = () => import('../views/Layout.vue')
const Home = () => import('../views/home')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
