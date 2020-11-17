<template>
  <div>
    <el-dialog
      :title="userInfo.isAdd ? '添加管理员' : '编辑管理员'"
      :visible.sync="userInfo.isShow"
      :before-close="cancel"
      center
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 所属管理员 -->
        <el-form-item
          label="所属角色"
          :label-width="formLabelWidth"
          prop="roleid"
        >
          <el-select v-model="form.roleid" placeholder="请选择所属角色">
            <el-option
              :label="item.rolename"
              :value="item.id"
              v-for="item in roleList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 管理员名称 prop为调用的规则的名 -->
        <el-form-item
          label="管理员名称"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <!-- 管理员权限 -->

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
        <el-button v-if="userInfo.isAdd" type="primary" @click="add('form')"
          >添 加</el-button
        >
        <el-button v-else type="primary" @click="edit('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 辅助型函数
import { mapActions, mapGetters } from "vuex";
// 获取接口
import {
  getUserAdd,
  getMenuInfo,
  getUserEdit,
  getUserInfo,
} from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        roleid: [
          { required: true, message: "请选择所属角色", trigger: "change" },
        ],
        username: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   表单
      form: {
        roleid: "", // 数值
        username: "",
        password: "",
        status: 1,
      },
      formLabelWidth: "120px",
    };
  },
  computed: {
    ...mapGetters({
      roleList: "role/getRoleList",
    }),
  },
  props: ["userInfo"],
  methods: {
    ...mapActions({
      getRoleList: "role/getRoleListAction",
      getUserList: "user/getUserListAction",
      getUserCount: "user/getUserCountAction",
    }),
    // 重置
    reset() {
      this.form = {
        roleid: "",
        rolename: "",
        password: "",
        status: 1,
      };
      this.$refs['form'].resetFields();
    },
    // 添加事件
    add(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          getUserAdd(this.form)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getUserList();
              this.getUserCount();
              // 添加完关闭
              this.cancel();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消事件
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    // 编辑传值
    look(uid) {
      // console.log(uid);
      // 获取一条数据
      getUserInfo({ uid })
        .then((res) => {
          if (res.data.code == 200) {
            // console.log(res);
            this.form = res.data.list;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          console.log(err);
        });
    },
    // 修改事件
    edit(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUserEdit(this.form)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getUserList();
              this.getUserCount();
              // 添加完关闭
              this.cancel();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    //   页面加载就判断vuex是否有menulist么有就添加
    if (this.roleList.length == 0) {
      this.getRoleList();
    }
  },
};
</script>

<style lang="stylus" scoped></style>