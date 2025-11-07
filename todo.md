# ai chat
1. md解析
2. eventmessage流数据处理
# machine learn
- tensorflow
# 3d
1. three.js
2. babylon.js
# node
# canvas
1. 图片编辑器
2. echart line scale
3. 频谱图、热力图
    - 热力图 [x, y, weight]
        1. createRadialGradient 绘制中心发散的渐变半径作为纹理
        2. createLinearGradient 绘制连续的颜色深度纹理
        3. 根据weight权重设置渲染透明度使用创建的中心发散半径纹理
        4. 获取到的alpha通道纹理 根据透明度权重 获取深度纹理所在坐标 涂上颜色
    - 频谱图定义了值与rgba的关系 每个采集点使用线性插值渐变过渡值
4. 粒子图
    - 双向线性插值法
# map
## 渲染结构
- 参考echart层级结构（轴、grid、series、tooltip、markpoint）各自分层 内部管理自定义元素层级
1. 公共图层
    1. 
2. 自定义图层 
    - 继承L.Layer
        1. 一个图层一个canvas
3. 绘制工具（绘制工具）自带事件
    - zrender
# DOM结构化 编程
## THREE结构化 react-three
## Canvas结构化 参考antd引擎类似
### 原理
1. 顶层canvas组件画布 存储three相关注入给子孙节点
2. 


1.自适应方案
- vuetify 断点
- 设计稿rem + postcss
2.主题方案
3.多组件库
4.微前端
5.seo
6.服务端渲染
7.ci/cd
8.数据埋点