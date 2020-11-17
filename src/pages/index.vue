<template>
  <div>
    <el-container>
      <el-header center>xxx后台管理系统</el-header>
      <el-container>
        <el-aside width="200px">
            <!-- 导航 -->
            <v-nav></v-nav>
        </el-aside>
        <el-main>
          <!-- 面包屑 -->
            <bread></bread>
            <!-- 二级出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 引入左侧导航
import vNav from '../components/nav';
// 引入面包屑
import bread from '../components/el-bread';
export default {
    components:{
        vNav,
        bread
    }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl'
.el-header
  width: 100%
  color white
  text-align: center
  line-height 60px
  font-size $smillFontSize
  background: $foreBgColor

  
</style>