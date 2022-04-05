<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filterChange="filterChange" />
      <!-- 商品面板 (排序组件 + 列表) -->
      <div class="goods-list">
        <!-- 排序组件 -->
        <SubSort @sortChange="sortChange" />
        <!-- 商品列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <GoodsItem :goods="item" />
          </li>
        </ul>
        <!-- 无限加载组件(列表下拉到最底下，自动加载跟多) -->
        <!-- 原理：这个组件到可视区域，会触发infinite监听事件，去调用getData方法 -->
        <xtx-infinite-loading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
          @updateData="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { findSubCategoryGoods } from '../../api/category'
export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    const route = useRoute()
    // true表示加载中
    const loading = ref(false)
    // true表示数据已经加载完成了
    const finished = ref(false)
    // 商品列表数据
    const goodsList = ref([])
    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }

    // 发送请求，获取列表数据
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(res => {
        if (res.result.items.length) {
          goodsList.value.push(...res.result.items)
          reqParams.page++
        } else {
          // 数据加载完成
          finished.value = true
        }
        loading.value = false
      })
    }

    // 更改二级分类，重新加载数据
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })

    // 1. 更改排序组件筛选属性，重新请求
    const sortChange = (sortParams) => {
      finished.value = false
      // 合并请求参数(需要保留之前的参数)
      reqParams = { ...reqParams, ...sortParams, page: 1 }
      // 数据置为空，xtx-infinite-loading组件进入可视区域，会自动去调用getData方法发送请求
      goodsList.value = []
    }

    // 2. 更改筛选组件筛选数据，重新请求
    const filterChange = (filterParams) => {
      finished.value = false
      // 合并请求参数(需要保留之前的参数)
      reqParams = { ...reqParams, ...filterParams, page: 1 }
      // 数据置为空，xtx-infinite-loading组件进入可视区域，会自动去调用getData方法发送请求
      goodsList.value = []
    }

    return {
      loading,
      finished,
      goodsList,
      getData,
      sortChange,
      filterChange
    }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
