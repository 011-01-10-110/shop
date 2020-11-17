<template>
  <div>
    <el-table
      :data="menuList"
      border
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
      >>

      <el-table-column prop="id" label="菜单编号" width="180"></el-table-column>

      <el-table-column
        prop="title"
        label="菜单名称"
        width="180"
      ></el-table-column>

      <el-table-column prop="pid" label="上级菜单"> </el-table-column>

      <el-table-column prop="icon" label="菜单图标">
        <!-- 添加区域槽口获取row里的icon显示图标 -->
        <template slot-scope="item">
          <div>
            <i :class="item.row.icon"></i>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="url" label="菜单地址"> </el-table-column>

      <el-table-column prop="status" label="状态"> </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" size="small" @click="edit(item.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="del(item)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 引入辅助函数
import { mapActions, mapGetters } from "vuex";
// 引入接口
import { getMenuDelete } from "../../util/axios";
export default {
  data() {
    return {
      // menuList: [],
    };
  },
  computed: {
    // 获取菜单表
    ...mapGetters({
      menuList: "menu/getMenuList",
    }),
  },
  methods: {
    // 解构出actions函数
    ...mapActions({
      getMenuList: "menu/getMenuListAction",
    }),
    //   删除项
    del(item) {
      this.$confirm("确定要删除这条数据吗?！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getMenuDelete({ id: item.row.id })
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                //重新触发调取列表
                this.getMenuList();
              }
            })
            .catch((err) => {
              this.message.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑
    edit(val) {
      this.$emit("edit", val.id);
    },
  },
  mounted() {
    // 一打开就调用获取列表
    this.getMenuList();
  },
};
</script>

<style lang="stylus" scoped></style>