import { defineComponent } from "vue";

export const Modules = defineComponent({
  props: {} as any,
  setup: () => {
    return () => {
      return <div>Module list</div>;
    };
  },
});
