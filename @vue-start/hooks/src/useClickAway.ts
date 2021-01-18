import { onBeforeUnmount } from "vue";
import { BasicTarget, getTargetElement } from "./dom";

type EventType = MouseEvent | TouchEvent;

function useClickAway(
  onClickAway: (event: EventType) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string = "click",
) {
  const handler = (event: any) => {
    const targets = Array.isArray(target) ? target : [target];
    if (
      targets.some((targetItem) => {
        const targetElement = getTargetElement(targetItem) as HTMLElement;
        return !targetElement || targetElement?.contains(event.target);
      })
    ) {
      return;
    }
    onClickAway(event);
  };

  document.addEventListener(eventName, handler);

  onBeforeUnmount(() => {
    document.removeEventListener(eventName, handler);
  });
}

export default useClickAway;
