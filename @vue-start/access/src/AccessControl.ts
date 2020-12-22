import { provide, inject, defineComponent, ref, h } from "vue";
import { Ref } from "@vue/reactivity";
import { IRequestActor } from "@vue-start/request";
import { size, some, every } from "lodash";

type TPermission = { [key: string]: boolean };

const storeKey = "$permission";

export const permissionProvide = (permission: TPermission) => {
  const permissionRef = ref<TPermission>(permission);
  provide<Ref<TPermission>>(storeKey, permissionRef);
};

export const usePermission = (): Ref<TPermission> => inject<Ref<TPermission>>(storeKey)!;

const shouldRender = (permissions: TPermission, actor: IRequestActor<any, any>) => {
  return permissions[actor.name];
};

export const AccessControl = defineComponent((props, context) => {
  const slotFun = context.slots.default;

  const permission = usePermission();
  const mode = context.attrs.mode;
  const actors = context.attrs.actors as Array<IRequestActor<any, any>>;

  const sr =
    mode === "some"
      ? (permissions: TPermission) => {
          return size(actors) <= 0 ? true : some(actors, (actor) => shouldRender(permissions, actor));
        }
      : (permissions: TPermission) => {
          return size(actors) <= 0 ? true : every(actors, (actor) => shouldRender(permissions, actor));
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

export const mustOneOfPermissions = (...deps: Array<IRequestActor<any, any>>) => {
  return defineComponent((_, context) => {
    return () => {
      return h(AccessControl, { mode: "some", actors: deps }, context.slots.default);
    };
  });
};

export const mustAllOfPermissions = (...deps: Array<IRequestActor<any, any>>) => {
  return defineComponent((_, context) => {
    return () => {
      return h(AccessControl, { mode: "every", actor: deps }, context.slots.default);
    };
  });
};
