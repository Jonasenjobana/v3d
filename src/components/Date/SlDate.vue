<template>
    <div class="sl-calender">
        <div class="calender-header">
            <div class="prev" @click="dateValue.year--"><</div>
            <h2>{{ dateValue.year }}</h2>
            <select name="month" id="month" v-model="dateValue.month">
                <option v-for="item in 12" :value="item" :key="item">{{ item }}</option>
            </select>
            <div class="next" @click="dateValue.year++">></div>
        </div>
        <div class="calender-body">
            <div class="week">
                <div v-for="item in 7" :key="item">{{ weekList[item - 1] }}</div>
            </div>
            <div class="day">
                <div v-for="item in 42" :key="item" :class="{'active': dayList[item - 1].active, 'disabled': dayList[item - 1].disabled}"  @click="onClickDay(dayList[item - 1])">{{ dayList[item - 1].value }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
const value = defineModel();
const dateValue = reactive({
    now: new Date(),
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
})
const weekList = ['日', '一', '二', '三', '四', '五', '六']
const dayList = reactive(new Array(42).fill({
    value: 0,
    active: false,
    disabled: false,
}))
watch([() => dateValue.year, () => dateValue.month], (value) => {
    const {year, month} = dateValue
    // 上个月多少天
    const lastMonthOfDay = new Date(year, month - 1, 0).getDate();
    // 下个月多少天
    const nextMonthOfDay = new Date(year, (month + 1) % 12, 0).getDate();
    // 当月有多少天
    const monthOfDay = new Date(year, month, 0).getDate();
    // 当月第一天是星期几
    const dayOfWeek = new Date(year, month, 1).getDay();
    let count = 1, count2 = 1;
    dayList.forEach((item, index) => {
        if (index < dayOfWeek) {
            dayList[index] = {
                value: lastMonthOfDay - dayOfWeek + index + 1,
                disabled: true,
                active: false
            };
        } else if (index >= dayOfWeek + monthOfDay) {
            dayList[index] = {
                value: count2++,
                disabled: true,
                active: false
            }
        } else {
            dayList[index] = {
                value: count++,
                disabled: false,
                active: false
            }
        }
    })
    console.log(year, month, monthOfDay, lastMonthOfDay)
}, { immediate: true })
function onClickDay(item: any) {
    if (item.disabled) return;
    dayList.forEach(item => item.active = false);
    item.active = true;
}
watch(value, () => {
    
})
</script>

<style scoped lang="less">
.sl-calender {
    width: 300px;
    height: 200px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}
.calender-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #000;
    height: 4em;
    .prev,.next {
        height: 100%;
        line-height: 4em;
        width: 20%;
        text-align: center;
    }
}
.calender-body {
    height: 100%;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    .week {
        display: flex;
        align-items: center;
        justify-content: space-around;
        &>div {
            flex: 1;
            text-align: center;
            height: 3em;
            line-height: 3em;
            &:hover {
                background-color: #000;
                color: #fff;
            }
        }
    }
    .day {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(6, 1fr);
        gap: 4px 4px;
        & > div {
            justify-content: center;
            align-items: center;
            display: flex;
            border-radius: 4px;
            background-color: #efefef;
            cursor: pointer;
            &.disabled {
                cursor: not-allowed;
                background-color: #c4c4c4;
                color: #696969;
            }
            &.active {
                background-color: #0059ff;
                color: #fff;
            }
            &.now {
                background-color: #0059ff;
                color: #fff;
            }
        }
    }
}
</style>