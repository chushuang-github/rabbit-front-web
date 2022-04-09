<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem
          :to="`/category/${goods.categories[1].id}`"
        >{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem
          :to="`/category/sub/${goods.categories[0].id}`"
        >{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem v-if="goods">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- 图片预览组件 -->
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量选择组件 -->
          <xtx-numbox v-model="num" label="数量" :max="goods.inventory" />
          <!-- 按钮组件 -->
          <xtx-button type="primary" style="margin-top: 20px;">加入购物车</xtx-button>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <GoodsTabs />
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn />
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, provide } from 'vue'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image.vue'
import GoodsRelevant from './components/goods-relevant.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { findGoods } from '../../api/product'

// 防止setup函数里面东西太多，所以将一些东西抽取出来
// 获取商品数据的hooks函数
const useGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(res => {
        // 切换商品的时候，只是传参发生变化，路由匹配的时候匹配到的还是同一个组件
        // 所以组件是不会重新渲染的，我们要做的是切换商品，在路由参数发生变化的时候，重新根据新的商品数据渲染页面
        // 每次切换商品的时候，先将数据置为null，页面会去重置；
        // nextTick回调函数里面将真正的数据设置上去(nextTick在下次dom更新之后，去执行里面的回调函数)
        // nextTice函数使用的时候，上面一般都会有响应式数据的修改
        // 这样做：切换商品，数据设置为null，页面数据清空(dom已经更新了)；之后再设置新的值，页面进行展示
        // 然商品数据为null，当前组件里面使用v-if="goods"的组件可以重新销毁和创建
        goods.value = null
        nextTick(() => {
          goods.value = res.result
        })
      })
    }
  }, { immediate: true })
  return goods
}

export default {
  name: 'Goods',
  components: {
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsRelevant,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    // 1. 获取商品详情数据，进行渲染
    const goods = useGoods()

    // 商品属性发生变化
    const changeSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.price
        goods.value.inventory = sku.inventory
      }
    }

    // 数量选择组件
    const num = ref(1)

    // 通过provide向孙子组件传递参数
    provide('goods', goods)

    return {
      goods,
      num,
      changeSku
    }
  }
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
