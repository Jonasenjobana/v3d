<template>
  <div>
    <v-form v-model="valid" ref="formRef">
      <v-text-field v-model="mockForm.name" label="姓名" :hide-details="true" single-line :rules="rules"></v-text-field>
      <v-radio-group v-model="mockForm.sex" direction="vertical">
        <v-radio label="女" value="0"></v-radio>
        <v-radio label="男" value="1"></v-radio>
      </v-radio-group>
      <v-text-field v-model="mockForm.name" label="姓名" :hide-details="true" single-line :rules="rules"></v-text-field>
      <v-select :items="hobbyList" v-model="mockForm.hobby" multiple label="爱好">
        <template v-slot:item="{ item, props: itemProps }">
          <v-list-item v-bind="itemProps" @click="item.value.props?.onClick?.()">
            {{ item.title }}
          </v-list-item>
        </template>
      </v-select>
      <v-range-input v-model:max="mockForm.max" v-model:min="mockForm.min" @update:max="console.log($event, 'max')" @update:min="console.log($event, 'min')"></v-range-input>
      <v-btn @click="submit()">提交</v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watchEffect, type Directive, type Ref } from "vue";
import type { VForm } from "vuetify/components";
import VRangeInput from "./custom/VRangeInput.vue";
const formRef: Ref<VForm> = ref(null!);
const mockForm = reactive({
  name: "",
  sex: undefined,
  age: undefined,
  min: 0,
  max: 100,
  address: {
    province: "",
    city: "",
    region: "",
  },
  hobby: [] as string[],
  birthday: undefined,
});
const number = ref(1);
const hobbyList = [
  { title: "111", value: "1" },
  {
    title: "222",
    value: "3",
    props: {
      onClick: () => {
        mockForm.hobby = ["1", "3", "5"];
        setTimeout(() => {
          console.log(mockForm.hobby);
        }, 1000);
        console.log("sss", mockForm.hobby);
      },
    },
  },
  { title: "333", value: "2" },
  { title: "444", value: "4" },
  { title: "555", value: "5" },
];
const rules: any = [
  (value: string) => {
    if (value.includes("wtf")) return true;
    return "缺少what the fuck";
  },
];
const valid = ref(false);
watchEffect(() => {
  console.log(number.value, "number change");
});
function submit() {
  const form = formRef.value!;
  console.log(form, mockForm, "=========", form.isValid);
}
</script>

<style scoped></style>
