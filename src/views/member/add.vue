<template>
  <div>
    <el-dialog
      :title="memberInfo.isAdd ? '添加会员' : '编辑会员'"
      :visible.sync="memberInfo.isShow"
      :before-close="cancel"
      center
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 会员名称 prop为调用的规则的名 -->
        <el-form-item
          label="会员名称"
          :label-width="formLabelWidth"
          prop="nickname"
        >
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <!-- 会员名称 prop为调用的规则的名 -->
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <!-- 会员名称 prop为调用的规则的名 -->
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="password" show-password clearable></el-input>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- 底部功能 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="memberInfo.isAdd" type="primary" @click="add('form')"
          >添 加</el-button
        >
        <el-button v-else type="primary" @click="edit('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 辅助型函数
import { mapActions } from "vuex";
// 获取接口
import { getMemberEdit, getMemberInfo } from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {min: 6, max: 11, message: "请输入手机号", trigger: "blur"},
        ],
        nickname: [
          { required: true, message: "请输入会员名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   表单
      /* 
      uid会员编号，必填项
      nickname昵称
      phone手机号
      password密码
      status状态1正常2禁用
      */
      form: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
      password: "",
      formLabelWidth: "120px",
    };
  },
  computed: {},
  props: ["memberInfo"],
  methods: {
    ...mapActions({
      getMemberList: "member/getMemberListAction",
    }),
    // 重置
    reset() {
      this.form = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
      this.$refs['form'].resetFields();
    },
    // 取消事件
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    // 编辑传值
    look(uid) {
      getMemberInfo({ uid })
        .then((res) => {
          // console.log(res);
          this.form = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改事件
    edit(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //   调取接口存值
          this.password ? (this.form.password = this.password) : "";
          // console.log(this.form);
          getMemberEdit(this.form)
            .then((res) => {
              this.$message.success(res.data.msg);
              //   刷新vuex
              this.getMemberList();
              //   关闭弹窗
              this.cancel();
              //   console.log(res);
            })
            .catch((err) => {
              this.$message.error(res.data.msg);
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="stylus" scoped></style>