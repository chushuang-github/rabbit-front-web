// 扩展vue原有的功能：注册全局组件、自定义指令、挂载原型方法
// 注意：vue3里面是没有过滤器的
import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'

// 导出一个对象，对象里面有一个install方法
// app.use()的时候，回去调用install方法，并且会将app传入这个方法
export default {
  install: function (app) {
    // 使用app.component注册组件
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
  }
}
