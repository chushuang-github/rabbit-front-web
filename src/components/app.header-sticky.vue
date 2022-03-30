<template>
  <div class="app-header-sticky" :class="{show: y >= 78}">
    <div class="container" v-show="y >= 78">
      <RouterLink class="logo" to="/" />
      <AppHeaderNav />
      <div class="right">
        <RouterLink to="/" >品牌</RouterLink>
        <RouterLink to="/" >专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
// import { ref, onMounted } from 'vue'
// @vueuse/core库里面有许多好用的hooks函数
import { useWindowScroll } from '@vueuse/core'
import AppHeaderNav from './app-header-nav'
export default {
  name: 'AppHeaderSticky',
  components: {
    AppHeaderNav
  },
  setup () {
    // 1) 原生写法：自己监听页面滚动，获取滚动的距离，距离大于78，显示吸顶组件
    // // 记录y轴滚动的高度
    // const y = ref(0)
    // // 当页面滚动高度超过78，显示吸顶头部
    // onMounted(() => {
    //   window.onscroll = () => {
    //     // 下面两种写法都是ok的(获取滚动的y轴高度)
    //     // y.value = document.documentElement.scrollTop
    //     y.value = window.scrollY
    //   }
    // })

    // 2) 使用VueUse工具库里面提供的hooks函数，获取滚动的距离
    // useWindowScroll返回的数据直接是响应式的
    const { y } = useWindowScroll()

    return {
      y
    }
  }
}
</script>

<style scoped lang='less'>
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  // 默认向上移动100%，使初始的时候，是隐藏的
  transform: translateY(-100%);
  opacity: 0;
  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat  right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
