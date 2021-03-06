<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem >填写订单</XtxBreadItem>
      </XtxBread>
      <div class="wrapper" v-if="order">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <CheckoutAddress :list="order.userAddresses" @change="changeAddress" />
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="goods in order.goods" :key="goods.skuId">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="goods.picture" alt="">
                    <div class="right">
                      <p>{{goods.name}}</p>
                      <p>{{goods.attrsText}}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{goods.price}}</td>
                <td>{{goods.count}}</td>
                <td>&yen;{{goods.totalPrice}}</td>
                <td>&yen;{{goods.totalPayPrice}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl><dt>商品件数：</dt><dd>{{order.summary.goodsCount}}件</dd></dl>
            <dl><dt>商品总价：</dt><dd>¥{{order.summary.totalPrice}}</dd></dl>
            <dl><dt>运<i></i>费：</dt><dd>¥{{order.summary.postFee}}</dd></dl>
            <dl><dt>应付总额：</dt><dd class="price">¥{{order.summary.totalPayPrice}}</dd></dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton type="primary" @click="submitOrderFn">提交订单</XtxButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CheckoutAddress from './components/checkout-address.vue'
import { createOrder, submitOrder, findOrderRepurchase } from '../../../api/order'

export default {
  name: 'Checkout',
  components: {
    CheckoutAddress
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { proxy } = getCurrentInstance()

    // 结算功能 - 生成订单 - 订单信息
    const order = ref(null)
    if (route.query.orderId) {
      // 根据再次购买跳转过来的订单信息，查询订单
      findOrderRepurchase(route.query.orderId).then(res => {
        order.value = res.result
        // 获取订单信息
        // 点击提交订单按钮的时候，需要商品信息
        reqParams.goods = res.result.goods.map(({ skuId, count }) => ({ skuId, count }))
      })
    } else {
      // 根据购物车查询订单信息
      createOrder().then(res => {
        order.value = res.result
        // 获取订单信息
        // 点击提交订单按钮的时候，需要商品信息
        reqParams.goods = res.result.goods.map(item => {
          return {
            skuId: item.skuId,
            count: item.count
          }
        })
      })
    }

    // 提交订单需要收货地址id
    const changeAddress = (id) => {
      reqParams.addressId = id
    }

    // 提交订单
    const reqParams = reactive({
      // 配送时间：1为不限 2为工作日 3为双休过节假日
      deliveryTimeType: 1,
      // 支付方式：1位在线支付 2位货到付款
      payType: 1,
      // 支付渠道：1支付宝 2微信 (在线支付传值，货到付款就不传值)
      payChannel: 1,
      // 买家留言
      buyerMessage: '',
      // 商品信息：获取订单信息后设置 [{ skuId, count }]
      goods: [],
      // 收货地址id
      addressId: null
    })
    const submitOrderFn = () => {
      if (!reqParams.addressId) {
        return proxy.$message({ text: '请选择收货地址' })
      }
      // 提交订单的接口：用来生成订单的
      submitOrder(reqParams).then(res => {
        proxy.$message({ type: 'success', text: '提交订单成功' })
        // 跳转支付页面 (需要携带订单编号，根据订单编号进行支付)
        router.push(`/member/pay?orderId=${res.result.id}`)
      })
    }

    return {
      order,
      changeAddress,
      submitOrderFn
    }
  }
}
</script>

<style scoped lang="less">
.xtx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td, th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active, &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
