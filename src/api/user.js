// 定义分类相关的API接口函数
import request from '../utils/request'

// 账号登录
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

// 获取手机号验证码
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

// 手机号登录(验证码默认是123456)
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}
