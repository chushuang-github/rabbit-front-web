<template>
  <div class="member-order" v-if="order">
    <!-- 头部 -->
    <OrderDetailAction :order="order" />
    <!-- 进度 -->
    <DetailStep :order="order" />
    <!-- 物流 -->
    <!-- 异步组件放在Suspense组件里面，这是一个内置组件 -->
    <Suspense>
      <template #default>
        <DetailLogistics v-if="[3, 4, 5].includes(order.orderState)" :order="order" />
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
    <!-- 信息 -->
    <DetailInfo :order="order" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import OrderDetailAction from './components/detail-action.vue'
import DetailStep from './components/detail-step.vue'
import DetailLogistics from './components/detail-logistics.vue'
import DetailInfo from './components/detail-info.vue'
import { findOrderDetail } from '../../../api/order'

export default {
  name: 'MemberOrderDetail',
  components: {
    OrderDetailAction,
    DetailStep,
    DetailLogistics,
    DetailInfo
  },
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then(res => {
      order.value = res.result
    })

    return {
      order
    }
  }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  color: #999;
}
</style>
