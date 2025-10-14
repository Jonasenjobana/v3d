# 工程
## 自动化
1. CI/CD
- github actions
    - 编写自动化配置在hook阶段执行命令 
## 规范
1. vue文件名采用首字母大写
2. 组件名引入到模板采用驼峰命名
3. main文件注册全局插件，尽量保持简洁，有配置项可以其他地方创建再引入到
4. 
## 库
1. Vuetify ElementUI
2. VueUse
3. Router
# v3
## 响应式
### v3 vs v2

### 响应式
- Ref和Reactive
- Shallow
## 组合式api
## 模板和virtual node
## 路由
## 表单
## vite
Echart 速查
配置按区域功能划分
- xAxis
- yAxis
- series // 组成数据 构成line\pie\scatter\bar等
- visualMap // echart用例筛选
- datazoom // 缩放
- grid // 容器
- title // 标题
- tooltip // hover详细

Vue语法速查
1. defineProps和defineEmits两种用法，只能二选一去声明 
    - 基于运行
    ```typescript
        defineProps({
            title: String,
            content: Object as PropType<any>,
            footer: {
                type: Array,
                default: () => null,
                validator: (v) => true,
                required: false
            }
        })
        defineEmits({
            update: (e: number) => {};
        })
    ```
    - 基于静态
        ```typescript
        interface Props {
            title: string
            content: any
            footer?: any[] | null
        }
        defineProps<Props>();

        defineEmits<{
            update: (e: number) => void
        }>();
        defineEmits<{
            update: [e: number]
        }>()
    ```
2. effectScope
    - 快速清空watch,watchEffect的副作用
    ```typescript
    const scope = effectScope.run(() => {
        watch(...);
        watchEffect(...);
        // 或者更深层的cb
    })
    // 清除作用域内所有副作用
    scope.stop();
    ```
Vuetify快速入门文档
1. 布局遵循由外到内的原则， 方向按照左、右、上、下的顺序排列，一般布局组件最内部应该是v-main 他会自动计算剩余空间
- 从左到右 优先级，如果有空间则按照组件自身规则占据空间 比如v-app-bar会占据剩余容器整个宽度
- 对于动态布局，有order属性，指定在dom顺序结构
2. 组件都自带响应式特征

# lottie json解析 
## assets 资源
## layers 图层
### ks 变化属性
- o opacity 不透明度
- r rotate 旋转
- p position 位置
- a anchor 锚点
- s scale 缩放
#### 内部属性
- a 为0 静态 1 动态
- k 关键帧变化属性
##### k 内部关键帧属性
- t 关键帧帧数
- s 初始值
- i和o lottie内部贝塞尔曲线出入参数默认写死 不用处理

线性插值计算关键帧变化量

