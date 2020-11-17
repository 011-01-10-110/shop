<template>
  <div>
    <!-- <el-button type="primary" @click="add">添加</el-button> -->
    <v-table @edit="edit"></v-table>
    <v-dialog ref="dialog" :memberInfo="memberInfo" @cancel="cancel"></v-dialog>
  </div>
</template>

<script>
import vTable from "./table";
import vDialog from "./add";
export default {
  data() {
    return {
      memberInfo: {
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
      this.memberInfo.isShow = true;
      this.memberInfo.isAdd = true;
    },
    // 关闭
    cancel(e) {
      this.memberInfo.isShow = e;
    },
    // 编辑
    edit(e) {
      this.memberInfo.isShow = true;
      this.memberInfo.isAdd = false;
      this.$refs.dialog.look(e);
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>