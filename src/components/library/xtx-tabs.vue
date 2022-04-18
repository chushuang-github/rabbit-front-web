<script>
import { provide } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 在setup里面也是可以获取插槽的
    const activeName = useVModel(props, 'modelValue', emit)
    // 给xtx-tabs-panel传值
    provide('activeName', activeName)

    // 监听事件
    const tabClick = (name, index) => {
      activeName.value = name
      // 触发一个点击自定义事件
      emit('tab-click', { name, index })
    }

    return { activeName, tabClick }
  },
  render () {
    // jsx语法，它能够让我们创建节点和写html一样，jsx里面不能写vue的任何指令语法
    // vue3内部能使用jsx的原因：vue3使用了babel对jsx语法进行转化
    // 1. 动态插值表达式：{}
    // 2. 尽量三元表示式做判断，使用map来遍历
    // 3. 事件使用原始方式绑定：onClick

    // dynamicPanels是一个数组，数组中的每一项都是xtx-tabs-panel组件对象
    // xtx-tabs组件里面通过v-for遍历的方式增加xtx-tabs-panel组件
    // this.$slots.default()[0].children才是xtx-tabs-panel数组
    const panels = this.$slots.default()
    const dynamicPanels = []
    panels.forEach(item => {
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        dynamicPanels.push(...item.children)
      }
    })

    // onClick对应的方法可以写在render函数里面，setup里面，methods配置项中
    // 添加类名，下面的两种的方式都可以
    const nav = (
      <nav>
        {
          dynamicPanels.map((item, index) => {
            return (
              <a
                onClick={() => this.tabClick(item.props.name, index)}
                // onClick={() => this.activeName = item.props.name}
                key={item.props.name}
                href="javascript:;"
                className={item.props.name === this.activeName ? 'active' : ''}
                // class={{ active: item.props.name === this.activeName }}
              >{item.props.label}</a>
            )
          })
        }
      </nav>
    )
    // jsx语法，数组是可以直接展示出来的
    return (
      <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
    )
  }
}
</script>

<style lang="less" scoped>
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
