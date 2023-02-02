<template>
  <ProConfig :elementMap="elementMap" :formElementMap="formElementMap">
    <router-view />
  </ProConfig>
</template>

<script setup>
import { ProConfig } from "@vue-start/pro";
import { elementMap, formElementMap } from "@/component";
</script>
