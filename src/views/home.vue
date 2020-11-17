<template>
  <div>
    <div id="main"></div>
  </div>
</template>

<script>
import Echart from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echart.init(document.getElementById("main"));

    // 指定图表的配置项和数据
    myChart.setOption({
      title: {
        text: "本周访问量",
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
        },
      ],
    });
  },
};
</script>

<style scoped>
#main {
  width: 500px;
  height: 500px;
  margin: 0 auto;
}
</style>