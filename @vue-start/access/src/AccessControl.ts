import { provide, inject, defineComponent, reactive } from "vue";
import { UnwrapRef } from "@vue/reactivity";

type TPermission = { [key: string]: boolean };

const storeKey = "$permission";

export const permissionProvide = (permission: TPermission) => {
  const permissionReactive = reactive<TPermission>(permission || {});
  provide<UnwrapRef<TPermission>>(storeKey, permissionReactive);
};

export const usePermission = (): UnwrapRef<TPermission> => inject<UnwrapRef<TPermission>>(storeKey)!;

const shouldRender = (permissions: TPermission, name: string) => {
  return permissions[name];
};

export const AccessControl = defineComponent((_, context) => {
  const slotFun = context.slots.default;

  const permission = usePermission();

  return () => {
    if (!slotFun) {
      return null;
    }
    console.log("@@@@@@@@permission=", permission.name);
    if (!shouldRender(permission, "")) {
      return null;
    }

    return slotFun();
  };
});
