import { computed, defineComponent, ExtractPropTypes, PropType } from "vue";
import { useLogonUser } from "./user";
import { isArray, map, some } from "lodash";
import { useRoute } from "vue-router";

export const PerSuffix = {
  Add: "add",
  Edit: "edit",
  Delete: "delete",
};

const hasPer = (buttonMap: Record<string, boolean>, value: string | string[]): boolean => {
  if (!buttonMap || !value) {
    return false;
  }
  if (isArray(value)) {
    return some(value, (ps) => {
      return buttonMap[ps];
    });
  }
  return buttonMap[value];
};

//当前buttonMap中是否存在value
export const useHasPer = () => {
  const { per } = useLogonUser();
  const route = useRoute();

  return (
    perStr: string | string[],
    options?: {
      suffix?: boolean; //是否是后缀
    },
  ) => {
    if (!perStr) return false;
    let value = perStr;
    if (options?.suffix) {
      const name = route.name ? route.name.toString() : "";
      //拼接成 `${route.name}:${suffix}`
      value = isArray(value) ? map(value, (item) => `${name}:${item}`) : `${name}:${value}`;
    }
    return hasPer(per.buttonMap!, value);
  };
};

const permissionProps = () => ({
  //后缀
  suffix: { type: [String, Array as PropType<string[]>] },
  //完整字符串
  value: { type: [String, Array as PropType<string[]>] },
});

export type PermissionProps = Partial<ExtractPropTypes<ReturnType<typeof permissionProps>>>;

export const Permission = defineComponent<PermissionProps>({
  inheritAttrs: false,
  props: {
    ...permissionProps(),
  } as any,
  setup: (props, { slots }) => {
    const hasPer = useHasPer();

    const isHasPer = computed(() => {
      if (props.value) {
        return hasPer(props.value);
      }
      if (props.suffix) {
        return hasPer(props.suffix, { suffix: true });
      }
      return false;
    });

    return () => {
      if (!isHasPer.value) {
        return null;
      }
      return slots.default?.();
    };
  },
});
