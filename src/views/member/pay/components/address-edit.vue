<template>
  <XtxDialog :title="`${formData.id ? '修改': '添加' }收货地址`" v-model:visible="visibleDialog">
    <!-- 表单 -->
    <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XtxCity placeholder="请选择所在地区" :fullLocation="formData.fullLocation" @change="changeCity" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
        </div>
      </div>
    </div>
    <!-- v-slot:footer，可以简写成#footer -->
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right:20px" @click="visibleDialog = false">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '../../../../api/order'
import Message from '../../../../components/library/Message'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const visibleDialog = ref(false)

    // 打开对话框
    const open = (address) => {
      visibleDialog.value = true
      // 打开对话框清除数据
      // 如果是添加收货地址，每次打开的时候，清空
      if (!address.id) {
        // 添加收货地址
        for (const key in formData) {
          if (key !== 'isDefault') {
            formData[key] = null
          }
        }
      } else {
        // 填充表单
        // 修改收货地址
        for (const key in address) {
          formData[key] = address[key]
        }
      }
    }

    // 表单数据收集
    const formData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      fullLocation: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1
    })
    const changeCity = (result) => {
      formData.provinceCode = result.provinceCode
      formData.cityCode = result.cityCode
      formData.countyCode = result.countyCode
      formData.fullLocation = result.fullLocation
    }

    // 添加时候的提交操作
    const submit = () => {
      // 注意：这里的表单省略了表单校验
      if (!formData.id) {
        // 添加收货地址
        addAddress(formData).then(res => {
          // 添加地址id
          formData.id = res.result.id
          Message({ type: 'success', text: '添加收货地址成功' })
          visibleDialog.value = false
          // 需要给结算组件地址列表中添加地址数据
          emit('on-success', formData)
        })
      } else {
        // 修改收货地址
        editAddress(formData).then(res => {
          Message({ type: 'success', text: '修改收货地址成功' })
          visibleDialog.value = false
          emit('on-success', formData)
        })
      }
    }

    return {
      visibleDialog,
      formData,
      open,
      changeCity,
      submit
    }
  }
}
</script>

<style lang="less" scoped>
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
