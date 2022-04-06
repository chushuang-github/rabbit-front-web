<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div
      class="large"
      v-show="show"
      :style="[{backgroundImage:`url(${images[currIndex]})`}, largePosition]"
    ></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="">
      <!-- 可以移动的遮罩容器 -->
      <div class="layer" v-show="show" :style="layerPosition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img, i) in images" :key="img" :class="{active: i === currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
// useMouseInElement：计算鼠标在元素上面的位置
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const currIndex = ref(0)

    // 放大镜效果实现
    // 1. 是否显示遮罩层和大图
    const show = ref(false)
    // 2. 遮罩层的坐标
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 3. 大图的背景定位
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 4. 使用useMouseInElement，得到基于元素左上角的坐标和鼠标是否在元素里面
    const target = ref(null)
    // elementX和elementY是鼠标在目标元素身上的坐标
    // isOutside：鼠标是否在元素类，true表示鼠标在元素外，false表示鼠标在元素里面
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 鼠标在元素里面，并且鼠标在移动
    watch([elementX, elementY, isOutside], () => {
      // 5. 根据数据设置样式
      // 是否显示遮罩层和大图
      show.value = !isOutside.value
      // 遮罩层坐标
      // 大图背景定位
      const position = { x: 0, y: 0 }
      if (elementX.value < 100) position.x = 0
      else if (elementX.value > 300) position.x = 200
      else position.x = elementX.value - 100

      if (elementY.value < 100) position.y = 0
      else if (elementY.value > 300) position.y = 200
      else position.y = elementY.value - 100

      // 给样式赋值
      layerPosition.left = position.x + 'px'
      layerPosition.top = position.y + 'px'
      largePosition.backgroundPositionX = -2 * position.x + 'px'
      largePosition.backgroundPositionY = -2 * position.y + 'px'
    })

    return {
      currIndex,
      show,
      layerPosition,
      largePosition,
      target
    }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    // 鼠标放上去，有一个移动的箭头
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover, &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
