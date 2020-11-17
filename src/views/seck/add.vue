<template>
  <div>
    <el-dialog
      :title="roleInfo.isAdd ? '添加活动' : '编辑活动'"
      :visible.sync="roleInfo.isShow"
      :before-close="cancel"
      center
    >
      <!-- rules规则验证的数组 -->
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 活动名称 prop为调用的规则的名 -->
        <el-form-item
          label="活动名称"
          :label-width="formLabelWidth"
          prop="title"
        >
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item label="活动期限" :label-width="formLabelWidth">
          <el-time-picker
            is-range
            v-model="time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
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
          <el-select
            v-model="form.second_cateid"
            placeholder="请选择二级分类"
            @change="secondChange(false)"
          >
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in cateListChild"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品 -->
        <el-form-item label="商品" :label-width="formLabelWidth" prop="goodsid">
          <el-select v-model="form.goodsid" placeholder="商品">
            <el-option
              :label="item.goodsname"
              :value="item.id"
              v-for="item in goods"
              :key="item.id"
            ></el-option>
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
  getSeckAdd,
  getSeckEdit,
  getCateList,
  getSeckInfo,
} from "../../util/axios";

export default {
  data() {
    return {
      // 验证规则
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   表单
      /* 
      | title    | 限时秒杀名称   |
      | begintime | 开始时间  |
      | endtime | 结束时间  |
      | first_cateid | 商品一级分类编号  |
      | second_cateid | 商品二级分类编号  |
      | goodsid | 商品编号  |
      | status | 状态1正常2禁用 |
      */
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      time: [
        new Date(), 
        new Date()
        ],
      goods: [],
      cateListChild: [],
      formLabelWidth: "120px",
    };
  },
  computed: {
    ...mapGetters({
      goodsList: "goods/getGoodsList",
      cateList: "cate/getCateList",
    }),
  },
  props: ["roleInfo"],
  methods: {
    ...mapActions({
      getGoodsList: "goods/getGoodsListAction",
      getCateList: "cate/getCateListAction",
      getSeckList: "seck/getSeckListAction",
    }),
    // 重置
    reset() {
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.$refs['form'].resetFields();
    },
    // 添加事件
    add(formName) {
      // 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //   调取接口存值
          this.form.begintime = this.time[0].getTime();
          this.form.endtime = this.time[1].getTime();
          // console.log(this.form);
          getSeckAdd(this.form)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                //   刷新vuex
                this.getSeckList();
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
      getSeckInfo({ id })
        .then((res) => {
          this.form = res.data.list;
          // console.log(this.form);
          this.form.id = id;

          this.firstChange(true);
          this.secondChange(true);
          this.time = [
            new Date(parseInt(this.form.begintime)),
            new Date(parseInt(this.form.endtime)),
          ];
          // console.log(this.time[0].toLocaleDateString());
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
          this.form.begintime = this.time[0].getTime();
          this.form.endtime = this.time[1].getTime();
          
          getSeckEdit(this.form)
            .then((res) => {
              this.$message.success(res.data.msg);
              //   刷新vuex
              this.getSeckList();
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
    // 一级分类选择
    firstChange(list) {
      // 一级选择获取二级列表
      this.cateListChild = this.cateList.filter(
        (item) => item.id == this.form.first_cateid
      )[0].children;
      // console.log(this.cateListChild);
      if(!list){
        this.form.second_cateid = '';
        this.form.goodsid = '';
      }
    },
    // 二级
    secondChange(id) {
      this.goods = this.goodsList.filter((item) => item.second_cateid == this.form.second_cateid);
      if(!id){
        this.form.goodsid = '';
      }
    },
  },
  mounted() {
    //   页面加载就判断vuex是否有catelist么有就添加
    if (this.cateList.length == 0) {
      this.getCateList();
    }
    if (this.goodsList.length == 0) {
      this.getGoodsList();
    }
  },
};
</script>

<style lang="stylus" scoped></style>