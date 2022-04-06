<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <xtx-bread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right">
          <!-- 为什么加key：分类切换的时候，让key不同，key不同，会重新渲染一个新的组件 -->
          <!-- 重新加载新的组件，就会有组件的销毁去创建，就可以执行动画了 -->
          <!-- 如果不加上key，就只有文字的变化，文字的变化是不会触发动画的 -->
          <!-- 动画触发条件：元素的创建和移除(不同的key可以创建移除元素，创造触发动画条件) -->
          <XtxBreadItem :key="topCategory.id">{{topCategory.name}}</XtxBreadItem>
        </transition>
      </xtx-bread>
      <!-- 轮播图 -->
      <xtx-carousel :sliders="sliders" :auto-play="true" style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <RouterLink :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture" >
              <p>{{sub.name}}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{sub.name}} -</h3>
          <p class="tag">{{sub.saleProperties}}</p>
          <XtxMore :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/goods-item.vue'
import { findBanner } from '../../api/home'
import { findTopCategory } from '../../api/category'
export default {
  name: 'TopCategory',
  components: {
    GoodsItem
  },
  setup () {
    // 轮播图
    const sliders = ref([])
    findBanner().then(res => {
      sliders.value = res.result
    })

    // 面包屑 + 所有子分类
    const store = useStore()
    const route = useRoute()
    // 顶级分类的数据
    const topCategory = computed(() => {
      // 路由组件：只有路由规则发生变化的时候，会再次去执行setup函数
      // 注意：当route发生变化的时候，也会重新去计算的(route是Proxy类型的)
      let cate = {}
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })

    // 获取各个子类目下面的推荐商品
    // 监听地址栏id的变化，当id发生变化，去加载当前分类id下面对应的数据
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    watch(() => route.params.id, (newVal) => {
      // newVal && getSubList()
      // 从顶级类目跳转到二级类目，id也会发生变化，这时候增加一些限制
      // 只有在顶级类目的情况下面，才会去发送请求
      if (newVal && `/category/${newVal}` === route.path) {
        getSubList()
      }
    }, { immediate: true })

    return {
      sliders,
      topCategory,
      subList
    }
  }
}
</script>

<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  // 推荐商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
