<template>
  <ConfigProvider>
    <div>
      vue-start
      <div>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/counter">Counter</router-link>
        <router-link to="/network">Network</router-link>
        <router-link to="/hooks">Hooks</router-link>
        <router-link to="/comp">Comp</router-link>
        <router-link to="/comp-el">Comp-El</router-link>
      </div>
    </div>
    <router-view />
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ConfigProvider } from "ant-design-vue";
export default defineComponent({
  name: "App",
  components: { ConfigProvider },
  setup() {},
});
</script>
