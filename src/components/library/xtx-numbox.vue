<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNumber(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNumber(1)">+</a>
    </div>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 1
    },
    // 最小值，最大值，由使用组件的人决定
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 使用useVModel实现数据的双向绑定，count是一个ref类型的数据
    const count = useVModel(props, 'modelValue', emit)
    // 绑定按钮点击事件
    const changeNumber = (step) => {
      const newValue = count.value + step
      // 1. 判断修改过后的值是否合法，如果不合法，终止程序的执行
      if (newValue < props.min || newValue > props.max) return

      // 2. 修改数据，下面修改相当于：emit('update:modelValue', '数据')，通过父组件去修改modelValue值
      count.value = newValue

      // 3. 提供change事件，供外界使用 (外界可以使用v-model进行双向绑定，也可以通过change事件监听获取最新值)
      emit('change', newValue)
    }

    return {
      changeNumber
    }
  }
}
</script>

<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
