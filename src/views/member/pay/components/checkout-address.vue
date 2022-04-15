<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-else>
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation.replace(/ /g,'')}}{{showAddress.address}}</li>
      </ul>
      <a v-if="showAddress" href="javascript:;" @click="openAddressEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openFn">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
  </div>
  <!-- 切换地址对话框 -->
  <!-- 给对话框组件添加双向绑定，并修改传递过去的属性名和监听事件 -->
  <!-- v-model:visible="visibleDialog" 写法相当于 -->
  <!-- :visible="visibleDialog" @update:visible="visibleDialog = $event" -->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <div
      class="text item"
      :class="{active: item.id === selectedAddress?.id}"
      v-for="item in list"
      :key="item.id"
      @click="selectedAddress = item"
    >
      <ul>
        <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
        <li><span>联系方式：</span>{{item.contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</li>
        <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'') + item.address}}</li>
      </ul>
     </div>
    <!-- v-slot:footer，可以简写成#footer -->
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right:20px" @click="visibleDialog = false">取消</XtxButton>
      <XtxButton type="primary" @click="confirmFn">确认</XtxButton>
    </template>
  </XtxDialog>

  <!-- 添加地址、修改地址对话框 -->
  <AddressEdit ref="addressEditCom" @onSuccess="successHandler" />
</template>

<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  // 1. 在拥有根元素的组件中，触发自定义事件，有没有emits选项无所谓
  // 2. 如果你的组件渲染的代码片段，vue3.0规范，需要在emits中申明你所触发的自定义事件
  // 3. 提倡：你发了自定义事件，需要在emits选项申明下，代码可读性很高
  emits: ['change'],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    AddressEdit
  },
  setup (props, { emit }) {
    // 1. 找到默认收货地址：item.isDefault等于0，表示默认地址
    // 2. 没有默认收货地址，使用第一个条收货地址
    // 3. 如果一个收货地址都没有，页面显示：您需要先添加收货地址才可提交订单。
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      showAddress.value = props.list.length ? props.list[0] : null
    }

    // 默认将收货地址传递给父组件 (提交订单的时候需要收货地址id)
    emit('change', showAddress.value?.id)

    // 切换地址弹窗
    const visibleDialog = ref(false)
    // 记录当前选择的地址
    const selectedAddress = ref(null)
    // 打开地址弹窗
    const openFn = () => {
      visibleDialog.value = true
      // 打开对话框的时候，将数据置为空
      selectedAddress.value = null
    }
    // 确认
    const confirmFn = () => {
      showAddress.value = selectedAddress.value
      // 将选择的地址传递给父组件
      emit('change', selectedAddress.value?.id)
      visibleDialog.value = false
    }

    // 打开编辑收货地址弹窗
    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      // 添加地址传空对象；修改的时候传递收货地址
      addressEditCom.value.open(address)
    }

    // 修改收货地址，点击确定
    const successHandler = (formData) => {
      // 根据和formData.id 去当前地址列表中去查找，查找到了就是修改，没查到就是添加
      const address = props.list.find(item => item.id === formData.id)

      if (!address) {
        // 如果是添加，往list里面追加一条
        // formData是深拷贝，做一下深拷贝
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      } else {
        // 如果是修改，修改list和showAddress
        for (const key in address) {
          address[key] = formData[key]
        }
      }
    }

    return {
      showAddress,
      visibleDialog,
      selectedAddress,
      addressEditCom,
      openFn,
      confirmFn,
      openAddressEdit,
      successHandler
    }
  }
}
</script>

<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          // 1em = 1font-size字体大小
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active, &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
