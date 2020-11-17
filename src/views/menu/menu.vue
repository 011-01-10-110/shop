<template>
  <div class="menu">
    <el-button type="primary" @click="add">添加</el-button>
    <v-table @edit="edit"></v-table>
    <v-dialog ref="dialog" :addInfo="addInfo" @cencal="cencal"></v-dialog>
  </div>
</template>

<script>
// 表单组件
import vTable from "./table";
// 弹窗组件
import vDialog from "./add";
export default {
  data() {
    return {
      addInfo: {
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
    // 添加
    add() {
      this.addInfo.isAdd = true;
      this.addInfo.isShow = true;
    },
    // 取消
    cencal(e) {
      this.addInfo.isShow = e;
    },
    // 编辑
    edit(e) {
      this.addInfo.isAdd = false;
      // 打开弹窗
      this.addInfo.isShow = true;
      // 获取弹窗数据
      this.$refs.dialog.look(e)
    },
  },
};
</script>

<style lang="stylus" scoped></style>