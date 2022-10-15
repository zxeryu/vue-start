import { ref } from "vue";
import { generateId } from "./util";

export const useUpdateKey = () => {
  const keyRef = ref(generateId());

  const updateKey = () => {
    keyRef.value = generateId();
  };

  return [keyRef, updateKey];
};
