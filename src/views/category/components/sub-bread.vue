<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem
      v-if="category.top"
      :to="`/category/${category.top.id}`"
      :key="category.top.id"
    >{{category.top.name}}</XtxBreadItem>
    <transition name="fade-right">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{category.sub.name}}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'SubBread',
  setup () {
    const store = useStore()
    const route = useRoute()
    // 通过计算属性，从vuex获取顶级和二级类目信息
    // 数据格式：{ top: {id, name}, sub: {id, name} }
    const category = computed(() => {
      const cate = {}
      // 完成获取分类数据的逻辑
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })

    return {
      category
    }
  }
}
</script>
