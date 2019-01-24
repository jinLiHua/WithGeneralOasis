<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
             class="card-box login-form">
      <h3 class="title logo_top"><img src="../../images/login_logo.png" alt=""></h3>
      <div class="title_out">
        <h3 class="title">同普绿洲泄漏检测和修复</h3>
        <h3 class="title">（LDAR）管理系统</h3>
      </div>
      <el-form-item prop="username">
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                  placeholder="请输入密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" class="login_btn" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登 录
        </el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import {  getInfo } from '@/api/login'

  export default {
    name: 'login',
    created(){
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        callback()
      }
      const validatePass = (rule, value, callback) => {
        callback()
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        pwdType: 'password'
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        var self = this;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              sessionStorage.setItem('name',this.loginForm.username)
              this.loading = false;
              this.GetInfo();

            }).catch(() => {
                this.loading = false
            })
          } else {
          return false
        }
      })
      },
      // 获取用户信息
      GetInfo() {
        getInfo().then(response => {
          const data = response.data;
          sessionStorage.setItem('niceName',data.niceName);
          sessionStorage.setItem('userType',data.type);
          sessionStorage.setItem('userName',data.userName);

          //设置全局的用户企业
          let userOnly = 'USERSC' + data.userName;
          if (!sessionStorage.getItem(userOnly)) {
            sessionStorage.setItem(userOnly, data.orgId);
          }
          this.$router.push({ path: '/' })
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import '../../styles/variables.scss';
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#fff;
  $primary_btn:#1eb464;

  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background:url("../../images/login_bg.jpg") no-repeat;
    background-size:100% 100%;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: $light_gray;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
    }
    .el-form-item__content{
      line-height: 12px;
    }
    .login_btn:hover{
      color:white;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 100%;
      border-radius: 5px;
      overflow: hidden;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    &_login {
       font-size: 20px;
     }
    }
    .title_out{
      margin-bottom: 40px;
    }
    .title {
      font-size: 30px;
      color: $light_gray;
      text-align: center;
      margin: 5px auto;
      font-weight: normal;
    }
    .title.logo_top{
      margin: 40px auto 20px auto;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 560px;
      height: 560px;
      padding: 35px 60px 15px 60px;
      margin: 200px auto;
      box-sizing: border-box;
      border-radius: 5px;
      background: -webkit-linear-gradient($transFF); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient($transFF); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient($transFF); /* Firefox 3.6 - 15 */
      background: linear-gradient($transFF); /* 标准的语法（必须放在最后） */
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      margin-bottom: 15px;
    }
    .el-form-item.btn {
      margin-top: 35px;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
      top: 15px;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    .el-button--primary{
      background-color: $primary_btn;
      border-color: $primary_btn;
      height: 50px;
      font-size: 18px;
    }
  }
</style>
