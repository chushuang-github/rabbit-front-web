<template>
  <div class='sub-sort'>
    <div class="sort">
      <a :class="{active: sortParams.sortField === null}" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{active: sortParams.sortField === 'publishTime'}" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{active: sortParams.sortField === 'orderNum'}" @click="changeSort('orderNum')" href="javascript:;">最高人气</a>
      <a :class="{active: sortParams.sortField === 'evaluateNum'}" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i :class="{active: sortParams.sortField === 'price' && sortParams.sortMethod === 'asc'}" class="arrow up" />
        <i :class="{active: sortParams.sortField === 'price' && sortParams.sortMethod === 'desc'}" class="arrow down" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory" @change="changeCheck">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount" @change="changeCheck">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 实现交互 (实现交互的数据和后台保持一致)
    // 1. 明确交互产生的步骤
    const sortParams = reactive({
      // 仅显示有货商品复选框是否选中
      inventory: false,
      // 仅显示特惠商品复选框是否选中
      onlyDiscount: false,
      // sortField：排序字段，取值如下，null为默认取值
      // "publishTime":最新商品，"orderNum":最高人气，"price":价格排序，"evaluateNum":评论最多
      sortField: null,
      // 价格排序方式
      // asc:升序、desc:降序
      sortMethod: null
    })

    // 2. 按钮点击事件
    const changeSort = (sortField) => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        // 处理箭头
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 如果已经选中阻止点击(多次点击同一个按钮)
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      // 通知父组件
      emit('sort-change', sortParams)
    }

    // 复选框发生变化
    const changeCheck = () => {
      emit('sort-change', sortParams)
    }

    // 监听路由变化
    const route = useRoute()
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        sortParams.inventory = false
        sortParams.onlyDiscount = false
        sortParams.sortField = null
        sortParams.sortMethod = null
      }
    })

    return {
      sortParams,
      changeSort,
      changeCheck
    }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
