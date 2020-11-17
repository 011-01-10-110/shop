<template>
  <div class="login">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="loginForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          show-password
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login('loginForm')">登录</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getUserLogin } from "../util/axios";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      // 规则验证
      rules: {
        // 用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["changeUserInfo"]),
    // 登录
    login(formName) {
      // validate 验证
      this.$refs[formName].validate((valid) => {
        // 登录逻辑
        if (valid) {
          getUserLogin(this.loginForm).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              // 登录成功把数据存到本地存储中
              this.changeUserInfo(res.data.list);
              // sessionStorage.setItem("userInfo", JSON.stringify(res.data.list));

              this.$router.push("/index");
            } else {
              this.$message.error(res.data.msg);
            }
          });
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl'
.login
  width: 100%
  height: 100vh
  background-color: $firstBgColor
  .loginForm
    width: 400px
    height: 200px
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
</style>