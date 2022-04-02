<template>
  <!-- 首页入口 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
    </div>
  </div>
  <!-- 新鲜好物 -->
  <HomeNew />
  <!-- 人气推荐 -->
  <HomeHot />
</template>

<script>
import HomeCategory from './component/home-category.vue'
import HomeBanner from './component/home-banner.vue'
import HomeNew from './component/home-new.vue'
import HomeHot from './component/home-hot.vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot
  },
  setup () {

  }
}
</script>

<style scoped lang="less">
</style>
