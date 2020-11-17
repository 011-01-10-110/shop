<template>
  <div>
    <el-table
      :data="cateList"
      border
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column
        prop="id"
        label="分类编号"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="catename"
        label="分类名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="img" label="图片" width="180">
        <template slot-scope="item">
          <div>
            <img v-if="item.row.img" class="imgw" :src="$imgUrl + item.row.img" alt="" />
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
import { getCateDelete } from "../../util/axios";
export default {
  data() {
    return {
      // cateList: [],
    };
  },
  computed: {
    //   获取角色列表
    ...mapGetters({
      cateList: "cate/getCateList",
    }),
  },
  methods: {
    //   获取action方法
    ...mapActions({
      getCateList: "cate/getCateListAction",
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
          getCateDelete({ id }).then((res) => {
            // 重新获取list和总数
            // bug：从最后删除会显示暂无数据
            this.getCateList();
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
    this.getCateList();
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