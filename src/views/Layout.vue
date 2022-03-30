<template>
  <!-- 顶部 -->
  <AppNavbar />
  <!-- 吸顶头部 -->
  <AppHeaderSticky />
  <!-- 头部 -->
  <AppHeader />
  <!-- 内容容器 -->
  <div class="app-body">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>
  <!-- 底部 -->
  <AppFooter />
</template>

<script>
import { useStore } from 'vuex'
import AppNavbar from '../components/app-navbar.vue'
import AppHeaderSticky from '../components/app.header-sticky.vue'
import AppHeader from '../components/app-header.vue'
import AppFooter from '../components/app-footer.vue'
export default {
  name: 'Layout',
  components: {
    AppNavbar,
    AppHeaderSticky,
    AppHeader,
    AppFooter
  },
  setup () {
    // 获取分类数据
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>
<style lang="less" scoped>
.app-body {
  min-height: 600px;
}
</style>
