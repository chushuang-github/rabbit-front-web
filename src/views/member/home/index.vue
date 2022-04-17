<template>
  <div class="member-home">
    <!-- 概览 -->
    <MemberHomeOverview />

    <!-- 收藏 -->
    <MemberHomePanel title="我的收藏" v-if="collectGoods">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
    </MemberHomePanel>

    <!-- 足迹 -->
    <MemberHomePanel title="我的足迹" v-if="goods">
      <GoodsItem v-for="item in goods" :key="item.id" :goods="item" />
    </MemberHomePanel>

    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>

<script>
import { ref } from 'vue'
import MemberHomeOverview from './components/home-overview.vue'
import MemberHomePanel from './components/home-panel.vue'
import GoodsRelevant from '../../goods/components/goods-relevant.vue'
import GoodsItem from '../../category/components/goods-item.vue'
import { findCollect } from '../../../api/member'
export default {
  name: 'MemberHome',
  components: {
    MemberHomeOverview,
    MemberHomePanel,
    GoodsRelevant,
    GoodsItem
  },
  setup () {
    // 我的收藏
    const collectGoods = ref([])
    findCollect({ page: 1, pageSize: 4 }).then(res => {
      collectGoods.value = res.result.items
    })

    // 我的足迹
    const goods = ref([])
    findCollect({ page: 1, pageSize: 4 }).then(res => {
      goods.value = res.result.items
    })

    return { collectGoods, goods }
  }
}
</script>

<style scoped lang="less">
.goods-relevant {
  :deep(.xtx-carousel) {
    .prev {
      left: 5px;
    }
    .next {
      right: 5px
    }
  }
}
</style>
