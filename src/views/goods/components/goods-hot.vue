<template>
  <div class="goods-hot">
    <h3>{{title}}</h3>
    <div v-if="goodsList">
      <GoodsItem v-for="item in goodsList" :goods="item" :key="item.id" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import GoodsItem from '../../category/components/goods-item.vue'
import { findGoodsHot } from '../../../api/product'
export default {
  name: 'GoodsHot',
  components: {
    GoodsItem
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    // 类型数据字典
    const types = {
      1: '24小时热销版',
      2: '周热销版',
      3: '总热销版'
    }
    const title = computed(() => types[props.type])

    // 发送请求，获取数据
    const route = useRoute()
    const goodsList = ref([])
    findGoodsHot({ id: route.params.id, type: props.type }).then(res => {
      goodsList.value = res.result
    })

    return {
      title,
      goodsList
    }
  }
}
</script>

<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
