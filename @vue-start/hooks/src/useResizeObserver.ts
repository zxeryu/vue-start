import useEffect from "./useEffect";
import { Ref } from "vue";

export const useResizeObserver = (
  domRef: Ref<Element | undefined>,
  callback: ResizeObserverCallback,
  opts?: ResizeObserverOptions,
) => {
  let observer: ResizeObserver | undefined;

  useEffect(() => {
    if (domRef.value) {
      observer = new ResizeObserver(callback);
      observer.observe(domRef.value, opts);
    }

    return () => {
      if (observer) {
        observer.disconnect();
        observer = undefined;
      }
    };
  }, domRef);
};
