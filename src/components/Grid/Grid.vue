<template>
    <div class="grid">
        <div class="a item"></div>
        <div class="b item"></div>
        <div class="c item"></div>
        <div class="d item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item last2"></div>
        <div class="item "></div>

        <!-- <div v-for="i in 20" class="item"><span>{{ i }}</span></div> -->
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
.grid {
    width: 100%;
    height: 100%;
    display: grid;
    overflow: auto;
    justify-content: stretch ; // 水平居中
    align-content: stretch ; // 垂直居中;
    grid-template-columns: repeat(24, 1fr);
    grid-template-rows: repeat(24,1fr);
    grid-template-areas: "a a b" "a a b" "c c d";
    grid-auto-columns: 50px;
    grid-auto-rows: 50px;
    // 5种颜色 按照顺序排列
    .item {
       
        border: 1px solid #ccc;
    }
    .last2 {
        grid-column: 6 / 12;
        grid-row: 6 / 12;
        background-color: pink;
    }
    .a {
        grid-area: a;
        grid-column: 1 / 12;
        grid-row: 1 / 12;
        background-color: red;
    }
    .b {
        grid-area: b;
        background-color: green;
    }
    .c {
        grid-area: c;
        background-color: blue;
    }
    .d {
        grid-area: d;
        background-color: yellow;
    }
}
</style>