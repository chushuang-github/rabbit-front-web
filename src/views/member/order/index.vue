<template>
  <div class="member-order">
    <!-- 通过v-model，可以让使用xtx-tabs的组件知道选中了哪一个 -->
    <xtx-tabs v-model="activeName" @tabClick="changeTab">
      <xtx-tabs-panel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </xtx-tabs-panel>
    </xtx-tabs>

    <!-- 订单列表 -->
    <!-- 订单状态：待付款，待发货，待收货，待评价，已完成，已取消 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        v-for="item in orderList"
        :key="item.id"
        :order="item"
        @on-cancel="handlerCancel"
        @on-delete="handlerDelete"
        @on-confirm="handlerConfirm"
        @on-logistics="handlerLogistics"
      />
    </div>

    <!-- 分页组件 -->
    <xtx-pagination
      v-if="total > 0"
      :currentPage="reqParams.page"
      :pageSize="reqParams.pageSize"
      :total="total"
      @currentChange="changePage"
    />

    <!-- 取消订单对话框 -->
    <OrderCancel ref="cancelCom" />
    <!-- 查看物流对话框 -->
    <OrderLogistics ref="logisticsCom" />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '../../../api/constants'
import OrderItem from './components/order-item.vue'
import OrderCancel from './components/order-cancel.vue'
import OrderLogistics from './components/order-logistics.vue'
import { findOrderList, deleteOrder, confirmOrder } from '../../../api/order'
import Confirm from '../../../components/library/Confirm'
import Message from '../../../components/library/Message'

// 取消订单
export const useCancel = () => {
  const cancelCom = ref(null)
  const handlerCancel = (order) => {
    cancelCom.value.open(order)
  }
  return {
    cancelCom,
    handlerCancel
  }
}

// 确认收货
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '亲，您确认收货吗？' }).then(() => {
      confirmOrder(order.id).then(() => {
        order.orderState = 4
        Message({ type: 'success', text: '确认收货成功' })
      })
    }).catch(() => {})
  }
  return {
    handlerConfirm
  }
}

// 查看物流
export const useLogistics = () => {
  const logisticsCom = ref(null)
  const handlerLogistics = (order) => {
    logisticsCom.value.open(order)
  }
  return {
    logisticsCom,
    handlerLogistics
  }
}

export default {
  name: 'MemberOrder',
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  setup () {
    // 选中的tabs
    const activeName = ref('all')

    // 查询参数
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 获取订单数据
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(res => {
        orderList.value = res.result.items
        loading.value = false
        total.value = res.result.counts
      })
    }
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })

    // tabs切换
    const changeTab = ({ index }) => {
      reqParams.orderState = index
      reqParams.page = 1
    }
    // 分页器切换分页
    const changePage = (newPage) => {
      reqParams.page = newPage
    }

    // 删除订单
    const handlerDelete = (order) => {
      Confirm({ text: '请，您确定删除该订单吗？' }).then(() => {
        deleteOrder(order.id).then(() => {
          Message({ type: 'success', text: '删除订单成功' })
          getOrderList()
        })
      }).catch(() => {})
    }

    return {
      activeName,
      orderStatus,
      reqParams,
      orderList,
      loading,
      total,
      changeTab,
      changePage,
      handlerDelete,
      ...useCancel(),
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
