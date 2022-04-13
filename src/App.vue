<template>
  <!-- 一级路由，下面两种写法都是可以的 -->
  <!-- <router-view></router-view> -->
  <RouterView />
</template>

<script>
// import { unbindQQAndMobile } from './api/user'
export default {
  name: 'App',
  setup () {
    // unbindQQAndMobile(15905560621)
  }
}
</script>

<style lang="less"></style>
