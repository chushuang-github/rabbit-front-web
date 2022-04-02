<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
      <!-- 面板内容 -->
      <div ref="target" style="position: relative;height: 426px;">
        <transition name="fade">
          <ul class="goods-list" v-if="list.length">
            <li v-for="item in list" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" alt="">
                <p class="name">{{item.title}}</p>
                <p class="desc">{{item.alt}}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else />
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '../../../api/home'
import { useLazyData } from '../../../hooks'
export default {
  name: 'HomeHot',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // 请求获取人气推荐数据
    // const list = ref([])
    // findHot().then(res => {
    //   list.value = res.result
    // })
    const target = ref(null)
    const list = useLazyData(target, findHot)

    return {
      target,
      list
    }
  }
}
</script>

<style lang="less" scoped>
// 离开时淡出动画
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
