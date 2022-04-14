<template>
  <!-- 遮罩层有一个淡入的动画，弹窗有一个淡入+下移的动画 -->
  <div class="xtx-confirm" :class="{fade}">
    <div class="wrapper" :class="{fade}">
      <div class="header">
        <h3>{{title}}</h3>
        <a
          @click="cancel"
          href="JavaScript:;"
          class="iconfont icon-close-new"
        ></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{text}}</span>
      </div>
      <div class="footer">
        <XtxButton @click="cancel" size="mini" type="gray">取消</XtxButton>
        <XtxButton @click="submit" size="mini" type="primary">确认</XtxButton>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
// 因为XtxConfirm组件是在app外面的组件，想要使用XtxButton组件，需要进行手动导入注册
import XtxButton from './xtx-button.vue'
export default {
  name: 'XtxConfirm',
  components: {
    XtxButton
  },
  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    text: {
      type: String,
      text: ''
    },
    cancelCallback: {
      type: Function,
      default: () => {}
    },
    submitCallback: {
      type: Function,
      default: () => {}
    }
  },
  setup (props) {
    // 组件初始完毕，使用fade控制组件出现的样式
    const fade = ref(false)
    onMounted(() => {
      // 一个页面初始化的时候，立即增加过渡，不会立即生效的
      // 过渡效果需要在页面创建完毕，稍微延迟一会加上才吃触发过渡的效果
      setTimeout(() => {
        fade.value = true
      }, 10)
    })
    // 点击取消，需要触发confirm.js里面reject方法
    // 点击确认，需要触发confirm.js里面的resolve方法
    // 取消
    const cancel = () => {
      props.cancelCallback()
    }
    // 确认
    const submit = () => {
      props.submitCallback()
    }

    return {
      fade,
      cancel,
      submit
    }
  }
}
</script>

<style scoped lang="less">
.xtx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  // 遮罩层显示的时候有一个淡入的动画
  background: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0, 0, 0, 0.5);
  }
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    // 弹窗有一个淡入+下移的动画
    transform: translate(-50%, -60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    .header, .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
