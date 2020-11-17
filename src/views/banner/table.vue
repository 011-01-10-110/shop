<template>
  <div>
    <el-table
      :data="bannerList"
      border
      style="width: 100%"
      row-key="id"
    >
      <el-table-column
        prop="id"
        label="编号"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="轮播图标题"
        width="180"
      ></el-table-column>
      <el-table-column prop="img" label="图片" width="180">
        <template slot-scope="item">
          <div>
            <img class="imgw" :src="$imgUrl + item.row.img" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <div>
            <el-button v-if="item.row.status == 1" type="success" disabled
              >启用</el-button
            >
            <el-button v-else type="danger" disabled>禁用</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
  </div>
</template>

<script>
// 引入辅助性函数
import { mapActions, mapGetters } from "vuex";
// 引入接口
import { getBannerDelete } from "../../util/axios";
export default {
  data() {
    return {
      // bannerList: [],
    };
  },
  computed: {
    //   获取角色列表
    ...mapGetters({
      bannerList: "banner/getBannerList",
    }),
  },
  methods: {
    //   获取action方法
    ...mapActions({
      getBannerList: "banner/getBannerListAction",
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
          getBannerDelete({ id }).then((res) => {
            // 重新获取list和总数
            // bug：从最后删除会显示暂无数据
            this.getBannerList();
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
  },
  mounted() {
    //   已加载就调用action的方法存值
    this.getBannerList();
  },
};
</script>

<style lang="stylus" scoped>
.el-pagination
  text-align: center
.imgw
  width: 100px
  height: auto
</style>