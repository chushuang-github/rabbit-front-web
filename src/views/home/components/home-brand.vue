<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a
        href="javascript:;"
        class="iconfont icon-angle-left prev"
        :class="{disabled: index === 0}"
        @click="toggle(-1)"
      ></a>
      <a
        href="javascript:;"
        class="iconfont icon-angle-right next"
        :class="{disabled: index === 1}"
        @click="toggle(1)"
      ></a>
    </template>
    <div class="box" ref="target">
      <transition name="fade">
        <ul v-if="brands.length" class="list" :style="{transform: `translateX(${-index*1240}px)`}">
          <li v-for="item in brands" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="">
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px"/>
        </div>
      </transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel'
import { findBrand } from '../../../api/home'
import { useLazyData } from '../../../hooks'
export default {
  name: 'HomeBrand',
  components: {
    HomePanel
  },
  setup () {
    // 获取热门品牌数据
    // const brands = ref([])
    // findBrand(10).then(res => {
    //   brands.value = res.result
    // })
    // 注意：useLazyData需要的是API函数，如果遇到要传参的情况，自己写函数再函数中调用API
    const { result, target } = useLazyData(() => findBrand(10))

    // 切换效果：这里只有10条数据，进行两页的切换
    // 上一页 下一页(index为0表示第一页，index为1表示第二页)
    const index = ref(0)
    const toggle = (step) => {
      const newIndex = index.value + step
      if (newIndex < 0 || newIndex > 1) return
      index.value = newIndex
    }

    return {
      brands: result,
      target,
      index,
      toggle
    }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  // 设置字体图标的样式
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  // 不允许点击的样式
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      .hoverShadow();
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
// 骨架屏样式
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
