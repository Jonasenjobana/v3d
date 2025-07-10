<template>
  <div class="echart-playground" ref="echartRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
const echartRef = ref();
const myChart = ref<echarts.ECharts | null>(null);
onMounted(() => {
  initEchart();
});
function initEchart() {
  myChart.value = echarts.init(echartRef.value as HTMLDivElement);
  var option: echarts.EChartsOption = {
    title: {
      text: "ECharts 入门示例",
    },
    tooltip: {},
    legend: {
      data: ["销量", "销量2", "销量3"],
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    dataset: {
        source: [
          ["类别", "销量", "销量2", "销量3"],
          ["衬衫", 5, 11, 45],
          ["羊毛衫", 20, 11, 92],
          ["雪纺衫", 36, 9, 51],
          ["裤子", 10, 10, 20],
          ["高跟鞋", 33, 44, 55],
          ["袜子", 77, 22, 55],
        ],
    },
    series: [
      {
        
        type: "custom",
        renderItem: function (params, api) {
          var categoryIndex = api.value(0); // x轴 类目轴所以没啥意义变成index
          var start = api.coord([categoryIndex, api.value(1)]); // x轴和y轴的值 转为画布坐标[x,y]
          var end = api.coord([categoryIndex, 0]);
          console.log(api.value(0), api.value(1), api.value(2), api.currentSeriesIndices());
          var size = [api.getWidth(), api.getHeight()];
          var height = end[1] - start[1];
          var rectShape = echarts.graphic.clipRectByRect(
            {
              x: 0,
              y: 0,
              width: size[0],
              height: size[1],
            },
            {
              x: start[0],
              y: start[1],
              width: 40,
              height: height,
            }
          );

          return {
            type: "group",
            children: [
              {
                type: "rect",
                shape: rectShape,
                style: {
                  fill: "#f00",
                },
              },
              {
                type: "circle",
                shape: {
                  cx: start[0],
                  cy: start[1],
                  r: 5,
                },
                style: {
                  fill: "#ff00ff",
                },
              },
              {
                type: "polyline",
                shape: {
                  points: [
                    [start[0], start[1]],
                    [start[0], start[1] + height],
                    [start[0] + 40, start[1] + height],
                    [start[0] + 40, start[1]],
                  ],
                },
              },
            ],
          };
        },
      },
    ] as echarts.SeriesOption[],
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.value.setOption(option);
  myChart.value.renderToCanvas();
}
</script>

<style scoped>
.echart-playground {
  height: 100%;
  width: 100%;
}
</style>
