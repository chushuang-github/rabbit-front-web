<template>
  <div class="home-banner">
    <xtx-carousel :sliders="sliders" :auto-play="true" />
  </div>
</template>

<script>
import { reactive } from 'vue'
import { findBanner } from '../../../api/home'
export default {
  name: 'HomeBanner',
  setup () {
    // 请求获取轮播图数据
    const sliders = reactive([])
    findBanner().then(res => {
      sliders.push(...res.result)
    })

    return {
      sliders
    }
  }
}
</script>

<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
// 覆盖轮播图样式
// xtx-carousel组件里面的根标签的类名为xtx-carousel
// 注意：父组件是可以对子组件的根元素进行布局的
// 父组件对不可以对子组件里面的非根元素进行设置样式，如果需要，请使用深度选择器
// 通过v-deep深度选择器，修改组件里面的样式(组件里面style标签增加了scoped)
.xtx-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>
