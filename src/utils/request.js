// 1.创建一个新的axios实例
// 2.请求拦截器，如果有token就进行头部携带
// 3.响应拦截器 (取出请求回来的无效数据、处理token失效)
// 4.导出一个函数，调用当前的axios实例发送请求，返回promise
import axios from 'axios'
import store from '../store'
import router from '../router'

// 导出基本请求路径，原因：其它地方有可能不通过这里创建的函数发送请求
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 拦截业务逻辑
  // 进行请求配置的修改，如果本地缓存里面存在token，就携带上去
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
// res => res.data  取出data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(res => {
  return res.data
}, err => {
  // 401 状态码(token认证未通过，token失效)，进入该函数
  if (err.response && err.response.status === 401) {
    // 1) 清空本地无效的用户信息
    store.commit('user/setUser', {})
    // 2) 跳转到登录页面
    // 3) 跳转登录页面需要传参，当前路由地址传递给登录页
    // 原因：请求失败退出登录之后，再次登录能够回到上一次的页面
    // 当前路由地址获取方式：如果有一个路由路径为  '/user?a=10'
    // 组件里面：this.$route.path='/user'；this.$route.fullPath='/user?a=10'
    // js模块中: router.currentRoute (相当于组件里面的this.$route)
    // router.currentRoute是ref类型的响应式对象，取里面的值需要加上.value
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent 转换uri编码，防止解析地址出问题(可能会出现特殊字符串)
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 请求工具函数 (instance返回值是promise类型的)
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
