<template>
  <div>@dnhyxc/core {{ info }} {{ count }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getNameInfo } from "@dnhyxc/tools";
import { add } from "@dnhyxc/core";

const info = computed(() => {
  return getNameInfo("dnhyxc");
});
const count = computed(() => {
  return add(9, 12);
});
</script>

<style scoped></style>
