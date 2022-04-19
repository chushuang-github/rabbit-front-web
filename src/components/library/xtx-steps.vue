<script>
import { getCurrentInstance } from 'vue'
export default {
  name: 'XtxSteps',
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  render () {
    // getCurrentInstance()返回的ctx和proxy都是当前组件实例对象
    // render里面的this也是当前的组件实例对象
    const { ctx } = getCurrentInstance()
    const items = ctx.$slots.default()

    const dynamicItems = []
    // xtx-steps里面放入xtx-steps-item组件的方式有两种
    // 1) 直接放入多个xtx-steps-item组件
    // 2) 通过v--for放入多个xtx-steps-item组件
    // 两种方式，通过this.$slots.default()取出xtx-steps-itme组件对象方式不一样
    items.forEach(item => {
      if (item.type.name === 'XtxStepsItem') {
        dynamicItems.push(item)
      } else {
        dynamicItems.push(...item.children)
      }
    })

    return (
      <div className="xtx-steps">
        {
          dynamicItems.map((item, i) => {
            return (
              <div
                className={'xtx-steps-item' + (i < this.active ? ' active' : '')}
                key={i}
              >
                <div class="step"><span>{i + 1}</span></div>
                <div class="title">{item.props.title}</div>
                <div class="desc">{item.props.desc}</div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
</script>

<style lang="less">
.xtx-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }
        &::before, &::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after, &::before{
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
         left: 0;
      }
      &::after {
         right: 0;
       }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
