import { createRouter, createWebHistory } from 'vue-router'

// 引入组件
const Layout = () => import('../views/Layout.vue')
const Home = () => import('../views/home')
const TopCategory = () => import('../views/category/index.vue')
const SubCategory = () => import('../views/category/sub.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
