import { onMounted, onBeforeUnmount } from "vue";
import { BasicTarget, getTargetElement, TargetElement } from "./dom";

type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options = { target?: Target; capture?: boolean; once?: boolean; passive?: boolean };

function useEventListener(eventName: string, handler: Function, options: Options = {}) {
  let targetElement: TargetElement | null = null;

  const eventListener = (event: Event): EventListenerOrEventListenerObject | AddEventListenerOptions => {
    return handler(event);
  };

  onMounted(() => {
    targetElement = getTargetElement(options.target, window)!;
    if (!targetElement) {
      return;
    }
    if (!targetElement.addEventListener) {
      return;
    }
    targetElement.addEventListener(eventName, eventListener, {
      capture: options.capture,
      once: options.once,
      passive: options.passive,
    });
  });

  onBeforeUnmount(() => {
    targetElement && targetElement.removeEventListener(eventName, eventListener, { capture: options.capture });
  });
}

export default useEventListener;
