<template>
  <!-- 顶部 -->
  <AppNavbar />
  <!-- 头部 -->
  <AppHeader />
  <!-- 内容容器 -->
  <main class="app-body">
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <!-- 底部 -->
  <AppFooter />
</template>

<script>
import AppNavbar from '../components/app-navbar.vue'
import AppHeader from '../components/app-header.vue'
import AppFooter from '../components/app-footer.vue'
export default {
  name: 'Layout',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter
  },
  setup () {

  }
}
</script>
<style lang="less" scoped>
.app-body {
  min-height: 600px;
}
</style>
