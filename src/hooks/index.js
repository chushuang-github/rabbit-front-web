// 提供复用逻辑函数的钩子函数
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

// 数据懒加载函数
// target是dom元素(ref类型的)，apiFn是目标元素进入可视区域执行的函数
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // dom进入可视区域发送请求，只要第一次进入发送请求就可以了
  // 第一次进入之后，调用stop方法停止检测，dom元素再次进入就不发生请求了
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        // 调用apiFn获取数据，并且返回出去
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }
  )
  // 上面有请求，为什么可以在这里直接返回？
  // 答：result是ref响应式类型的，result数据变化，页面会自动刷新的
  return {
    target,
    result
  }
}
