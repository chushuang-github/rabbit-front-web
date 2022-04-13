<template>
  <Form ref="formCom" class="xtx-form" :validation-schema="schema" v-slot="{errors}" autocomplete="off">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          name="account"
          v-model="form.account"
          class="input"
          :class="{err: errors.account}"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div v-if="errors.account" class="error">
        <i class="iconfont icon-warning" />
        {{errors.account}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          name="mobile"
          v-model="form.mobile"
          class="input"
          :class="{err: errors.mobile}"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">
        <i class="iconfont icon-warning" />
        {{errors.mobile}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          name="code"
          v-model="form.code"
          class="input"
          :class="{err: errors.code}"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" v-if="time">{{time}}秒后发送</span>
        <span class="code" @click="send" v-else>发送验证码</span>
      </div>
      <div v-if="errors.code" class="error">
        <i class="iconfont icon-warning" />
        {{errors.code}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          name="password"
          v-model="form.password"
          class="input"
          :class="{err: errors.password}"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div v-if="errors.password" class="error">
        <i class="iconfont icon-warning" />
        {{errors.password}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          name="rePassword"
          v-model="form.rePassword"
          class="input"
          :class="{err: errors.rePassword}"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div v-if="errors.rePassword" class="error">
        <i class="iconfont icon-warning" />
        {{errors.rePassword}}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { reactive, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { userQQPatchCode, userQQPatchLogin } from '../../../api/user'
import Message from '../../../components/library/Message'
import schema from '../../../utils/vee-validate-schema'
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: {
    Form,
    Field
  },
  setup (props) {
    // 1. 表单校验 多两个校验：用户名是否存在，再次输入密码是否一致
    // 2. 发送短信验证码：发送的接口API不一样
    // 3. 完善信息

    // 表单数据
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })

    // 表单校验函数
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

    // 发送短信验证码
    const formCom = ref(null)
    const time = ref(0)
    // pause暂停(销毁)定时器；resume开启定时器
    // useIntervalFn(callback, 循环定时器时间, 是否立即开启)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    // 组件销毁，清除定时器
    onUnmounted(() => {
      pause()
    })
    const send = () => {
      // 校验手机号是否正确
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 手机号校验通过，发送请求，获取验证码
        userQQPatchCode(form.mobile).then(() => {
          Message({ type: 'success', text: '验证码发送成功' })
          time.value = 60
          resume()
        }).catch(err => {
          Message({ type: 'error', text: err.response.data.message })
        })
      } else {
        // 手机号校验失败，失败使用vee-validate的错误函数显示的信息
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // 提交
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await formCom.value.validate()
      if (valid) {
        userQQPatchLogin({ unionId: props.unionId, ...form }).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          // 存储用户信息
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 跳转至来源页
          router.push(store.state.user.redirectUrl)
          // 消息提示
          Message({ type: 'success', text: 'QQ完善信息成功' })
        }).catch(() => {
          Message({ type: 'error', text: '完善信息失败' })
        })
      }
    }

    return {
      form,
      schema: mySchema,
      formCom,
      time,
      send,
      submit
    }
  }
}
</script>

<style scoped lang='less'>
// 表单的共用样式放在commom.less文件里面
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
