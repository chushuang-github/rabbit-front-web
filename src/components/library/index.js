// 扩展vue原有的功能：注册全局组件、自定义指令、挂载原型方法
// 注意：vue3里面是没有过滤器的
// 骨架屏组件
import XtxSkeleton from './xtx-skeleton.vue'
// 轮播图组件
import XtxCarousel from './xtx-carousel.vue'
// 查看更多组件
import XtxMore from './xtx-more.vue'

// 导出一个对象，对象里面有一个install方法
// app.use()的时候，回去调用install方法，并且会将app传入这个方法
export default {
  install: function (app) {
    // 使用app.component注册组件
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
  }
}
