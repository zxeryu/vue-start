import { computed, defineComponent, KeepAlive, ref } from "vue";
import { RouterView } from "vue-router";
import { useProLayout } from "./ctx";
import { filter, map } from "lodash";
import { useProRouter } from "../../core";

export const ProRouterView = defineComponent({
  props: {} as any,
  setup: (props, { expose }) => {
    const { tabs } = useProLayout();
    const { route } = useProRouter();

    const refreshRef = ref(false);

    const include = computed(() => {
      const list = map(tabs.value, (item) => {
        //todo:: 特殊 value 转化为路由 name 处理
        return item.value;
      });
      if (refreshRef.value) {
        return filter(list, (item) => item !== route.name);
      }
      return list;
    });

    const refresh = () => {
      refreshRef.value = true;
      setTimeout(() => {
        refreshRef.value = false;
      }, 0);
    };

    expose({ refresh });

    return () => {
      return (
        <RouterView
          v-slots={{
            default: ({ Component, route }: any) => {
              if (Component && Component.type && !Component.type.name && route.name) {
                Component.type.name = route.name;
              }
              return <KeepAlive include={include.value}>{refreshRef.value ? null : <Component />}</KeepAlive>;
            },
          }}
        />
      );
    };
  },
});
