import { TUpdater, useDispatchStore as useDispatchStoreOrigin, useObservableRef, useStoreConn } from "@vue-start/store";
import { useProConfig } from "./pro";
import { get, isFunction, reduce } from "lodash";

export type TInitialState<T> = T | (() => T);

export type TRegisterStore = { key: string; initialState?: TInitialState<any>; persist?: boolean };

export type TRegisterStoreMap = Record<string, TRegisterStore>;

/**
 * 更新全局状态
 */
export const useDispatchStore = <T>() => {
  const dispatchStore = useDispatchStoreOrigin();

  const { registerStoreMap } = useProConfig();

  return (key: string, stateOrUpdater: T | TUpdater<T>) => {
    const registerItem: TRegisterStore | undefined = get(registerStoreMap, key);
    if (!registerItem) {
      return;
    }
    dispatchStore(key, stateOrUpdater, !!registerItem.persist, registerItem.initialState);
  };
};

/**
 * 读取全局状态
 * 返回ref对象
 */
export const useReadStore = (key: string) => {
  const { registerStoreMap } = useProConfig();

  const registerItem: TRegisterStore | undefined = get(registerStoreMap, key);

  const realKey = `${registerItem?.persist ? "$" : ""}${registerItem?.key}`;

  const mapper = (state: Record<string, any>) => {
    const data = get(state, realKey);
    if (data) {
      return data;
    }
    return isFunction(registerItem?.initialState) ? registerItem?.initialState() : registerItem?.initialState;
  };

  return useObservableRef(useStoreConn(mapper));
};

/**
 * 批量读取全局状态
 * @param storeKeys
 * @returns
 */
export const useRegisterStores = (storeKeys: string[]) => {
  return reduce(storeKeys, (pair, item) => ({ ...pair, [item]: useReadStore(item) }), {});
};
