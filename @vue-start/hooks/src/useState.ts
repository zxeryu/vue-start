import { reactive } from "vue";
import { forEach, isArray, isObject } from "lodash";
import { UnwrapNestedRefs } from "@vue/reactivity";

const isRefRule = (v: any) => {
  if (!isObject(v)) {
    return true;
  }
  return isArray(v);
};

const setReactiveValue = (r: UnwrapNestedRefs<any>, obj: any) => {
  if (!r) {
    return;
  }
  if (isRefRule(obj)) {
    r.value = obj;
    return;
  }
  forEach(obj, (v, k) => {
    r[k] = v;
  });
};
/**
 * 原因：ref .value太麻烦
 * 如果值为 (object && !array) 正常使用reactive；如果值为：string、boolean、number ... 为{value:any}，ref格式
 * 效果：解决了当值为object时候的直接调用（省去.value）问题
 */
export const useState = <T>(initValue?: T): [UnwrapNestedRefs<T>, (v: T) => void] => {
  const state = reactive<any>({});
  setReactiveValue(state, initValue);

  const setState = (v: any) => {
    setReactiveValue(state, v);
  };

  return [state, setState];
};
