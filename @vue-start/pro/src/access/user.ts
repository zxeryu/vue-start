import { computed, defineComponent, inject, provide } from "vue";
import { useEffect, useState } from "@vue-start/hooks";
import { useAccess } from "./ctx";
import { UnwrapNestedRefs } from "@vue/reactivity";

export const LogonUserKey = Symbol("logon-user");

export interface IUser extends Record<string, any> {
  id?: string | number;
}

export interface IPer extends Record<string, any> {
  menus?: any[]; //菜单
  buttonMap?: Record<string, boolean>; //原子权限
}

export type TLogonUserProvide = {
  user: UnwrapNestedRefs<IUser>;
  setUser: (u: IUser) => void;
  per: UnwrapNestedRefs<IPer>;
  setPer: (u: IPer) => void;
  opts: Record<string, any>;
};

export const useLogonUser = (): TLogonUserProvide => inject(LogonUserKey) as TLogonUserProvide;

export const LogonUser = defineComponent((props, { slots }) => {
  //用户信息
  const [user, setUser] = useState();
  //权限
  const [per, setPer] = useState();

  const opts = {};

  provide(LogonUserKey, { user, setUser, per, setPer, opts });

  return () => {
    return slots.default?.();
  };
});

export const MustLogon = defineComponent((_, { slots, emit }) => {
  const { access } = useAccess();

  const isLogin = computed(() => {
    return access && access["token"];
  });

  useEffect(() => {
    if (!isLogin.value) {
      emit("toLogin");
    }
  }, isLogin);

  return () => {
    if (isLogin.value) {
      return slots.default?.();
    }
    return null;
  };
});
