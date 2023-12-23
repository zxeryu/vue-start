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
  const { per } = useLogonUser() || { per: { menus: [], buttonMap: {} } };
  const route = useRoute();

  return (
    perStr: string | string[],
    options?: {
      suffix?: boolean; //是否是后缀
      splitStr?: string; //路由名称和后缀连接的字符串 `${route.name}${splitStr}${suffix}`
    },
  ) => {
    if (!perStr) return false;
    let value = perStr;
    if (options?.suffix) {
      const name = route.name ? route.name.toString() : "";
      const splitStr = options?.splitStr || "_";
      //拼接成 `${route.name}:${suffix}`
      value = isArray(value) ? map(value, (item) => `${name}${splitStr}${item}`) : `${name}${splitStr}${value}`;
    }
    return hasPer(per.buttonMap!, value);
  };
};

export const useHasPer2 = () => {
  const hasPer = useHasPer();

  return (per?: string, suffix?: string, splitStr?: string) => {
    if (per) {
      return hasPer(per);
    } else if (suffix) {
      return hasPer(suffix, { suffix: true, splitStr });
    }
    return true;
  };
};

const permissionProps = () => ({
  //后缀
  suffix: { type: [String, Array as PropType<string[]>] },
  //完整字符串
  value: { type: [String, Array as PropType<string[]>] },
  //
  splitStr: { type: String },
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
        return hasPer(props.suffix, { suffix: true, splitStr: props.splitStr });
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
