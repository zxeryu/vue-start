<template>
  <div>Home</div>
  {{ config }}
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useConfig } from "@vue-start/config";
export default defineComponent({
  name: "Home",
  setup() {
    const config = useConfig();

    return {
      config,
    };
  },
});
</script>
