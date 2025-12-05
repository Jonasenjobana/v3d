1. canvasOverlay
- 经典的canvas和地图定位同步，负责引入一些事件和参数
- 接收渲染函数
2.gl-layer gl基类
- 管理canvasOverlay 传入渲染函数
- 创建webgl基本数据 program,shader
- 
3. point 继承gl-layer
- 缓存buffer