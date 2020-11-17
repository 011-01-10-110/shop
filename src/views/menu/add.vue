<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd?'添加菜单':'编辑菜单'"
      :visible.sync="addInfo.isShow"
      :before-close="cencal"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 菜单名称 -->
        <el-form-item
          label="菜单名称"
          prop="title"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.title"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 上级菜单 -->
        <el-form-item label="上级菜单" prop="pid" :label-width="formLabelWidth">
          <el-select
            v-model="form.pid"
            placeholder="请选择上级菜单"
            @change="changeMenu"
          >
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in menuList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" :label-width="formLabelWidth">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item
          v-if="form.type === 1"
          label="菜单图标"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.icon" placeholder="请选择图标">
            <el-option
              v-for="item in iconPath"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 菜单地址 -->
        <el-form-item v-else label="菜单地址" :label-width="formLabelWidth">
          <el-select v-model="form.url" placeholder="请选择地址">
            <el-option
              v-for="item in indexChild"
              :key="item.path"
              :label="item.name"
              :value="item.path"
            >
            </el-option>
          </el-select>
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
      <!-- 底部操作区 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cencal">取 消</el-button>
        <el-button v-if="addInfo.isAdd" type="primary" @click="add('form')">添 加</el-button>
        <el-button v-else type="primary" @click="edit('form')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入接口
import { getMenuAdd,getMenuInfo,getMenuEdit } from "../../util/axios";
// 引入辅助函数
import { mapActions, mapGetters } from "vuex";
// 引入导出的路由
import { indexChild } from "../../router";
export default {
  data() {
    return {
      form: {
        title: "", //标题
        pid: 0, //上级分类编号 默认是0 是顶级
        icon: "", //图标
        type: 1, //类型1目录2菜单
        url: "", //菜单地址
        status: 1, //状态1正常2禁用
      },
      // 规则
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        pid: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
      },
      // 宽度
      formLabelWidth: "120px",
      // 图标
      iconPath: [
        "el-icon-s-tools",
        "el-icon-setting",
        "el-icon-s-goods",
        "el-icon-goods",
      ],
      // 路由地址数组
      indexChild,
    };
  },
  // 弹窗状态
  props: ["addInfo"],
  computed: {
    // 获取菜单列表
    ...mapGetters({
      menuList: "menu/getMenuList",
    }),
  },
  methods: {
    // 重置事件
    reset() {
      this.form = {
        title: "", //标题
        pid: 0, //上级分类编号 默认是0 是顶级
        icon: "", //图标
        type: 1, //类型1目录2菜单
        url: "", //菜单地址
        status: 1, //状态1正常2禁用
      };
      this.$refs['form'].resetFields();
    },
    ...mapActions({
      getMenuList: "menu/getMenuListAction",
    }),
    // 取消
    cencal() {
      // 传给父级关闭的值
      this.$emit("cencal", false);
      // 重置表单
      this.reset();
    },
    // 添加
    add(formName) {
      // validate 验证
      this.$refs[formName].validate((valid) => {
        // 添加
        if (valid) {
          // 使用接口添加数据
          // console.log(this.form);
          getMenuAdd(this.form)
            .then((res) => {
              // console.log(res);
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                //关闭弹框
                this.cencal();
                //重新获取列表
                this.getMenuList();
              }else{
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              this.$message.error(res.data.msg);
            });
        } else {
          this.$message({
            message: "请填写必填项",
            type: "error",
          });
          return false;
        }
      });
    },
    //改变上级菜单
    changeMenu() {
      // 判断pid改变type类型
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    //查看一条事件
    look(id){
      // console.log(id,'形参')
      //调取查看列表
      getMenuInfo({id})
      .then(res=>{
        // console.log(res,'一条数据')
        this.form = res.data.list
        this.form.id = id
      })
      .catch(err=>{
        console.log(err);
      })
    },
    // 更新修改数据
    edit(formName){
      // validate 验证
      this.$refs[formName].validate((valid) => {
        // 修改
        if (valid) {
          // 使用接口修改数据
          // console.log(this.form);
          getMenuEdit(this.form)
            .then((res) => {
              // console.log(res);
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                //关闭弹框
                this.cencal();
                //重新获取列表
                this.getMenuList();
              }else{
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              this.$message.error(res.data.msg);
            });
        } else {
          this.$message({
            message: "请填写必填项",
            type: "error",
          });
          return false;
        }
      });
    }
  },
};
</script>

<style lang="stylus" scoped></style>