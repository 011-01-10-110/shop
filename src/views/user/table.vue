<template>
  <div>
    <el-table :data="userList" border style="width: 100%">
      <el-table-column
        prop="uid"
        label="用户编号"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="username"
        label="用户名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="rolename"
        label="所属角色"
        width="180"
      ></el-table-column>
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
            <el-button type="primary" @click="edit(item.row.uid)"
              >编辑</el-button
            >
            <el-button type="danger" @click="del(item.row.uid)">删除</el-button>
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
import { getUserDelete } from "../../util/axios";
export default {
  data() {
    return {
      // userList: [],
    };
  },
  computed: {
    //   获取角色列表
    ...mapGetters({
      userList: "user/getUserList",
      count: "user/getUserCount",
      size: "user/getUSerSize",
    }),
  },
  methods: {
    //   获取action方法
    ...mapActions({
      getUserList: "user/getUserListAction",
      getUserCount: "user/getUserCountAction",
      getUserPage: "user/getUserPageAction",
    }),
    //   编辑
    edit(uid) {
      this.$emit("edit", uid);
    },
    // 删除
    del(uid) {
      this.$confirm("确定要删除这条数据吗?！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getUserDelete({ uid }).then((res) => {
            // 重新获取list和总数
            // bug：从最后删除会显示暂无数据
            this.getUserList();
            this.getUserCount();
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
      this.getUserPage(e);
    },
  },
  mounted() {
    //   已加载就调用action的方法存值
    this.getUserList();
    // 获取总数
    this.getUserCount();
  },
};
</script>

<style lang="stylus" scoped>
.el-pagination
  text-align: center
</style>