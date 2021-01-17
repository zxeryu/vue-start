import { ref } from "vue";

function useSet<K>(initialValue?: Iterable<K>) {
  const initialSet = initialValue === undefined ? new Set() : new Set<K>(initialValue);
  const set = ref(initialSet);

  //add
  const add = (key: K) => {
    set.value.add(key);
  };
  //remove
  const remove = (key: K) => {
    set.value.delete(key);
  };
  //reset
  const reset = () => {
    set.value = new Set<K>(initialValue);
  };
  //has
  const has = (key: K) => set.value.has(key);

  return [set, { add, remove, reset, has }] as const;
}

export default useSet;
