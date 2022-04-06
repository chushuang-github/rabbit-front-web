<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
// 这个组件放在父组件的最下方，当这个组件出现在可视区域的时候
// 会通知父组件一声，父组件就会进行发送请求加载数据，从而实现上拉加载的效果
export default {
  name: 'XtxInfiniteLoading',
  // 正在加载和没有数据了，这两个情况都只有父组件知道
  // 父组件发送请求获取数据就处于正在加载...；所有数据请求完成就处于没有数据了
  props: {
    // 是否处于加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 数据是否加载完成
    finished: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const target = ref(null)
    // 监听这个组件是否处于可视区域
    useIntersectionObserver(
      target,
      ([{ isIntersecting }], observerElement) => {
        // 进入可视区域
        if (isIntersecting) {
          // 触发加载更多条件：上次请求完成(loading为false)，还有数据(finished为false)
          if (!props.loading && !props.finished) {
            // 告诉父组件，开始加载数据(父组件里面会发送请求，获取数据)
            emit('infinite')
          }
        }
      },
      { threshold: 0 }
    )

    return {
      target
    }
  }
}
</script>

<style scoped lang='less'>
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      // background-positon 和 background-size 属性之间时需要增加'/' 分隔符的
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
