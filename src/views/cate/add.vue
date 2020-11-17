<template>
  <div>
    <el-dialog
      :title="userInfo.isAdd ? '添加商品分类' : '编辑商品分类'"
      :visible.sync="userInfo.isShow"
      :before-close="cancel"
      center
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 所属分类 -->
        <el-form-item label="上级分类" :label-width="formLabelWidth" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择所属分类">
            <el-option label="一级分类" :value="0"></el-option>
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in cateList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 分类名称 prop为调用的规则的名 -->
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          prop="catename"
        >
          <el-input v-model="form.catename"></el-input>
        </el-form-item>
        <!-- 图片 -->
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            :file-list="fileList"
            :on-change="onChange"
            :auto-upload="false"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            :limit="1"
            :on-exceed="onExceed"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
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
import { getCateAdd, getCateEdit, getCateInfo } from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        pid: [{ required: true, message: "请选择所属分类", trigger: "change" }],
        catename: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   表单
      form: {
        pid: "", // 数值
        catename: "",
        img: "",
        status: 1,
      },
      formLabelWidth: "120px",
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [], // 图片
      imgUrl: "",
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/getCateList",
    }),
  },
  props: ["userInfo"],
  methods: {
    ...mapActions({
      getCateList: "cate/getCateListAction",
    }),
    // 重置
    reset() {
      this.form = {
        pid: "", // 数值
        catename: "",
        img: "",
        status: 1,
      };
      this.fileList = [];
      this.$refs['form'].resetFields();
    },
    // 添加事件
    add(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //我们的参数不能用form表单，我们要FormData对象形式
          //把普通表单改成FormData
          let data = this.form;
          let file = new FormData();
          //必须通过append 去添加它的属性
          for (let i in data) {
            file.append(i, data[i]);
          }
          //添加img参数
          file.append("img", this.imgUrl);
          //直接打印FormData不好用，要用get去取值
          //console.log(file.get('catename'),'文件')

          //   // console.log(this.form);
          getCateAdd(file)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getCateList();
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
      // console.log(uid);
      // 获取一条数据
      getCateInfo({ id })
        .then((res) => {
          if (res.data.code == 200) {
            //   console.log(res);
            this.form = res.data.list;
            this.form.id = id;
            this.fileList = this.form.img
              ? [{ url: `${this.$imgUrl}${this.form.img}` }]
              : [];
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
          //我们的参数不能用form表单，我们要FormData对象形式
          //把普通表单改成FormData
          let data = this.form;
          let file = new FormData();
          //必须通过append 去添加它的属性
          for (let i in data) {
            file.append(i, data[i]);
          }
          //添加img参数
          this.imgUrl = this.imgUrl ? this.imgUrl : this.form.img;
        //   console.log(this.imgUrl);
          file.append("img", this.imgUrl);
          //直接打印FormData不好用，要用get去取值
          //   console.log(file.get("img"), "文件");

          getCateEdit(file)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getCateList();
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
    // 移出img
    handleRemove(file, fileList) {
      //   console.log(file, fileList);
    },
    // 放大img
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 超出个数限制
    onExceed() {
      this.$message.error("超出数量限制，只能上传一张");
    },
    // 图片改变
    onChange(file, fileList) {
      this.imgUrl = file.raw;
    },
  },
  mounted() {},
};
</script>

<style lang="stylus" scoped></style>