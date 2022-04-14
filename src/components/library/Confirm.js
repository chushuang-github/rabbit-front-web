// confirm.js
import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

// DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 返回的是一个promise，不管点取消还是确认，组件都会被销毁
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }

    // 使用createVNode创建虚拟节点 (dom节点)
    // 通过给组件传递函数的方式，实现组件内部点击，触发这里的回调函数
    const vnode = createVNode(XtxConfirm, {
      title,
      text,
      cancelCallback,
      submitCallback
    })
    // 通过render渲染虚拟节点到容器里面
    render(vnode, div)
  })
}
