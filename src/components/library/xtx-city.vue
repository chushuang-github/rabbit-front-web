<template>
  <div class="xtx-city" ref="target">
    <div class="select" :class="{active: visible}" @click="toggle">
      <!-- 如果用户登录了，取出用户设置的默认地址(goods.userAddresses字段) -->
      <!-- 父组件里面进行判断，将地址传递过来 -->
      <span class="placeholder" v-if="!fullLocation">{{placeholder}}</span>
      <span class="value" v-else>{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <!-- 加载的动画，v-if和v-for不要在同一个标签里面使用 -->
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          v-for="item in currList"
          :key="item.code"
          @click="changeItem(item)"
        >{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
// 监听目标元素以外的点击事件
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'

// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存(有缓存在缓存里面去数据，没有缓存就去重新请求)
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  return new Promise((resolve) => {
    // 缓存：数据放在全局变量window.cityData身上
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        // 数据进行缓存
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}

// 这个组件会给父组件传递省市区的三者code值(后端服务器需要)，和省市区文字
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 城市弹窗的显示和隐藏
    const visible = ref(false)

    // 所有的城市数据
    const allCityData = ref([])
    // 城市数据比较多，增加一个加载中的动画
    const loading = ref(false)

    // 打开和关闭城市弹窗的方法
    const open = () => {
      visible.value = true
      loading.value = true
      // 打开城市弹窗的时候，去获取数据(因为弹窗可能会频繁的打开，所以做了缓存)
      getCityData().then(res => {
        allCityData.value = res
        loading.value = false
      })
      // 每次打开弹窗，清空之前选择的数据
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    // 切换的方法
    const toggle = () => {
      visible.value ? close() : open()
    }

    // 监听点击城市组件以外的元素，会关闭城市组件的弹窗
    const target = ref(null)
    // 第一个参数是dom元素，第二个参数是回调函数
    onClickOutside(target, () => {
      close()
    })

    // 城市弹窗，要么显示省级的，要是市级的，要么是县级
    // 定义一个计算属性，计算当前弹窗需要展示的数据(地区列表省市区)
    const currList = computed(() => {
      // 数据默认显示省级的
      let list = allCityData.value
      // 城市可能：市级的
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 城市可能：县级的
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(p => p.code === changeResult.cityCode).areaList
      }
      return list
    })

    // 定义用户选择的 省市区 数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 当用户点击城市弹窗按钮的时候
    const changeItem = (item) => {
      // 0省，1市，2区
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      } else if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      } else if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 地址选择完毕，关闭地址弹窗，通知父组件
        close()
        emit('change', changeResult)
      }
    }

    return {
      visible,
      target,
      loading,
      currList,
      toggle,
      changeItem
    }
  }
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0px;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
