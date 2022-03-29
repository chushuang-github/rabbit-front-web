<template>
  <div class="container">
    <!-- 顶部 -->
    <nav>顶部</nav>
    <!-- 头部 -->
    <header>头部</header>
    <!-- 内容容器 -->
    <div class="main">
      <RouterView />
    </div>
    <!-- 底部 -->
    <footer>底部</footer>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  setup () {

  }
}
</script>
