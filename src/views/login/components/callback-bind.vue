<template>
  <Form ref="formCom" class="xtx-form" :validation-schema="schema" v-slot="{errors}" autocomplete="off">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>{{nickname}}</p>
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
          placeholder="绑定的手机号"
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
          placeholder="短信验证码"
        />
        <span class="code" v-if="time">{{time}}秒后发送</span>
        <span class="code" @click="send" v-else>发送验证码</span>
      </div>
      <div v-if="errors.code" class="error">
        <i class="iconfont icon-warning" />
        {{errors.code}}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { userQQBindCode, userQQBindLogin } from '../../../api/user'
import Message from '../../../components/library/Message'
import schema from '../../../utils/vee-validate-schema'
import QC from 'qc'
export default {
  name: 'CallbackBind',
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
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）
    const nickname = ref(null)
    const avatar = ref(null)
    if (QC.Login.check()) {
      // 获取qq头像 昵称
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_qq
      })
    }

    // 表单数据收集
    const form = reactive({
      mobile: null,
      code: null
    })
    // 表单校验函数
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }

    // 发送验证码
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
        userQQBindCode(form.mobile).then(() => {
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

    // qq和小兔鲜账号进行绑定
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await formCom.value.validate()
      if (valid) {
        userQQBindLogin({ unionId: props.unionId, ...form }).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          // 存储用户信息
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 跳转至来源页
          router.push(store.state.user.redirectUrl)
          // 消息提示
          Message({ type: 'success', text: 'QQ绑定成功' })
        }).catch(() => {
          Message({ type: 'error', text: 'QQ绑定失败' })
        })
      }
    }

    return {
      nickname,
      avatar,
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
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
