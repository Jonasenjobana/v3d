## echart-gl 
### 安装
- 需要安装echart-gl依赖
- 引入echart-gl依赖
### 特性
1. geo3D （立体平面地图）
2. globe （球体地图）
- 注册地图相关 geojson
- series相关
    1. scatter3D 散点图
    2. bar3D 柱状3D
    3. lines3D 地图飞线 
    4. polygons3D 大量多边形可视化 （建筑）
    5. flowGL 粒子

## echart
1. 层级关系 zlevel 和 z
- zlevel控制画布层级 独立渲染
- z统一zlevel下的层级比较
- echart默认zlevel
    1. grid、polar < xAxis、yAxis <  series < markPoint、markLine < legend < graphbic
    2. series如果未定义z则按照数组顺序渲染
### series
1. custom
    - renderItem
        1. 返回zrender实例 返回多个值使用{type: 'group', children: [...]}
        2. 入参params, api
            - params 
            - api
                1. value(0) 获取data索引原始值
                2. coord([...]) 获取data所在图表的像素坐标
        3. 使用geo绘制操作和leaflet大差不差 经纬度转像素等
### 配置
1. 数据映射
    1. dataset 数据集
    2. series.encode 映射
    3. series.dimensions 维度名 (tooltip)