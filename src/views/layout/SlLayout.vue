<template>
  <v-layout>
    <!-- mobile 会隐藏 进行另外显示 -->
    <v-navigation-drawer rail expand-on-hover :v-model="drawer" :width :rail-width="railWidth">
      <v-list-item v-for="item in items" :key="item.key" :to="item.to" :active="item.active"
        :prepend-icon="item.prependIcon">
        <v-menu transition="slide-x-transition" activator="parent" v-if="item.children" :location="'end'" open-on-hover>
          <v-list>
            <v-list-item v-for="child in item.children" :to="child.to" :active="child.active">
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-navigation-drawer>
    <v-bottom-navigation v-if="mobile" class="w-100 overflow-auto">
      <v-list-item class="mobile-nav" v-for="item in items" :key="item.key" :to="item.to" :active="item.active" nav
        :width="60" :prepend-icon="item.prependIcon">
        <v-menu transition="slide-x-transition" activator="parent" v-if="item.children" :location="'top'">
          <v-list>
            <v-list-item v-for="child in item.children" :to="child.to" :active="child.active">
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-bottom-navigation>
    <v-main height="100vh" width="100%" id="main">
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
import { useDisplay } from "vuetify";
const drawer = ref(true);
const props = defineProps({
  items: {
    type: Array as PropType<Array<SLMenuItem>>,
    required: true,
  },
  width: {
    type: Number,
    default: 60,
  },
  railWidth: {
    type: Number,
    default: 60,
  },
});
const { mobile } = useDisplay();
const router = useRouter();
router.afterEach((to) => {
  const { path } = to;
  activeItem(props.items, path);
});
function activeItem(items: SLMenuItem[], path: string) {
  if (!items || items.length === 0) return;
  items.forEach((el: any) => {
    activeItem(el.children, path);
    el.active = path.startsWith(el.to);
  });
}
</script>

<style scoped lang="less">
.mobile-nav {
  &:deep(.v-list-item__spacer) {
    width: 0 !important;
  }
  &:deep(.v-list-item__prepend) {
    grid-area: content;
    justify-content: center;
  }
}
</style>
