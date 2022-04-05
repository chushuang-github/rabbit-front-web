<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="modelValue" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <!-- 如果使用组件没有用上插槽的话，让span标签也不显示出来 -->
    <span v-if="$slots.default"><slot></slot></span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 切换状态
    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelValue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      // 下面的代码，会触发emit('update:modelValue', 数据)，通知父组件修改数据
      const newVal = !checked.value
      checked.value = newVal
      // 让组件支持change事件
      emit('change', newVal)
    }

    return {
      checked,
      changeChecked
    }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
