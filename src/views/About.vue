<template>
  <div>About</div>
  <TestPermission><span>i am span</span></TestPermission>
  <button @click="change">change</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePermission, mustOneOfPermissions } from "@vue-start/access";
import { test } from "../clients";

const TestPermission = mustOneOfPermissions(test);

export default defineComponent({
  name: "About",
  components: { TestPermission },

  setup() {
    const pmRef = usePermission();
    const change = () => {
      pmRef.value = { test: !pmRef.value.test };
    };
    return {
      change,
    };
  },
});
</script>
