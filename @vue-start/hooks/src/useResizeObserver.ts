import useEffect from "./useEffect";
import { computed, Ref } from "vue";
import { forEach, isArray, map } from "lodash";
import { MaybeElement, unrefElement } from "./util";

export const useResizeObserver = (
  target: Ref<MaybeElement> | Ref<MaybeElement>[],
  callback: ResizeObserverCallback,
  opts?: ResizeObserverOptions,
) => {
  const targets = computed(() => {
    return isArray(target) ? map(target, (item) => unrefElement(item)) : [unrefElement(target)];
  });

  useEffect(
    () => {
      let observer: ResizeObserver | undefined = new ResizeObserver(callback);

      forEach(targets.value, (item) => {
        if (!item) return;
        observer!.observe(item, opts);
      });

      return () => {
        if (observer) {
          observer.disconnect();
          observer = undefined;
        }
      };
    },
    targets,
    { immediate: true, flush: "post", deep: true },
  );
};
