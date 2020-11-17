<template>
  <div>
    <el-table :data="memberList" border style="width: 100%">
      <el-table-column prop="uid" label="用户编号" width="180"></el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
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
import { getMemberDelete } from "../../util/axios";
export default {
  data() {
    return {
      //   memberList: [],
      
    };
  },
  computed: {
    //   获取用户列表
    ...mapGetters({
      memberList: "member/getMemberList",
    }),
  },
  methods: {
    //   获取action方法
    ...mapActions({
      getMemberList: "member/getMemberListAction",
    }),
    //   编辑
    edit(uid) {
      this.$emit("edit", uid);
    },
   
  },
  mounted() {
    //   已加载就调用action的方法存值
    this.getMemberList();
    console.log(this.memberList);
  },
};
</script>

<style lang="stylus" scoped></style>