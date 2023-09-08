<template>
  <div class="login-page">
    <!-- 所有组件的类名规范, 组件名就是元素的类名 -->
    <el-card class="login-card">
      <template #header>
        <span>黑马面经运营后台</span>
      </template>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click='login'>登录</el-button>
          <el-button  @click='reset'>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 11, message: '长度在 5 到 11 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^\w{2,11}$/, message: '长度在 5 到 11 个字符', trigger: ['blur', 'change'] }
        ]

      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async (valid, obj) => {
        try {
          if (valid) {
            console.log('登录了')
            await this.$store.dispatch('user/loginAction', this.form)
            this.$router.push('/')
            this.$message.success('登录成功')
          }
        } catch (err) {
          this.$message.error(err.response.data.message)
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }

  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("@/assets/login-bg.svg") no-repeat;
  background-position: center;
  background-size: 100%;
  .login-card {
    width: 420px;
    ::v-deep .el-card__header {
      background-color: #727cf5;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        color: white;
        font-size: 18px;
      }
    }
    .el-form {
      padding: 0 25px;
    }
    .btns {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
