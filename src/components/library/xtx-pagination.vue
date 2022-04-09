<template>
  <div class="xtx-pagination">
    <!-- 当前页面等于1的时候，禁用上一页 -->
    <!-- 写两个上一页，因为当上一页禁用的时候，显示的不绑定事件 -->
    <!-- 这样做就不用在函数里面单独处理禁用的上一页的点击事件了 -->
    <a
      v-if="myCurrentPage > 1"
      href="javascript:;"
      @click="changePage(myCurrentPage - 1)"
    >上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>

    <span v-if="pager.start > 1">...</span>
    <a
      href="javascript:;"
      :class="{active: item === myCurrentPage}"
      v-for="item in pager.btnArr"
      :key="item"
      @click="changePage(item)"
    >{{item}}</a>
    <span v-if="pager.end < pager.pageCount">...</span>

    <a
      v-if="myCurrentPage < pager.pageCount"
      href="javascript:;"
      @click="changePage(myCurrentPage + 1)"
    >下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    // 总条数
    total: {
      type: Number,
      default: 100
    },
    // 当前页数
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页大小
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 需要数据：下面的数据，以后会由外界传入进来
    // 1. 总条数
    const myTotal = ref(100)
    // 2. 当前显示的页码
    const myCurrentPage = ref(1)
    // 3. 每一页条数
    const myPageSize = ref(10)
    // 4. 约定按钮个数5个(显示的按钮个数)，如果成为动态的需要设置为响应式数据
    const count = 5

    // 其它数据(总页数，起始按钮，结束按钮，显示的按钮数组)
    // 其它数据是根据上面的4个数据计算得出的，将这4个数据放入对象里面
    const pager = computed(() => {
      // 总页数 = 总条数 / 每一页条数  向上取整
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 根据当前显示的页码 和 按钮个数计算  =>  起始按钮，结束按钮，显示的按钮数组
      // 1) 理想情况下
      const offset = Math.floor(count / 2)
      let start = myCurrentPage.value - offset
      let end = start + count - 1
      // 2) 如果起始页码小于1
      if (start < 1) {
        start = 1
        // 起始页码变化，重新计算结束页码 (注意：此时结束页码可能大于总页数)
        end = (start + count - 1) > pageCount ? pageCount : (start + count - 1)
      }
      // 3) 结束页码一开始就大于总页数
      if (end > pageCount) {
        end = pageCount
        // 结束页码变化，重新计算起始页码 (注意：此时起始页码可能会小于1)
        start = (end - count + 1) < 1 ? 1 : (end - count + 1)
      }

      // 根据起始页码 和 接收页码，计算出按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        pageCount,
        start,
        end,
        btnArr
      }
    })

    // 监听props参数的变化，更新组件内部的数据
    watch(props, () => {
      myTotal.value = props.total
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
    }, { immediate: true })

    // 页面变化的监听函数
    const changePage = (newPage) => {
      if (myCurrentPage.value !== newPage) {
        myCurrentPage.value = newPage
        // 通知父组件最新页码
        emit('current-change', newPage)
      }
    }

    return {
      myCurrentPage,
      pager,
      changePage
    }
  }
}
</script>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
