<template>
  <div class='xtx-carousel'>
    <!-- 轮播图图片容器 -->
    <ul class="carousel-body" @mouseenter="stop" @mouseleave="start">
      <li
        v-for="(item, i) in sliders"
        :key="i"
        class="carousel-item"
        :class="{fade: i === index}"
      >
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <!-- 下一张 -->
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <!-- 五个指示器 -->
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders.length"
        :key="i"
        :class="{active: i === index}"
        @click="index = i"
      ></span>
    </div>
  </div>
</template>

<script>
// 轮播图组件
import { ref, watch, onUnmounted } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 轮播图数据
    sliders: {
      type: Array,
      default: () => []
    },
    // 自动轮播间隔时间
    duration: {
      type: Number,
      default: 3000
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    // 控制显示图片的索引
    const index = ref(0)

    // 1. 自动轮播的逻辑 (下面的注释，是不让eslint做校验)
    let timer = null
    // 开启自动轮播的函数封装
    const autoPayFn = () => {
      // 每次调用之前，清除之前的定时器(防止定时器重复开启多个)
      clearInterval(timer)
      // 自动播放，每隔多久切换索引
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 需要监听sliders数据变化，判断如果有数据，并且autoPlay值为true，就自动播放
    // 如果watch第一个参数传入() => props.sliders，需要加上deep:true配置，进行深度监听
    // 为什么需要深度监听：props.sliders是数组+对象类型的
    watch(props.sliders, (newValue) => {
      if (newValue.length && props.autoPlay) {
        autoPayFn()
      }
    }, { immediate: true })

    // 2. 鼠标移入暂停自动轮播，鼠标移出恢复自动轮播(恢复轮播是有条件的)
    const stop = () => {
      timer && clearInterval(timer)
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPayFn()
      }
    }

    // 3. 点击指示器和上一张/下一张按钮切换轮播图
    const toggle = (value) => {
      const newIndex = index.value + value
      if (newIndex > props.sliders.length - 1) {
        index.value = 0
        return
      }
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      index.value = newIndex
    }

    // 4. 组件卸载时，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })

    return {
      index,
      stop,
      start,
      toggle
    }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    // 这里的轮播图原理：
    // 让轮播图的几张图片重合，透明度设置为0，并且透明度发生变化的时候，增加过渡效果
    // 这里增加过渡：切换图片的时候，有淡入淡出的效果
    // 点击上一张、下一张、轮播图指示器的时候，给要显示的图片增加一个fade的类名
    // fade类：让这张图片透明度变成1，并且这张图片的z-index是几张图片当中最高的一张
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        // 通过给轮播图下面的指示器增加active类，来激活指示器
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
