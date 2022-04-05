<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li v-for="item in list" :key="item.id" @mousemove="show(item)" @mouseleave="hide(item)">
      <RouterLink :to="`/category/${item.id}`" @click="hide(item)">
        {{item.name}}
      </RouterLink>
      <div class="layer" :class="{open: item.open}">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <RouterLink :to="`/category/sub/${sub.id}`" @click="hide(item)">
              <img :src="sub.picture" alt="">
              <p>{{sub.name}}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    // 获取分类列表
    const list = computed(() => store.state.category.list)

    // 跳转的时候不会关闭二级类目，通过数据来控制
    // 1. vuex每个分类加上open数据
    // 2. vuex提供显示和隐藏函数，修改open数据
    // 3. 在组件中使用vuex函数，使用事件来绑定，提供一个显示隐藏的类名
    const show = (item) => {
      store.commit('category/show', item.id)
    }
    const hide = (item) => {
      store.commit('category/hide', item.id)
    }
    return {
      list,
      show,
      hide
    }
  }
}
</script>

<style lang="less" scoped>
.app-header-nav {
  position: relative;
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // 鼠标移入，显示二级类目
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}
// 二级类目样式(默认隐藏，所以高度设置为0，透明度设置为0)
.layer {
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
