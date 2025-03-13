<template>
  <v-layout>
    <v-navigation-drawer :width="60">
      <v-list :items="items" density="compact" :max-width="60"> </v-list>
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
import { reactive } from 'vue'

const items: any = reactive([
  {
    title: 'Three',
    props: {
      to: '/three',
      prependIcon: 'mdi-video-3d-variant',
      rounded: "xl"
    },
  },
])
</script>

<style scoped></style>
