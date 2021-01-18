import { ref, Ref } from "vue";
import useEventListener from "./useEventListener";

type VisibilityState = "hidden" | "visible" | "prerender" | undefined;

const getVisibility = () => {
  if (typeof document === "undefined") return;
  return document.visibilityState;
};

function useDocumentVisibility(): Ref<VisibilityState> {
  const documentVisibility = ref<VisibilityState>(getVisibility());
  useEventListener(
    "visibilitychange",
    () => {
      documentVisibility.value = getVisibility();
    },
    { target: document },
  );
  return documentVisibility;
}

export default useDocumentVisibility;
