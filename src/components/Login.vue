<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
          <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="用户名"></el-input>
        </el-form-item>
          <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password" placeholder="密码"></el-input>
        </el-form-item>
          <!-- 按钮 -->
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 登录表单的数据
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单验证区域
            loginFormRules: {
                username:[
                    { required: true, message: '用户名不能为空', trigger: 'blur'},
                    { min: 2,max: 16, message: '长度应在 2 到 16 位',trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur'},
                    { min: 5,max: 16, message: '长度应在 5 到 16 位',trigger: 'blur' }
                ]

            }
        }
    },
    methods:{
        resetLoginForm(){
            // console.log(this);
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return;
                const {data: res} = await this.$http.post('login', this.loginForm);
                // console.log(res);
                if(res.meta.status !== 200) return this.$message.error('用户名或密码错误！');
                this.$message.success('登录成功！');
                window.sessionStorage.setItem('token', res.data.token);
                this.$router.push('/home');
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
     box-sizing: border-box;
  }
  .btns{
      display: flex;
      justify-content: flex-end;
  }
}
</style>
