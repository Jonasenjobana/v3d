<template>
  <v-sheet :rounded="4" :elevation="6" style="color: #333; margin: 8px">
    <div>
      <v-form v-model="valid" ref="formRef">
        <v-text-field v-model="mockForm.name" label="姓名" :hide-details="true" single-line :rules="rules"></v-text-field>
        <v-radio-group v-model="mockForm.sex" direction="vertical">
          <v-radio label="女" value="0"></v-radio>
          <v-radio label="男" value="1"></v-radio>
        </v-radio-group>
        <v-text-field v-model="mockForm.name" label="姓名" :hide-details="true" single-line :rules="rules"></v-text-field>
        <v-range-input v-model:max="mockForm.max" v-model:min="mockForm.min"></v-range-input>
        <v-btn @click="submit()">提交</v-btn>
      </v-form>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect, type Ref } from "vue";
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
  hobby: [],
  birthday: undefined,
});
const rules: any = [
  (value: string) => {
    if (value.includes("wtf")) return true;
    return "缺少what the fuck";
  },
];
const valid = ref(false);
watchEffect(() => {});
function submit() {
  const form = formRef.value!;
  
  console.log(form, mockForm, "=========",form.isValid);
}
</script>

<style scoped></style>
