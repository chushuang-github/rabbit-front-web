// src/mock/index.js
import Mock from 'mockjs'
// qs这个包是node里面内置的，可以直接去使用
// qs模块是用来解析query字符串的：page=1&pageSize=4&collectType=1
// qs.parse：将query字符串解析成对象
// qs.stringify：将对象解析成query字符串
import qs from 'qs'

// mock的配置
Mock.setup({
  // 随机延时500-1000毫秒
  timeout: '500-1000'
})

// 拦截请求，
// 第一个参数：url，使用正则去匹配
// 第二个参数：请求方式
// 第三个参数： 生成数据的函数
Mock.mock(/\/my\/test/, 'get', () => {
  // 随机数据逻辑 目标：5条数据  [{id: '', name: ''}, {}, {}, {}, {}]
  const arr = []
  for (let i = 0; i < 5; i++) {
    // Mock.mock()函数，生随机数据
    // mock里面生成随机数的规则，请查找mock官网
    // @id：生成一个随机的id；@cname(2, 4)：生成一个2-4位的随机中文名
    arr.push(Mock.mock({
      id: '@id',
      name: '@cname(2, 4)'
    }))
  }
  return { msg: '请求测试接口成功', result: arr }
})

// 模拟 我的收藏
// config就是我们发送请求的真实的配置
Mock.mock(/\/member\/collect/, 'get', (config) => {
  // console.log(config)
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)

  const counts = 35
  const items = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10, 20)',
      desc: '@ctitle(4, 10)',
      price: '@float(100, 200, 2, 2)',
      // // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }

  return {
    msg: '获取收藏商品成功',
    result: {
      counts,
      // +：将String类型的数据转为Number类型的数据
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})
