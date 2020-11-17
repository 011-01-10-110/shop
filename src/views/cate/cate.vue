<template>
  <div>
    <el-button type="primary" @click="add">添加</el-button>
    <v-table @edit="edit"></v-table>
    <v-dialog ref="dialog" :userInfo="userInfo" @cancel="cancel"></v-dialog>
  </div>
</template>

<script>
import vTable from "./table";
import vDialog from "./add";
export default {
  data() {
    return {
      userInfo: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  components: {
    vTable,
    vDialog,
  },
  methods: {
    // 打开添加
    add() {
      this.userInfo.isShow = true;
      this.userInfo.isAdd = true;
    },
    // 关闭
    cancel(e) {
      this.userInfo.isShow = e;
    },
    // 编辑
    edit(e) {
      this.userInfo.isShow = true;
      this.userInfo.isAdd = false;
      this.$refs.dialog.look(e);
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>