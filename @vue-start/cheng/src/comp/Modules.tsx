import { defineComponent } from "vue";

/**
 * 组件
 */
export const Modules = defineComponent({
  props: {} as any,
  setup: () => {
    return () => {
      return <div>Module list</div>;
    };
  },
});
