<template>
  <div class="detail-logistics">
    <p>
      <span>{{list[0].time}}</span>
      <span>{{list[0].text}}</span>
    </p>
    <a href="javascript:;" @click="handlerLogistics(order)">查看物流</a>
    <!-- 查看物流对话框 -->
    <!-- Teleport：指定元素插入页面什么位置，下面就是放入body标签里面 -->
    <Teleport to="body">
      <OrderLogistics ref="logisticsCom" />
    </Teleport>
  </div>
</template>

<script>
import { ref } from 'vue'
import OrderLogistics from './order-logistics.vue'
import { useLogistics } from '../index.vue'
import { logisticsOrder } from '../../../../api/order'
export default {
  name: 'DetailLogistics',
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    OrderLogistics
  },
  // 异步组件，在setup函数前面加上了async，异步组件需要放在vue内置组件Suspense里面
  // 组件实例化的时候需要执行setup，因为需要返回渲染模板需要的数据
  async setup (props) {
    const data = await logisticsOrder(props.order.id)
    const list = ref(data.result.list)

    return {
      list,
      ...useLogistics()
    }
  }
}
</script>

<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  transform: translate(0px, 0px);
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
