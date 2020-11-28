<template>
  <div>
    count:{{ count }}
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, onUpdated } from "vue";

const useCount = () => {
  const count = ref(0);

  const increment = () => {
    count.value = count.value + 1;
  };
  const decrement = () => {
    count.value = count.value - 1;
  };

  return {
    count,
    increment,
    decrement,
  };
};

export default defineComponent({
  name: "Counter",
  setup() {
    const { count, increment, decrement } = useCount();
    return {
      count,
      increment,
      decrement,
    };
  },
});
</script>

<style scoped></style>
