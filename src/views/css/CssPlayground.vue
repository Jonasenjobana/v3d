<template>
  <div>
    <div class="echart" ref="echartRef"></div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import { noise } from "@/utils/random";
import axios from "axios";
import { meterToLatlng } from "@/utils/map/map.caculate";
import { tooltip } from "leaflet";
const echartRef = ref();
const echartInstance = ref();
onMounted(() => {
  const instance = (echartInstance.value = echarts.init(echartRef.value));
  axios.get("/json/shenzhen.json").then((res) => {
    echarts.registerMap("shenzhen", res.data);
    instance.setOption(option);
  });
  // 2. 深圳地理范围（经纬度大致范围，用于生成随机数据）
  const shenzhenRange = {
    lng: [113.75, 114.62], // 经度范围
    lat: [22.45, 22.86], // 纬度范围
  };

  // 3. 随机生成热力数据（1000个点）
  function generateRandomHeatData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      // 随机经度（在深圳经度范围内）
      const lng = shenzhenRange.lng[0] + Math.random() * (shenzhenRange.lng[1] - shenzhenRange.lng[0]);
      // 随机纬度（在深圳纬度范围内）
      const lat = shenzhenRange.lat[0] + Math.random() * (shenzhenRange.lat[1] - shenzhenRange.lat[0]);
      // 随机热力值（0-100）
      const value = Math.floor(Math.random() * 100);
      data.push([Number(lng.toFixed(6)), Number(lat.toFixed(6)), value]); // 保留6位小数
    }
    return data;
  }
  const a = generateRandomHeatData(200);
  const option = {
    tooltip: {
        formatter: (params: any) => {
        }
    },
    // 视觉映射（可选，增强交互）
    visualMap: {
      type: "continuous",
      dimension: 2, // 关联数据的第 3 个维度（高度）
      range: [0, 2000],
      inRange: {
        color: ['#EDE7F6','#FCE4EC',"#FFE0B2", "#FF9800", "#FF5722", '#E64A19'], // 颜色渐变
      },
      orient: "vertical",
      left: 20,
      bottom: 20,
      title: {
        text: "高度",
      },
      seriesIndex: 1
    },
    geo: {
      map: "shenzhen",
      roam: true,
      tooltip: {
        show: false
      },
      emphasis: {
        disabled: true
      },
      center: [113.9, 22.55],
      zoom: 18
    },
    series: [
      {
        type: "custom",
        coordinateSystem: "geo",
        renderItem: (params: any, api: any) => {
          const v = api.coord([api.value(0), api.value(1)]);
          const colors = ["#00f", "#f00", "#0f2"];
          const circles = [...Array(3)].filter((el, idx) => api.value(2+idx)).map((el, idx) => {
            const { lat, lng } = meterToLatlng({ lat: api.value(1), lng: api.value(0) }, api.value(2+idx));
            const [x, y] = api.coord([lng, lat]);
            const radius = Math.abs(x - v[0]);
            return {
              type: "circle",
              position: v,
              shape: {
                cx: 0,
                cy: 0,
                r: radius,
              },
              style: {
                stroke: colors[idx],
                fill: "none",
                lineDash: [3, 3],
              },
              extra: {
                radius,
                info: `哈哈哈${Math.random()}`
              }
            };
          });
          return {
            type: "group",
            children: [...circles],
          };
        },
        silent: true,
        data: [[113.9, 22.55, 500, 1000, 2000]],
      },
      {
        id: 'heatmap',
        type: "heatmap",
        coordinateSystem: "geo",
        data: [...a, [113.9, 22.559, 1000], [113.9, 22.55, 1000]],
        emphasis: {
            disabled: false
        },
        tooltip: {
            formatter: '123'
        }
      },
      //   {
      //     type: "bar3D",
      //     coordinateSystem: "geo3D",
      //     data: a,
      //     symbolSize: 10, // 散点放大，确保可见
      //     itemStyle: {
      //       color: "#ff6b6b", // 亮红色，与深色地图对比
      //       opacity: 1, // 不透明
      //     },
      //   },
      //   {
      //     type: "map3D",
      //     map: "shenzhen",
      //   },
      //   //   {
      //   //     name: "区域数据",
      //   //     type: "map", // 类型为地图
      //   //     mapType: "china", // 地图类型（中国地图）
      //   //     roam: true, // 允许缩放和平移
      //   //     label: {
      //   //       show: true, // 显示省份名称
      //   //       fontSize: 12,
      //   //       color: "#666",
      //   //     },
      //   //     data: mapData, // 绑定数据
      //   //     // 地图样式调整
      //   //     itemStyle: {
      //   //       borderColor: "#fff", // 区域边框颜色
      //   //       borderWidth: 1, // 边框宽度
      //   //     },
      //   //     // 高亮样式（鼠标hover时）
      //   //     emphasis: {
      //   //       itemStyle: {
      //   //         areaColor: "#ffcc00", // 高亮时的区域颜色
      //   //       },
      //   //       label: {
      //   //         color: "#000", // 高亮时的文字颜色
      //   //         fontWeight: "bold",
      //   //       },
      //   //     },
      //   //   },
      //     {
      //       name: "地图热力图",
      //       type: "heatmap",
      //       coordinateSystem: "geo",
      //       data: generateRandomHeatData(15),
      //     },
    ],
  };
});
// 生成中国城市热力图数据：[经度, 纬度, 商业活跃度权重]
function generateCityHeatmapData() {
  // 中国主要城市经纬度（部分）
  const cities = [
    { name: "北京", lng: 116.4074, lat: 39.9042 },
    { name: "上海", lng: 121.4737, lat: 31.2304 },
    { name: "广州", lng: 113.2644, lat: 23.1291 },
    { name: "深圳", lng: 114.0579, lat: 22.5431 },
    { name: "杭州", lng: 120.1551, lat: 30.2741 },
    { name: "成都", lng: 104.0665, lat: 30.5723 },
    { name: "武汉", lng: 114.3055, lat: 30.5928 },
    { name: "南京", lng: 118.7969, lat: 32.0603 },
    { name: "重庆", lng: 106.5504, lat: 29.563 },
    { name: "西安", lng: 108.954, lat: 34.2652 },
    { name: "郑州", lng: 113.6654, lat: 34.7472 },
    { name: "青岛", lng: 120.3826, lat: 36.0671 },
    { name: "苏州", lng: 120.6195, lat: 31.2993 },
    { name: "长沙", lng: 112.9822, lat: 28.1122 },
    { name: "沈阳", lng: 123.429, lat: 41.7968 },
    { name: "天津", lng: 117.2009, lat: 39.0842 },
    { name: "合肥", lng: 117.283, lat: 31.8611 },
    { name: "厦门", lng: 118.0894, lat: 24.4798 },
    { name: "昆明", lng: 102.7183, lat: 25.0454 },
    { name: "哈尔滨", lng: 126.6376, lat: 45.8038 },
  ];

  // 为每个城市生成权重（模拟商业活跃度）
  return cities.map((city) => {
    let baseWeight;
    // 一线城市权重更高（70-100）
    if (["北京", "上海", "广州", "深圳"].includes(city.name)) {
      baseWeight = 70 + Math.random() * 30;
    }
    // 新一线城市次之（50-80）
    else if (["杭州", "成都", "武汉", "南京", "重庆"].includes(city.name)) {
      baseWeight = 50 + Math.random() * 30;
    }
    // 其他城市（30-60）
    else {
      baseWeight = 30 + Math.random() * 30;
    }
    // 取整并限制在1-100
    const weight = Math.max(1, Math.min(100, Math.round(baseWeight)));
    return [city.lng, city.lat, weight];
  });
}
</script>

<style scoped>
.echart {
  background-color: aliceblue;
  height: 500px;
  width: 500px;
}
</style>
