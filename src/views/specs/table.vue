<template>
  <div>
    <el-table :data="specsList" border style="width: 100%">
      <el-table-column prop="id" label="规格编号" width="180"></el-table-column>
      <el-table-column
        prop="specsname"
        label="规格名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="rolename" label="规格属性" width="180" align="center">
        <template slot-scope="item">
          <div>
              <el-button type="info" plain disabled v-for="attr in item.row.attrs" :key="attr">{{attr}}</el-button>
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
import { getSpecsDelete } from "../../util/axios";
export default {
  data() {
    return {
      // specsList: [],
    };
  },
  computed: {
    //   获取角色列表
    ...mapGetters({
      specsList: "specs/getSpecsList",
      count: "specs/getSpecsCount",
      size: "specs/getUSerSize",
    }),
  },
  methods: {
    //   获取action方法
    ...mapActions({
      getSpecsList: "specs/getSpecsListAction",
      getSpecsCount: "specs/getSpecsCountAction",
      getSpecsPage: "specs/getSpecsPageAction",
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
          getSpecsDelete({ id }).then((res) => {
            // 重新获取list和总数
            // bug：从最后删除会显示暂无数据
            this.getSpecsList();
            this.getSpecsCount();
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
      this.getSpecsPage(e);
    },
  },
  mounted() {
    //   已加载就调用action的方法存值
    this.getSpecsList();
    // 获取总数
    this.getSpecsCount();
  },
};
</script>

<style lang="stylus" scoped>
.el-pagination
  text-align: center
</style>