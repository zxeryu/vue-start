<template>
  <div>
    count:{{ count }}
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "Counter",
  setup() {
    const store = useStore();

    return {
      count: computed(() => store.state.count),
      increment: () => store.commit("increment"),
      decrement: () => store.commit("decrement"),
    };
  },
});
</script>

<style scoped></style>
