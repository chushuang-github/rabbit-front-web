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
</template>

<script>
import HomeCategory from './component/home-category.vue'
import HomeBanner from './component/home-banner.vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner
  },
  setup () {

  }
}
</script>

<style scoped lang="less">
</style>
