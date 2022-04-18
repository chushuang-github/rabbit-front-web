<template>
  <div class="xtx-tabs-panel" v-show="activeName === name">
    <slot></slot>
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  props: {
    // 选项卡文字
    label: {
      type: String,
      default: ''
    },
    // 选项卡唯一标识
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    // 当前组件该不该显示，取决于xtx-tabs组件的activeName数据是否和props.name一样
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>
