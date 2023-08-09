import { defineComponent } from "vue";

export const Modules = defineComponent({
  props: {},
  setup: () => {
    return () => {
      return <div>Module list</div>;
    };
  },
});
