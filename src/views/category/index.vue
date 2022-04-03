<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <xtx-bread>
        <xtx-bread-item :to="{path: '/'}">首页</xtx-bread-item>
        <xtx-bread-item to="/category/1005000">电器</xtx-bread-item>
        <xtx-bread-item>空调</xtx-bread-item>
      </xtx-bread>
      <!-- 轮播图 -->
      <!-- 全部分类 -->
      <!-- 各个分类推荐商品 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopCategory'
}
</script>

<style lang="less" scoped>

</style>
