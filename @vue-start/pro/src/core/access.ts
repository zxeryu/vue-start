import { createStateUse } from "@vue-start/store";
import { computed, defineComponent, inject, provide } from "vue";
import { useEffect, useState } from "@vue-start/hooks";
import { UnwrapNestedRefs } from "@vue/reactivity";

const useAccessState = createStateUse("access", undefined, true);

export interface IAccess extends Record<string, any> {
  token?: string;
}

export type TAccess = UnwrapNestedRefs<IAccess>;

export const useAccess = (): TAccess => {
  const [access] = useAccessState();
  return access;
};

export const useAccessMgr = () => {
  const [access, setAccess] = useAccessState();

  const deleteAccess = () => {
    setAccess(undefined);
  };

  return [access, setAccess, deleteAccess] as const;
};

export const MustLogon = defineComponent((_, { slots, emit }) => {
  const access = useAccess();

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

export const LogonUserKey = Symbol("logon-user");

export interface IUser extends Record<string, any> {
  id?: string | number;
}

export type TLogonUserProvide = {
  user: UnwrapNestedRefs<IUser>;
  setUser: (u: IUser) => void;
  per: UnwrapNestedRefs<Record<string, any>>;
  setPer: (u: IUser) => void;
  opts: Record<string, any>;
};

export const useLogonUser = () => inject(LogonUserKey) as TLogonUserProvide;

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
