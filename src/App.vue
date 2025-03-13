<template>
  <v-layout>
    <v-navigation-drawer :width="60">
      <v-list :items="items" density="compact" :max-width="60">
      </v-list>
    </v-navigation-drawer>
    <v-main height="100vh" width="100%">
      <v-sheet width="100%" height="100%">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
              <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </v-sheet>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">
import { reactive, type PropType } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { components } from 'vuetify/dist/vuetify-labs.js';
const items: any = reactive([
  {
    title: '3D',
    props: {
      to: '/3D',
      prependIcon: 'mdi-video-3d-variant',
      rounded: "xl"
    },
  },
  {
    title: 'Map',
    props: {
      prependIcon: 'mdi-map',
      to: '/map',
      onClick: (e: any) => {
        console.log(e, 'wtf')
      },
      rounded: "xl",
    },
  },
  {
    title: 'AI',
    props: {
      prependIcon: 'mdi-robot-happy-outline',
      to: '/ai',
      onClick: (e: any) => {
        console.log(e, 'wtf')
      },
      rounded: "xl",
    },
  },
  {
    title: 'Canvas',
    props: {
      prependIcon: 'mdi-artboard',
      to: '/canvas',
      onClick: (e: any) => {
        console.log(e, 'wtf')
      },
      rounded: "xl",
    },
  }
])
const router = useRouter()
router.afterEach((to) => {
  const {path} = to;
  const item =items.find((el: any) => el.props.href === path);
  if (item) {
    item.props['active'] = true;
  }
})
</script>

<style scoped></style>
