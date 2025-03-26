<template>
  <v-layout>
    <v-navigation-drawer rail expand-on-hover :v-model="drawer" :width>
      <v-list-item :type="item.type" v-for="item in items" :title="item.title" :key="item.key" :to="item.to" :active="item.active" :prepend-icon="item.prependIcon">
        
      </v-list-item>
    </v-navigation-drawer>
    <v-main height="100vh" width="100%">
      <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import { useRouter } from "vue-router";
import type { SLMenuItem } from "./model";
const drawer = ref(false);
const props = defineProps({
  items: Array as PropType<Array<SLMenuItem>>,
  width: {
    type: Number,
    default: 60,
  },
});

const router = useRouter();
router.afterEach((to) => {
  const { path } = to;
  props.items?.forEach((el: any) => {
    el.active = false;
  })
  const item = props.items?.find((el: any) => el.to === path);
  if (item) {
    item.active = true;
  }
});
</script>

<style scoped></style>
