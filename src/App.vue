<template>
  <div>
    vue-start
    <div>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/counter">Counter</router-link>
      <router-link to="/network">Network</router-link>
    </div>
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { permissionProvide } from "@vue-start/access";
export default defineComponent({
  name: "App",
  setup() {
    permissionProvide({});
  },
});
</script>
