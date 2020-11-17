<template>
  <div>
    <el-dialog
      :title="roleInfo.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="roleInfo.isShow"
      :before-close="cancel"
      center
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 角色名称 prop为调用的规则的名 -->
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="rolename"
        >
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <!-- 角色权限 -->
        <el-form-item label="角色权限" :label-width="formLabelWidth">
          <!-- 树形选择 -->
          <el-tree
            :data="menuList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            check-strictly
          >
          </el-tree>
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
        <el-button v-if="roleInfo.isAdd" type="primary" @click="add('form')"
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
  getRoleAdd,
  getRoleEdit,
  getMenuList,
  getRoleInfo,
} from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   表单
      form: {
        rolename: "",
        menus: [],
        status: 1,
      },
      formLabelWidth: "120px",
      //   tree规则
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  computed: {
    ...mapGetters({
      menuList: "menu/getMenuList",
    }),
  },
  props: ["roleInfo"],
  methods: {
    ...mapActions({
      getMenuList: "menu/getMenuListAction",
      getRoleList: "role/getRoleListAction",
    }),
    // 重置
    reset() {
      this.form = {
        rolename: "",
        menus: [],
        status: 1,
      };
      this.$refs.tree.setCheckedKeys([]);
      this.$refs['form'].resetFields();
    },
    // 添加事件
    add(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //   console.log(this.$refs.tree.getCheckedKeys());
          // 设置menus的值
          // this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
          this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
          //   调取接口存值
          getRoleAdd(this.form)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                //   刷新vuex
                this.getRoleList();
                //   关闭弹窗
                this.cancel();
                //   console.log(res);
              } else {
                this.$message.error(res.data.msg);
              }
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
    // 取消事件
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    // 编辑传值
    look(id) {
      getRoleInfo({ id })
        .then((res) => {
          this.form = res.data.list;
          // console.log(res);
          this.form.id = id;
          this.form.menus = this.$refs.tree.setCheckedKeys(
            res.data.list.menus.split(',')
          );
          // console.log(this.form);
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
          // console.log(this.$refs.tree.getCheckedKeys());
          // 设置menus的值
          // this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
          this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
          //   调取接口存值
          getRoleEdit(this.form)
            .then((res) => {
              this.$message.success(res.data.msg);
              //   刷新vuex
              this.getRoleList();
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
  mounted() {
    //   页面加载就判断vuex是否有menulist么有就添加
    if (this.menuList.length == 0) {
      this.getMenuList();
    }
  },
};
</script>

<style lang="stylus" scoped></style>