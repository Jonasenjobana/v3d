# WebComponent
# polymerjs
# PetiteVue + WebComponent 加强原生html+js项目
1. PetiteVue 具有vue简单版语法
- v-if
- v-model
- @ 事件
- v-for 无法解构复杂对象
- 特殊语法
    - v-effect PetiteVue特殊语法 = WatchEffect
    - vue:mounted 特殊语法
    - vue:unmounted 
    - v-scope 定义数据区域
```javascript
// 全局定义
<div v-scope></div>
createApp({
    data: 1
}).mount() // mount未填写则查找document 带有v-scope的所有元素
<div v-scope="{data: 1}"></div> // 或者可以不填写 模板传入值
// 查找指定元素
createApp({
    data: 1
}).mount('#id') // '.ids' HtmlElement
// 创建组件 构造函数 传入Function 模板中指定函数
Function() {return {}}
createApp(Function).mount()
<div v-scope="Function"></div>
// 根据template innerHtml写法 需要 模板传入构造函数才行
createApp({
    $template: `#tmp`  // 传入id 或者 innerHtml `<span>{{ data }}</span>`
})
<template id="tmp"></template>
```
- 自定义元素
dispatchEvent的事件名会自动转为小写因此定义好的事件可以在另一个组件内部@eventname=""
