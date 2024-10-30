import { computed, defineComponent, ExtractPropTypes, KeepAlive, PropType, ref } from "vue";
import { RouterView } from "vue-router";
import { useProLayout } from "./ctx";
import { filter, map } from "lodash";
import { useProRouter } from "../../core";

const routerViewProps = () => ({
  //非tabs模式下，includes
  includes: { type: Array as PropType<string[]> },
});

export type ProRouterViewProps = Partial<ExtractPropTypes<ReturnType<typeof routerViewProps>>>;

export const ProRouterView = defineComponent<ProRouterViewProps>({
  props: {
    ...routerViewProps(),
  } as any,
  setup: (props) => {
    const { tabs, refreshRef, showTabs, convertValue } = useProLayout();
    const { route } = useProRouter();

    const include = computed(() => {
      if (!showTabs.value) {
        return props.includes || [];
      }
      const list = map(tabs.value, (item) => convertValue(item));
      if (refreshRef.value) {
        return filter(list, (item) => item !== route.name);
      }
      return list;
    });

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
