// Message.js
// 提供一个能够显示xtx-message组件的函数
// 这个函数将来可以导入直接使用，也可以挂载在vue实例属性上面
// import Message from 'Message.js' 方式导入
// 使用方式一：Message({ type: 'error', text: '提示文字' })
// 使用方式二：this.$message({ type: 'error', text: '提示文字' })

import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 创建容器：在函数外面创建的原因(只需要创建一次就ok了)
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
// 定时器标识
let timer = null

export default ({ type, text }) => {
  // 渲染组件
  // 1. 导入消息提示组件
  // 2. 将导入的消息提示组件编译为虚拟节点 (dom节点)
  //    导入的组件不是html、css、js，是需要解析才能去使用的
  // createVNode方法，可以将组件编译成虚拟节点(dom节点对象)
  // create第一个参数：组件；第二个参数是这个组件需要的参数
  const vnode = createVNode(XtxMessage, { type, text })
  // 3. 准备一个装载消息提示组件的dom容器
  // 4. 将虚拟节点渲染在容器里面 (通过render函数将虚拟节点渲染到dom容器里面)
  render(vnode, div)
  // 5. 开启定时，移出DOM容器内容
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
