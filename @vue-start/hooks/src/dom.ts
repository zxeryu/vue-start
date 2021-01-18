import { Ref, isRef } from "vue";

export type BasicTarget<T = HTMLElement> = (() => T | null) | T | null | Ref<T | null | undefined>;

export type TargetElement = HTMLElement | Element | Document | Window;

export const getTargetElement = (
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | undefined | null => {
  if (!target) {
    return defaultElement;
  }
  let targetElement: TargetElement | undefined | null;

  if (typeof target === "function") {
    targetElement = target();
  } else if ("current" in target) {
    targetElement = target["current"];
  } else if (isRef(target)) {
    targetElement = target.value;
  } else {
    targetElement = target;
  }

  return targetElement;
};
