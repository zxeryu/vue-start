import { ref, Ref, UnwrapRef } from "vue";
import { generateId } from "./util";

export const useUpdateKey = (): [Ref<UnwrapRef<string>>, () => void] => {
  const keyRef = ref<string>(generateId());

  const updateKey = () => {
    keyRef.value = generateId();
  };

  return [keyRef, updateKey];
};
