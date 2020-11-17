<template>
  <div>
    <el-dialog
      :title="userInfo.isAdd ? '添加商品' : '编辑商品'"
      :visible.sync="userInfo.isShow"
      :before-close="cancel"
      center
      @opened="createEditor"
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 一级分类 -->
        <el-form-item
          label="一级分类"
          :label-width="formLabelWidth"
          prop="first_cateid"
        >
          <el-select
            v-model="form.first_cateid"
            placeholder="请选择一级分类"
            @change="firstChange(false)"
          >
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in cateList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 二级分类 -->
        <el-form-item
          label="二级分类"
          :label-width="formLabelWidth"
          prop="second_cateid"
        >
          <el-select v-model="form.second_cateid" placeholder="请选择二级分类">
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in cateListChild"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 商品名称 prop为调用的规则的名 -->
        <el-form-item
          label="商品名称"
          :label-width="formLabelWidth"
          prop="goodsname"
        >
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <!-- 价格 prop为调用的规则的名 -->
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <!-- 市场价格 prop为调用的规则的名 -->
        <el-form-item
          label="市场价格"
          :label-width="formLabelWidth"
          prop="market_price"
        >
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>

        <!-- 图片 -->
        <el-form-item label="图片" :label-width="formLabelWidth" prop="img">
          <el-upload
            action="#"
            :file-list="fileList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1"
            :on-exceed="onExceed"
            :on-change="onChange"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <!-- 商品规格 -->
        <el-form-item
          label="商品规格"
          :label-width="formLabelWidth"
          prop="specsid"
        >
          <el-select
            v-model="form.specsid"
            placeholder="请选择商品规格"
            @change="specsChange(false)"
          >
            <el-option
              :label="item.specsname"
              :value="item.id"
              v-for="item in specsList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 规格属性 -->
        <el-form-item
          label="规格属性"
          :label-width="formLabelWidth"
          prop="specsattr"
        >
          <el-select
            v-model="form.specsattr"
            placeholder="请选择规格属性"
            multiple
          >
            <el-option
              :label="item"
              :value="item"
              v-for="item in specsChild"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 是否新品 -->
        <el-form-item label="是否新品" prop="isnew">
          <el-radio-group v-model="form.isnew">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 是否热卖 -->
        <el-form-item label="是否热卖" prop="ishot">
          <el-radio-group v-model="form.ishot">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
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
        <!-- 商品描述 -->
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <!-- <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 8 }"
            placeholder="请输入内容"
            v-model="form.description"
            resize="none"
          >
          </el-input> -->
          <div id="editor"></div>
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
// editor
import E from "wangeditor";
// 辅助型函数
import { mapActions, mapGetters } from "vuex";
// 获取接口
import { getGoodsAdd, getGoodsEdit, getGoodsInfo } from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "blur" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "blur" },
        ],
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        market_price: [
          { required: true, message: "请输入市场价格", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        specsid: [
          { required: true, message: "请选择商品规格", trigger: "blur" },
        ],
        specsattr: [
          { required: true, message: "请选择规格属性", trigger: "blur" },
        ],
      },
      //   表单
      form: {
        first_cateid: "", // 一级分类编号 int
        second_cateid: "", // 二级分类编号 int
        goodsname: "", // 商品名称
        price: "", // 商品价格  带小数点
        market_price: "", // 市场价格 带小数点
        img: "", // 商品图片（文件）
        description: "", // 商品描述
        specsid: "", // 商品规格编号 int
        specsattr: "", // 商品规格属性
        isnew: 1, // 是否新品 1是2否
        ishot: 1, // 是否热卖推荐 1是2否
        status: 1,
      },
      editor: null, // 编辑器变量
      fileList: [], // 图片地址
      imgUrl: "",
      formLabelWidth: "120px",
      dialogVisible: false,
      dialogImageUrl: "",
      roleList: [],
      cateListChild: [],
      specsChild: [],
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/getCateList",
      specsList: "specs/getSpecsList",
    }),
  },
  props: ["userInfo"],
  methods: {
    ...mapActions({
      getCateList: "cate/getCateListAction",
      getSpecsList: "specs/getSpecsListAction",
      getGoodsList: "goods/getGoodsListAction",
      getGoodsCount: "goods/getGoodsCountAction",
    }),
    // 重置
    reset() {
      this.form = {
        first_cateid: "", // 一级分类编号 int
        second_cateid: "", // 二级分类编号 int
        goodsname: "", // 商品名称
        price: "", // 商品价格  带小数点
        market_price: "", // 市场价格 带小数点
        img: "", // 商品图片（文件）
        description: "", // 商品描述
        specsid: "", // 商品规格编号 int
        specsattr: "", // 商品规格属性
        isnew: 1, // 是否新品 1是2否
        ishot: 1, // 是否热卖推荐 1是2否
        status: 1,
      };
      this.fileList = [];
      this.$refs["form"].resetFields();
      // 销毁编辑器
      // this.editor.destroy();
      // this.editor = null;
    },
    // 添加事件
    add(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          this.form.price = (this.form.price * 1).toFixed(2);
          this.form.market_price = (this.form.market_price * 1).toFixed(2);
          // console.log(typeof this.form.price);
          // console.log(this.form);
          //我们的参数不能用form表单，我们要FormData对象形式
          //把普通表单改成FormData
          this.form.specsattr = this.form.specsattr
            ? this.form.specsattr.join(",")
            : "";
          this.form.description = this.editor.txt.html();
          let data = this.form;
          let file = new FormData();
          //必须通过append 去添加它的属性
          for (let i in data) {
            file.append(i, data[i]);
          }
          //添加img参数
          file.append("img", this.imgUrl);
          getGoodsAdd(file)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getGoodsList();
              this.getGoodsCount();
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
      getGoodsInfo({ id })
        .then((res) => {
          if (res.data.code == 200) {
            // console.log(res);
            // 设置表单
            this.form = res.data.list;
            this.form.id = id;
            // 设置属性
            this.form.specsattr = this.form.specsattr
              ? this.form.specsattr.split(",")
              : [];
            this.form.price = this.form.price.toString();
            this.form.market_price = this.form.market_price.toString();
            // console.log(this.form);
            // 设置图片
            this.fileList = this.form.img
              ? [{ url: `${this.$imgUrl}${this.form.img}` }]
              : [];
            // 设置二级分类
            this.firstChange(true);
            this.specsChange(true);
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
          this.form.price = (this.form.price * 1).toFixed(2);
          this.form.market_price = (this.form.market_price * 1).toFixed(2);
          this.form.specsattr = this.form.specsattr
            ? this.form.specsattr.join(",")
            : "";
          this.form.description = this.editor.txt.html();
          // console.log(typeof this.form.price);
          // console.log(this.form);
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
          getGoodsEdit(file)
            .then((res) => {
              // console.log(res);
              this.$message.success(res.data.msg);
              // 重新获取list和总数
              this.getGoodsList();
              this.getGoodsCount();
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
    // 图片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onExceed(files, fileList) {
      this.$message.error("超出数量限制，只能上传一张");
    },
    // 图片改变
    onChange(file, fileList) {
      this.imgUrl = file.raw;
    },
    // 一级分类选择
    firstChange(list) {
      // 一级选择获取二级列表
      this.cateListChild = this.cateList.filter(
        (item) => item.id == this.form.first_cateid
      )[0].children;
      // console.log(this.cateListChild);
      if (!list) {
        this.form.second_cateid = "";
      }
    },
    // 一级规格选择
    specsChange(list) {
      // 一级选择获取二级列表
      this.specsChild = this.specsList.filter(
        (item) => item.id == this.form.specsid
      )[0].attrs;
      // console.log(this.specsChild);
      if (!list) {
        this.form.specsattr = "";
      }
    },
    // 文本编辑器
    createEditor() {
      // 文本编辑器
      this.editor = new E("#editor");
      this.editor.create();
      this.editor.txt.html(this.form.description);
    },
  },
  mounted() {
    //   页面加载就判断vuex是否有menulist么有就添加
    if (this.cateList.length == 0) {
      this.getCateList();
    }
    if (this.specsList.length == 0) {
      this.getSpecsList();
    }
  },
};
</script>

<style lang="stylus" scoped></style>