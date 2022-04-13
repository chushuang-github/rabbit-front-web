<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- input框会自动提示已经输入过的内容，使用autocomplete="off"关闭提示信息 -->
    <!-- Form 添加 v-slot="{errors}" 使用作用域插槽暴露 errors 错误对象 -->
    <Form ref="formCom" class="form" :validation-schema="schema" v-slot="{errors}" autocomplete="off">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- <input type="text" placeholder="请输入用户名" /> -->
            <!-- 注意：Field 添加name属性，作用是指定使用schema中哪个校验规则(必须添加name) -->
            <Field
              name="account"
              v-model="form.account"
              type="text"
              placeholder="请输入用户名"
              :class="{error: errors.account}"
            />
          </div>
          <!-- 校验失败，失败的校验信息在errors对象里面 -->
          <div v-if="errors.account" class="error">
            <i class="iconfont icon-warning" />
            {{errors.account}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <!-- <input type="password" placeholder="请输入密码" /> -->
            <Field
              name="password"
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :class="{error: errors.password}"
            />
          </div>
          <div v-if="errors.password" class="error">
            <i class="iconfont icon-warning" />
            {{errors.password}}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- <input type="text" placeholder="请输入手机号" /> -->
            <Field
              name="mobile"
              v-model="form.mobile"
              type="text"
              placeholder="请输入手机号"
              :class="{error: errors.mobile}"
            />
          </div>
          <div v-if="errors.mobile" class="error">
            <i class="iconfont icon-warning" />
            {{errors.mobile}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <!-- <input type="password" placeholder="请输入验证码" /> -->
            <Field
              name="code"
              v-model="form.code"
              type="text"
              placeholder="请输入验证码"
              :class="{error: errors.code}"
            />
            <span class="code" v-if="time">{{time}}秒后发送</span>
            <span class="code" @click="send" v-else>发送验证码</span>
          </div>
          <div v-if="errors.code" class="error">
            <i class="iconfont icon-warning" />
            {{errors.code}}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- <XtxCheckbox v-model="form.isAgree" /> -->
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree"/>
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div v-if="errors.isAgree" class="error">
          <i class="iconfont icon-warning" />
          {{errors.isAgree}}
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <!-- qq登录的按钮，是需要通过qq的js方法创建这个按钮的 -->
      <!-- 如果是同js方法创建的按钮，点击的时候会跳转到一个新的页面打开qq登录窗口，不方便操作 -->
      <!-- 所以我们使用a标签的方式进行跳转到qq登录的按钮，a标签里面的href属性是根据qq创建的按钮，点击的时候跳转到的链接 -->
      <!-- <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt=""> -->
      <!-- <span id="qqLoginBtn"></span> -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '../../../api/user'
// 不使用组件库，使用vee-validate做表单验证功能
// 从vee-validata库里面引入Form组件、Field组件
// Field组件取代input输入框，默认情况下，Field组件会被解析成input输入框
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import Message from '../../../components/library/Message'
import schema from '../../../utils/vee-validate-schema'
// import QC from 'qc'

export default {
  name: 'LoginForm',
  components: {
    Form,
    Field
  },
  setup () {
    // 切换短信登录
    const isMsgLogin = ref(false)
    // 表单数据对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // vee-validate 校验基本步骤
    // 1. 导入Form Field组件，去取代form 和 input元素，Field组件需要加上name属性
    // 2. Field 需要进行数据绑定，字段名称最好和后台接口一致
    // 3. 定义Field组件name属性指定的校验规则函数(定义在vee-validate-schema.js里面)
    // 使用Form组件的validation-schema属性接收校验规则(多个校验规则就放入对象里面)
    // Field组件在失去焦点的时候，就会去根据校验规则去校验
    // Form 添加 v-slot="{errors}" 使用作用域插槽暴露 errors 错误对象
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 切换短信登录和账号登录，清空数据
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 重置表单数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 补充校验效果清除，Form组件提供resetForm()
      // 如果没有销毁Field组件，之前的校验结果是不会清除的 (例如使用v-show切换)
      formCom.value.resetForm()
    })

    // 发送短信验证码 (注意这里的后台接口要求必须是注册过的手机号，才可以进行验证码发送)
    // 手机号：13666666666   验证码：后台的验证码永远都是123456
    // 账号：zhousg          密码：123456
    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮的点击事件
    // 1.2 校验手机号，如果成功才去发送短信(定义api发送请求，获取验证码)
    //     请求成功，获取验证码的按钮开启60s的倒计时，倒计时的过程中不能点击
    // 1.3 如果失败，失败的校验样式显示出来
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
        userMobileLoginMsg(form.mobile).then(() => {
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

    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    // 点击登录按钮，整体表单校验通过才能够去发送请求进行登录
    const login = () => {
      // Form组件提供了一个 validate 函数作为整体表单校验，当是返回的是一个promise
      formCom.value.validate().then(async valid => {
        // 1. 准备一个API做账号
        // 2. 调用API函数
        // 3. 成功：存储用户信息 + 跳转至来源页 + 消息提示
        // 4. 失败：消息提示
        if (valid) {
          try {
            let data = null
            if (isMsgLogin.value) {
              // 手机号登录
              // 1. 发送验证码
              // 2. 进行手机号登录
              const { mobile, code } = form
              data = await userMobileLogin({ mobile, code })
            } else {
              // 账号和密码登录
              const { account, password } = form
              data = await userAccountLogin({ account, password })
            }
            const { id, account, avatar, mobile, nickname, token } = data.result
            // 存储用户信息
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            // 跳转至来源页
            router.push(route.query.redirectUrl || '/')
            // 消息提示
            Message({ type: 'success', text: '登录成功' })
          } catch (e) {
            if (e.response.data) {
              Message({ type: 'error', text: e.response.data.message || '登录失败' })
            }
          }
        }
      })
    }

    // 创建qq登录的按钮 (这一步的目的是可以获取上面qq登录的a标签里面href属性值)
    // 1. 准备span标签，id为qqLoginBtn
    // 2. 调用QC.Login({ btnId: 'qqLoginBtn' })
    // onMounted(() => {
    //   console.log(QC)
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })

    return {
      isMsgLogin,
      form,
      schema: mySchema,
      formCom,
      time,
      login,
      send
    }
  }
}
</script>

<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active, &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
