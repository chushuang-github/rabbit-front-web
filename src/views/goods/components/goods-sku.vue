<template>
  <div class="goods-sku">
    <!-- 如果item里面的values数组里面有picture，就渲染成图片；否则渲染成文字 -->
    <dl v-for="item in goods.specs" :key="item">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <!-- img标签的title属性：鼠标放在图片上面，会出现文字提示 -->
          <img
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            :class="{selected: val.selected, disabled: val.disabled}"
            @click="changeSku(item, val)"
          >
          <span
            v-else
            :class="{selected: val.selected, disabled: val.disabled}"
            @click="changeSku(item, val)"
          >{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import { bwPowerSet } from '../../../vender'

const spliter = '★'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合，goods.skus
  // 2. 从所有的goods.skus中筛选出有效的sku组件
  // 3. 根据有效的sku使用bwPowerSet算法得到子集
  // 4. 根据子集往路径字典对象中存储 key-value
  const pathMap = {}
  skus.forEach(sku => {
    // sku.inventory大于0的，都是有效的sku
    if (sku.inventory > 0) {
      // 计算当前有库存的sku子集
      // 例如：[1,2,3] => [[1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]
      // 获取可选值数组valueArr：['蓝色', '20cm', '中国']，是一些属性组成的数组
      const valueArr = sku.specs.map(item => item.valueName)
      const valueArrPowerSet = bwPowerSet(valueArr)
      // 遍历子集，往路径字典pathMap里面存储数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key，约定key：['蓝色', '美国] => '蓝色★美国'
        // 注意：后台数据顺序是经过处理的
        // 表示同一个意思的路径字典里面的key '蓝色★美国' - '美国★蓝色'，是不会出现的
        const key = arr.join(spliter)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          // 存为数组原因：该属性处于多个sku，并且当前商品该属性是有库存的
          // 当一个商品的所有属性都是可选的，表示这些属性的该商品是有库存的
          // 当一个商品的所有属性都选择好了，就会来路径字典里面来查找sku.id
          // 一个商品的所有属性都选择完毕的，所有的属性都是相同的，那么sku.id必是唯一的
          // 根据sku.id去查看这个属性对应的该商品的信息(比如现价、原件等一些属性)
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 获取选中的属性组成的数组(注意顺序)
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 每遍每一排，找出选中的按钮
    const selectVal = item.values.find(val => val.selected)
    // 有选中的按钮，将按钮名称放入；没有找到，放入undefined
    arr.push(selectVal ? selectVal.name : undefined)
  })
  return arr
}

// 更新按钮禁用状态
// specs就是一个商品所有的属性数组；pathMap是路径集合
const updateDisabledStatus = (specs, pathMap) => {
  // 1. 约定每一个按钮的状态由本身的disabled属性决定
  specs.forEach((item, index) => {
    const selectedValues = getSelectedValues(specs)
    // 下面的val就是每一个按钮对象
    item.values.forEach(val => {
      // 2. 判断当前是否选中，如果是选中，不用去判断
      if (val.isSelected) return
      // 3. 如果没有选中，让当前的值，根据索引去替换selectedValues数组里面的值
      selectedValues[index] = val.name
      // 4. 去除undefined数据，按照★分隔符拼接成key
      const key = selectedValues.filter(value => value !== undefined).join(spliter)
      // 5. 拿着key去pathMap路径集合里面去查找是否有数据
      // 给disabled设置值，有则可以点击(设置为false)，没有就禁用(设置为true)
      val.disabled = !pathMap[key]
    })
  })
}

// 传入skuId，初始会默认选中属性
const initDefaultSelected = (goods, skuId) => {
  // 1. 找出skuId对应的sku信息
  const sku = goods.skus.find(sku => sku.id === skuId)
  // 2. 遍历每一个按钮，按钮的值和sku记录的值相同，就选中
  goods.specs.forEach((item, index) => {
    const val = item.values.find(val => val.name === sku.specs[index].valueName)
    val.selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    // 使用这个组件的时候，传入skuId，初始就会默认选中当前skuId对应的属性
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 根据skuId，初始化选中的属性
    if (props.skuId) initDefaultSelected(props.goods, props.skuId)

    // 获取路径字典
    const pathMap = getPathMap(props.goods.skus)
    // ★ 初始化的时候更新按钮的禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // 1. 商品选中与取消选中的逻辑(在每一个属性按钮，都拥有自己的选中状态数据: selected)
    // 1.1 点击的是以选中的，只需要取消当前的选中
    // 1.2 点击的是未选中的，需要把同一规格的其它选中的按钮取消选中，当前点击的规格选中
    // item是同一属性的大集合；val是一个小属性的对象
    const changeSku = (item, val) => {
      // 如果点击的是禁用的按钮，直接结束这个函数
      if (val.disabled) return
      // 如果点击的不是禁用的按钮，执行下面的逻辑
      if (val.selected) {
        val.selected = false
      } else {
        // 同一属性其它规格的取消选中，当前点击的规格选中
        item.values.forEach(valItem => valItem.selected = false)
        val.selected = true
      }
      // ★ 点击属性的时候，更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)

      // 选择属性的时候，将选择的sku信息通知父组件
      // 传递参数：skuId、现价(price)、原价(oldPrice)、库存(inventory)、选中的属性文字(specsText)
      // 1.选择的属性完整，才可以获取skuId，将信息传递给父组件
      // 2.选择的属性不完整，给父组件传递一个空对象
      const specs = getSelectedValues(props.goods.specs)
      // specs数组里面值如果没有undefined，就表示选择的属性完成(isComplete为true，表示选择的属性完成)
      const isComplete = specs.every(item => item !== undefined)
      if (isComplete) {
        // 选择的属性完成
        // 在路径字典里面，获取skuId；根据skuId，获取sku信息
        const skuIds = pathMap[`${specs.join(spliter)}`]
        const sku = props.goods.skus.find(item => item.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // specsText值是这样的：颜色:蓝色 产地:中国 尺寸:10cm
          // 使用map方法+join方法；使用reduce方法
          specsText: sku.specs.map(item => `${item.name}:${item.valueName}`).join(' ')
          // specsText: sku.specs.reduce((res, item) => `${res} ${item.name}: ${item.valueName}`, '').trim()
        })
      } else {
        // 父组件需要判断规格是否选择完成，不完整是不能添加购物车的
        emit('change', {})
      }
    }

    return {
      changeSku
    }
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
