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
  <!-- 热门品牌 -->
  <HomeBrand />
  <!-- 商品区块 -->
  <HomeProduct />
  <!-- 最新专题 -->
  <HomeSpecial />
</template>

<script>
import HomeCategory from './component/home-category.vue'
import HomeBanner from './component/home-banner.vue'
import HomeNew from './component/home-new.vue'
import HomeHot from './component/home-hot.vue'
import HomeBrand from './component/home-brand.vue'
import HomeProduct from './component/home-product.vue'
import HomeSpecial from './component/home-special.vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  },
  setup () {

  }
}
</script>

<style scoped lang="less">
</style>
