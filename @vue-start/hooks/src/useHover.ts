import { BasicTarget } from "./dom";
import useBoolean from "./useBoolean";
import useEventListener from "./useEventListener";

function useHover(
  target: BasicTarget,
  options?: {
    onEnter?: () => void;
    onLeave?: () => void;
  },
): boolean {
  const { onEnter, onLeave } = options || {};
  const [state, { setTrue, setFalse }] = useBoolean();

  useEventListener(
    "mouseenter",
    () => {
      onEnter && onEnter();
      setTrue();
    },
    { target },
  );

  useEventListener(
    "mouseleave",
    () => {
      onLeave && onLeave();
      setFalse();
    },
    { target },
  );

  return state;
}

export default useHover;
