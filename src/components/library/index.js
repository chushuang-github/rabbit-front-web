// 扩展vue原有的功能：注册全局组件、自定义指令、挂载原型方法
// 注意：vue3里面是没有过滤器的
// 骨架屏组件
// import XtxSkeleton from './xtx-skeleton.vue'
// // 轮播图组件
// import XtxCarousel from './xtx-carousel.vue'
// // 查看更多组件
// import XtxMore from './xtx-more.vue'
// // 面包屑组件
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'

// 引入图片
import defaultImg from '../../assets/images/200.png'
// 引入Message
import Message from '../library/Message'

// 导入library文件夹下的所有组件
// webpack提供的批量导入的api require.context(dir,deep,matching)
// 参数1：加载的文件目录
// 参数2：是否加载子目录
// 参数3：正则，匹配文件
// 返回值：导入函数 fn
// fn.keys() 获取读取到的所有文件列表
const importFn = require.context('./', false, /\.vue$/)
// console.dir(importFn.keys())

// 导出一个对象，对象里面有一个install方法
// app.use()的时候，回去调用install方法，并且会将app传入这个方法
export default {
  install: function (app) {
    // 使用app.component注册组件
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 批量注册全局组件
    importFn.keys().forEach(key => {
      // 导入组件
      // importFn(key)：长什么样子的，请看截图
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })

    // 自定义指令
    defineDirective(app)

    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message
  }
}

// v-lazy指令封装
// 图片懒加载原理：v-lazy="图片地址"
// 指令里面通过bining.value，可以获取到指令传递过来的参数
// 将图片的地址先保存起来，当图片进入可视区域的时候，给图片src属性设置这个图片地址
// 一个图片的src属性有值的时候，就会去加载这张图片
function defineDirective (app) {
  // 图片懒加载的指令
  app.directive('lazy', {
    // 指令的生命周期 (指令使用的dom元素创建完成了执行回调)
    mounted (el, binding) {
      // 创建一个观测对象，去观测使用指令的元素(图片)是否进入可视区域
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // dom元素进入可视区域
          // 停止观察
          observer.unobserve(el)
          // 图片加载失败，给一个默认图片
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        // dom元素进入可视区域的比例为多少时，执行上面的回调函数
        threshold: 0
      })
      // 通过observer的实例方法observer.observe绑定监听的dom元素
      // 开启观察
      observer.observe(el)
    }
  })
}
