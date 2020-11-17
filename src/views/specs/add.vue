<template>
  <div>
    <el-dialog
      :title="userInfo.isAdd ? '添加规格' : '编辑规格'"
      :visible.sync="userInfo.isShow"
      :before-close="cancel"
      center
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 规格名称 prop为调用的规则的名 -->
        <el-form-item
          label="规格名称"
          :label-width="formLabelWidth"
          prop="specsname"
        >
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <!-- 商品规格属性 -->
        <el-form-item label="规格属性" :label-width="formLabelWidth">
          <div class="items" v-for="(item, index) in form.attrs" :key="index">
            <el-input v-model="form.attrs[index].value"></el-input>
            <el-button
              v-if="index == 0"
              type="primary"
              class="btn"
              @click="addAttr"
              >新增规格属性</el-button
            >
            <el-button v-else type="danger" class="btn" @click="delAttr(index)"
              >删除</el-button
            >
          </div>
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
import { getSpecsAdd, getSpecsEdit, getSpecsInfo } from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        specsname: [
          { required: true, message: "请输入规格名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   表单
      form: {
        specsname: "",
        attrs: [{ value: "" }],
        status: 1,
      },
      formLabelWidth: "120px",
    };
  },
  computed: {
    ...mapGetters({}),
  },
  props: ["userInfo"],
  methods: {
    ...mapActions({
      getSpecsList: "specs/getSpecsListAction",
      getSpecsCount: "specs/getSpecsCountAction",
    }),
    // 重置
    reset() {
      this.form = {
        specsname: "",
        attrs: [{ value: "" }],
        status: 1,
      };
      this.$refs['form'].resetFields();
    },
    // 添加事件
    add(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.attrs = this.form.attrs.map((item) => item.value).join(",");
          // console.log(this.form);
          getSpecsAdd(this.form)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getSpecsList();
              this.getSpecsCount();
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
    look(id) {
      // console.log(id);
      // 获取一条数据
      getSpecsInfo({ id })
        .then((res) => {
          if (res.data.code == 200) {
            // console.log(res);
            this.form = res.data.list[0];
            this.form.attrs = res.data.list[0].attrs.map((item) => ({
              value: item,
            }));
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
          this.form.attrs = this.form.attrs.map((item) => item.value).join(",");
          // console.log(this.form);
          getSpecsEdit(this.form)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getSpecsList();
              this.getSpecsCount();
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
    // 新增属性
    addAttr() {
      this.form.attrs.push({ value: "" });
    },
    // 删除属性
    delAttr(index) {
      this.form.attrs.splice(index, 1);
    },
  },
  mounted() {
    //   页面加载就判断vuex是否有menulist么有就添加
  },
};
</script>

<style lang="stylus" scoped>
.items
  display: flex
  margin-bottom: 20px
  .btn
    margin-left: 10px
</style>