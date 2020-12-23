import { provide, inject, defineComponent, ref, h } from "vue";
import { Ref } from "@vue/reactivity";
import { IRequestConfig } from "@vue-start/request";
import { size, some, every } from "lodash";

type TPermission = { [key: string]: boolean };

const storeKey = "$permission";

export const permissionProvide = (permission: TPermission) => {
  const permissionRef = ref<TPermission>(permission);
  provide<Ref<TPermission>>(storeKey, permissionRef);
};

export const usePermission = (): Ref<TPermission> => inject<Ref<TPermission>>(storeKey)!;

const shouldRender = (permissions: TPermission, config: IRequestConfig<any, any>) => {
  return permissions[config.name];
};

export const AccessControl = defineComponent((props, context) => {
  const slotFun = context.slots.default;

  const permission = usePermission();
  const mode = context.attrs.mode;
  const configs = context.attrs.configs as Array<IRequestConfig<any, any>>;

  const sr =
    mode === "some"
      ? (permissions: TPermission) => {
          return size(configs) <= 0 ? true : some(configs, (c) => shouldRender(permissions, c));
        }
      : (permissions: TPermission) => {
          return size(configs) <= 0 ? true : every(configs, (c) => shouldRender(permissions, c));
        };

  return () => {
    if (!slotFun) {
      return null;
    }
    if (!sr(permission.value)) {
      return null;
    }
    return slotFun();
  };
});

export const MustOneOfPermissions = defineComponent((_, context) => {
  return () => {
    return h(AccessControl, { mode: "some", ...context.attrs }, context.slots.default);
  };
});

export const MustAllOfPermissions = defineComponent((_, context) => {
  return () => {
    return h(AccessControl, { mode: "every", ...context.attrs }, context.slots.default);
  };
});

export const mustOneOfPermissions = (...deps: Array<IRequestConfig<any, any>>) => {
  return defineComponent((_, context) => {
    return () => {
      return h(AccessControl, { mode: "some", configs: deps }, context.slots.default);
    };
  });
};

export const mustAllOfPermissions = (...deps: Array<IRequestConfig<any, any>>) => {
  return defineComponent((_, context) => {
    return () => {
      return h(AccessControl, { mode: "every", configs: deps }, context.slots.default);
    };
  });
};
