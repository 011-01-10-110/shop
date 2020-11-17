<template>
  <div>
    <el-menu
      :default-active="defaultActive"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      router
    >
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- 遍历menu顶级列表 -->
      <el-submenu :index="item.id.toString()" v-for="item in getuserInfo.menus" :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <!-- 二级列表 -->
        <el-menu-item :index="menu.url" v-for="menu in item.children" :key="menu.id">
          <span slot="title">{{menu.title}}</span>
        </el-menu-item>
      </el-submenu>

    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      defaultActive: "/home",
    };
  },
  computed: {
    ...mapGetters(['getuserInfo']),
  },
  methods: {
    // ...mapActions({
    //   getMenuList: "menu/getMenuListAction",
    // }),
  },
  mounted() {
    this.defaultActive = this.$route.path;
    // this.getMenuList();
    // console.log(this.$route.path);
  },
};
</script>

<style lang="stylus" scoped>
.el-menu
  height: 90vh
  background: $foreBgColor
</style>