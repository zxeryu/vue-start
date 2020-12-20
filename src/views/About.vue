<template>
  <div>About</div>
  <AccessControl :flag="false"><span>i am span</span></AccessControl>
  <button @click="change">change</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AccessControl, usePermission } from "@vue-start/access";

export default defineComponent({
  name: "About",
  components: { AccessControl },

  setup() {
    const pmReactive = usePermission();
    const change = () => {
      pmReactive.name = !pmReactive.name;
    };
    return {
      change,
    };
  },
});
</script>
