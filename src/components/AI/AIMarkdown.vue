<template>
  <div ref="markdownRef"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useModel, type ComputedRef } from "vue";
import { Marked } from "marked";
import hljs from "highlight.js";
import { markedHighlight } from "marked-highlight";
defineOptions({
  name: "sl-markdown",
});
const props = defineProps({
  mdText: {
    type: String,
    default: "",
  },
});
const markdownRef = ref();
const mdInstance = new Marked(
  {
    gfm: true,
  },
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

onMounted(() => {});
</script>

<style scoped></style>
