<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <GoodsSku @change="changeSku" :goods="goods" :skuId="skuId" v-else />
      <xtx-button
        v-if="!loading"
        type="primary"
        size="mini"
        style="margin-left: 60px"
        @click="submit"
      >确认</xtx-button>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import GoodsSku from '../../goods/components/goods-sku.vue'
import { onClickOutside } from '@vueuse/core'
import { getGoodsSku } from '../../../api/cart'
import Message from '../../../components/library/Message'
export default {
  name: 'CartSku',
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  components: {
    GoodsSku
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const loading = ref(false)
    // 打开弹窗
    const goods = ref(null)
    const open = () => {
      visible.value = true
      loading.value = true
      // 打开对话框的时候，发送请求，获取数据
      getGoodsSku(props.skuId).then(res => {
        goods.value = res.result
        loading.value = false
      })
    }
    // 关闭弹窗
    const close = () => {
      visible.value = false
    }
    // 切换
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 点击其它地方关闭
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })

    // 监听sku改变的函数，记录sku信息
    const currSku = ref(null)
    const changeSku = (sku) => {
      currSku.value = sku
    }

    // 点击确认，将更改后端sku提交给父组件 (购物车组件)
    const submit = () => {
      // 当skuId发生变化 he currSku有值，通知父组件
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('change', currSku.value)
        close()
      } else {
        Message({ text: '请选择正确的商品属性' })
      }
    }

    return {
      visible,
      target,
      goods,
      loading,
      toggle,
      changeSku,
      submit
    }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
