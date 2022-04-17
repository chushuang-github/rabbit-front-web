import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'

// 引入组件
const Layout = () => import('../views/Layout.vue')
const Home = () => import('../views/home/index.vue')
const TopCategory = () => import('../views/category/index.vue')
const SubCategory = () => import('../views/category/sub.vue')
const Goods = () => import('../views/goods/index.vue')
const Cart = () => import('../views/cart/index.vue')

const Login = () => import('../views/login/index.vue')
const LoginCallback = () => import('../views/login/callback.vue')

const Checkout = () => import('../views/member/pay/checkout.vue')
const Pay = () => import('../views/member/pay/index.vue')
const PayResult = () => import('../views/member/pay/result.vue')

const MemberLayout = () => import('../views/member/Layout.vue')
const MemberHome = () => import('../views/member/home/index.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: Checkout },
      { path: '/member/pay', component: Pay },
      { path: '/pay/callback', component: PayResult },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome }
        ]
      }
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

// 前置导航守卫
router.beforeEach((to, from) => {
  // 需要登录才能访问的路由：地址以 /member 开头
  const { token } = store.state.user.profile
  if (!token && to.path.startsWith('/member')) {
    return `/login?redirectUrl=${encodeURIComponent(to.fullPath)}`
  }
})

export default router
