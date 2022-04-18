<template>
  <div class="member-order">
    <!-- 通过v-model，可以让使用xtx-tabs的组件知道选中了哪一个 -->
    <xtx-tabs v-model="activeName" @tabClick="changeTab">
      <xtx-tabs-panel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >{{item.label}}</xtx-tabs-panel>
    </xtx-tabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import { orderStatus } from '../../../api/constants'
import xtxTabsPanel from '@/components/library/xtx-tabs-panel.vue'
export default {
  components: { xtxTabsPanel },
  name: 'MemberOrder',
  setup () {
    const activeName = ref('all')
    const changeTab = (tab) => {
      console.log(tab)
    }
    return { activeName, orderStatus, changeTab }
  }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
}
</style>
