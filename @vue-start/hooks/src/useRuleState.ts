import { reactive, toRaw, UnwrapNestedRefs } from "vue";
import useEffect from "./useEffect";
import { forEach } from "lodash";

/**
 * 根据rules更改state（model）
 * @param model
 * @param rules
 * @param initState
 */
export const useRuleState = (
  model: UnwrapNestedRefs<any>,
  rules: Record<string, (record: Record<string, any>) => boolean>,
  initState?: UnwrapNestedRefs<any>,
): UnwrapNestedRefs<any> => {
  const state = initState || reactive({});

  useEffect(() => {
    if (!rules) {
      return;
    }
    const record = { ...toRaw(model) };
    forEach(rules, (fn, key) => {
      state[key] = fn?.(record);
    });
  }, model);

  return state;
};
