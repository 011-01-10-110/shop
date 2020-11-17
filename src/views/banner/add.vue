<template>
  <div>
    <el-dialog
      :title="userInfo.isAdd ? '添加轮播图' : '编辑轮播图'"
      :visible.sync="userInfo.isShow"
      :before-close="cancel"
      center
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 标题 prop为调用的规则的名 -->
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title"></el-input>
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
import { getBannerAdd, getBannerEdit, getBannerInfo } from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   表单
      form: {
        title: "",
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
      bannerList: "banner/getBannerList",
    }),
  },
  props: ["userInfo"],
  methods: {
    ...mapActions({
      getBannerList: "banner/getBannerListAction",
    }),
    // 重置
    reset() {
      this.form = {
        title: "",
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
          //console.log(file.get('bannername'),'文件')

          //   // console.log(this.form);
          getBannerAdd(file)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getBannerList();
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
      getBannerInfo({ id })
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

          getBannerEdit(file)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getBannerList();
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