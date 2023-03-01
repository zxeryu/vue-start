import { reactive, UnwrapNestedRefs } from "vue";
import { forEach, isArray, isObject, keys, union, has, isEmpty, size } from "lodash";

export const isRefRule = (v: any) => {
  if (!isObject(v)) {
    return true;
  }
  return isArray(v);
};

/**
 * useState引发的问题
 * @param state
 */
export const isEmptyState = (state: UnwrapNestedRefs<any>) => {
  return isEmpty(state) || (size(keys(state)) === 1 && has(state, "value") && !state.value);
};

/**
 *快速为reactive对象赋值
 * @param r     reactive对象
 * @param obj   赋值内容对象
 */
export const setReactiveValue = (r: UnwrapNestedRefs<any>, obj: any) => {
  if (!r) {
    return;
  }
  if (isRefRule(obj)) {
    //清空除value的属性
    forEach(r, (_, k) => {
      if (k !== "value") {
        delete r[k];
      }
    });

    r.value = obj;
    return;
  }
  const allKeys = union(keys(r), keys(obj));
  forEach(allKeys, (k) => {
    if (has(obj, k)) {
      r[k] = obj[k];
    } else {
      delete r[k];
    }
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
