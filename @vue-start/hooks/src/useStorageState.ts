import { ref } from "vue";
import { isFunction, isUndefined } from "lodash";

export interface IFuncUpdater<T> {
  (previousState?: T): T;
}

export default function useStorageState<T>(
  key: string,
  defaultValue?: T | IFuncUpdater<T>,
): [T | undefined, (value?: T | IFuncUpdater<T>) => void] {
  function getStoredValue() {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    if (isFunction(defaultValue)) {
      return defaultValue();
    }
    return defaultValue;
  }

  const state = ref(getStoredValue());

  const updateState = (value?: T | IFuncUpdater<T>) => {
    if (isUndefined(value)) {
      localStorage.removeItem(key);
      state.value = undefined;
    } else if (isFunction(value)) {
      const previousState = getStoredValue();
      const currentState = value(previousState);
      localStorage.setItem(key, JSON.stringify(currentState));
      state.value = currentState;
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      state.value = value;
    }
  };

  return [state, updateState];
}
