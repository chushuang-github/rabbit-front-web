// 提供复用逻辑函数的钩子函数
import { ref, onUnmounted } from 'vue'
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'

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
    },
    // dom元素和可视区域相交的比例为多大时，算dom元素进入可视区域了
    // threshold设置相交的比例足够小，dom元素刚进入可视区域，就直接去执行请求函数
    { threshold: 0 }
  )
  // 上面有请求，为什么可以在这里直接返回？
  // 答：result是ref响应式类型的，result数据变化，页面会自动刷新的
  return {
    target,
    result
  }
}

// 订单时间支付倒计时
// countdown：倒计时秒数
export const usePayTime = () => {
  const time = ref(0)
  const timeText = ref('')

  // pause暂停(销毁)定时器；resume开启定时器
  // useIntervalFn(callback, 循环定时器时间, 是否立即开启定时器)
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    // 使用dayjs库，将时间转化为我们需要的格式
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)

  // 组件卸载时清除定时器
  onUnmounted(() => {
    pause()
  })

  // 开启定时器，给time和timeText初始化赋值
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    time,
    timeText,
    start
  }
}
