<template>
  <pro-menus
    style="width: 300px"
    :mode="mode"
    uniqueOpened
    :activeKey="activeRef"
    :options="treeOptions"
    :onMenuItemClick="handleItemClick"
  />
</template>

<script setup>
import { treeOptions } from "@/common/columns";
import { isElementPlus } from "@/common/platform";
import { ref } from "vue";

const activeRef = ref("v-2-1");

const handleItemClick = (item) => {
  console.log(item);
};

const mode = isElementPlus() ? undefined : "inline";
</script>
