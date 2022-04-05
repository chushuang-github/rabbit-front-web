<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="item in filterData.brands"
          :key="item.id"
          :class="{active: item.id === filterData.selectedBrand}"
          @click="changeBrand(item.id)"
        >{{item.name}}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{item.name}}：</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="prop in item.properties"
          :key="prop.id"
          :class="{active: prop.id === item.selectedProp}"
          @click="changeProps(item, prop.id)"
        >{{prop.name}}</a>
      </div>
    </div>
  </div>
  <!-- 展示骨架 -->
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '../../../api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()

    const filterData = ref(null)
    // 是否处于加载中，加载中就展示骨架内容
    const filterLoading = ref(false)
    // 监听二级类目id的变化
    watch(() => route.params.id, (newVal) => {
      // 变化后的id有值 且 处在二级类目的路由下
      if (newVal && `/category/sub/${newVal}` === route.path) {
        // 发送请求，获取数据
        filterLoading.value = true
        findSubCategoryFilter(route.params.id).then(res => {
          // 每一组筛选条件，缺少全部条件，处理下数据，手动添加全部
          // 给每一组属性增加当前是否选中的ID (后面点击选中需要的数据)
          // 1. 品牌添加全部
          res.result.selectedBrand = null
          res.result.brands.unshift({ id: null, name: '全部' })
          // 2. 其余属性添加全部
          res.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          // 设置数据
          filterData.value = res.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    // 获取筛选参数的函数
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      // 1) 品牌
      obj.brandId = filterData.value.selectedBrand

      // 2) 属性：需要遍历filterData.value.saleProperties(取出这个数组里面的selectedProp值)
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({
            groupName: item.name,
            propertyName: prop.name
          })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null

      // 接口数据格式：{brandId:'品牌id', attrs: [{ groupName:'属性名', propertyName:'属性值' }]}
      return obj
    }

    // 记录当前选择的品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      // 修改品牌，需要将brandId传递给父组件
      emit('filter-change', getFilterParams())
    }
    // 记录当前选择的销售属性
    const changeProps = (item, propId) => {
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      // 修改销售属性，需要将attrs传递给父组件
      emit('filter-change', getFilterParams())
    }

    return {
      filterData,
      filterLoading,
      changeBrand,
      changeProps
    }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all .3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
  padding: 10px 0;
}
@keyframes fade {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
</style>
