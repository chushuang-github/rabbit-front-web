// 定义分类相关的API接口函数
import request from '../utils/request'

// 账号登录
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

// 获取手机号验证码 (手机号登录时获取的验证码)
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

// 手机号登录(验证码默认是123456)
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

// QQ登录
// unionId：qq登录的openId
// source：登录来源(1为pc端；2为webapp；3为微信小程序；4为Android；5为iso；6为qq；7为微信)
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

// qq号和小兔鲜账号绑定的短信验证码
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

// qq号和小兔鲜账号绑定
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

// 校验用户名是否唯一
export const userAccountCheck = (account) => {
  return request('/register/check', 'get', { account })
}

// 完善小兔鲜账号，获取短信验证码
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

// 完善小兔鲜账号
export const userQQPatchLogin = ({ unionId, account, mobile, code, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { account, mobile, code, password })
}

// 解除qq号和手机号的绑定
export const unbindQQAndMobile = (mobile) => {
  return request('/login/social/unbind', 'get', { mobile })
}
