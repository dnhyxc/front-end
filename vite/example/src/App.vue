<template>
  <div>
    @dnhyxc/core:
    <div>{{ info }}</div>
  </div>
  <div>
    @dnhyxc/tools:
    <div>{{ count }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { add } from "@dnhyxc/core";
import { getNameInfo } from "@dnhyxc/tools";

const info = computed(() => {
  return getNameInfo("yhyh dnhyxc xixi zczc!!!");
});

const count = computed(() => {
  return add(2, 7);
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
