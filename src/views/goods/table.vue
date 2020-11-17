<template>
  <div>
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column
        prop="id"
        label="商品编号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="goodsname"
        label="商品名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="商品价格"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="market_price"
        label="市场价格"
        width="150"
      ></el-table-column>
      <el-table-column prop="img" label="图片" width="180"> 
        <template slot-scope="item">
          <div>
            <img v-if="item.row.img" class="imgw" :src="$imgUrl+item.row.img" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isnew" label="是否新品">
        <template slot-scope="item">
          <div>
            <el-button v-if="item.row.isnew == 1" type="success" disabled size="mini">是</el-button>
            <el-button v-else type="danger" disabled size="mini">否</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ishot" label="是否热卖">
        <template slot-scope="item">
          <div>
            <el-button v-if="item.row.ishot == 1" type="success" disabled size="mini">是</el-button>
            <el-button v-else type="danger" disabled size="mini">否</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <div>
            <el-button v-if="item.row.status == 1" type="success" disabled size="mini">启用</el-button>
            <el-button v-else type="danger" disabled>禁用</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="item">
          <div>
            <el-button type="primary" @click="edit(item.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="del(item.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="count"
      @current-change="currentChange"
      :page-size="size"
    >
    </el-pagination>
  </div>
</template>

<script>
// 引入辅助性函数
import { mapActions, mapGetters } from "vuex";
// 引入接口
import { getGoodsDelete } from "../../util/axios";
export default {
  data() {
    return {
      // goodsList: [],
    };
  },
  computed: {
    //   获取角色列表
    ...mapGetters({
      goodsList: "goods/getGoodsList",
      count: "goods/getGoodsCount",
      size: "goods/getUSerSize",
    }),
  },
  methods: {
    //   获取action方法
    ...mapActions({
      getGoodsList: "goods/getGoodsListAction",
      getGoodsCount: "goods/getGoodsCountAction",
      getGoodsPage: "goods/getGoodsPageAction",
    }),
    //   编辑
    edit(id) {
      this.$emit("edit", id);
    },
    // 删除
    del(id) {
      this.$confirm("确定要删除这条数据吗?！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getGoodsDelete({ id }).then((res) => {
            // 重新获取list和总数
            // bug：从最后删除会显示暂无数据
            this.getGoodsList();
            this.getGoodsCount();
            // 弹窗提示
            this.$message.success(res.data.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 换页
    currentChange(e) {
      //   console.log(e);
      this.getGoodsPage(e);
    },
  },
  mounted() {
    //   已加载就调用action的方法存值
    this.getGoodsList();
    // 获取总数
    this.getGoodsCount();
  },
};
</script>

<style lang="stylus" scoped>
.el-pagination
  text-align: center
.imgw
  width 100px
  height auto
</style>