import { useEffect } from "@vue-start/hooks";
import { useProModule } from "./Module";
import { TActionEvent } from "../types";

//订阅module事件
export const useModuleEvent = (cb: (action: TActionEvent) => void) => {
  const { subject$ } = useProModule();

  useEffect(() => {
    const sub = subject$.subscribe({
      next: (action) => {
        cb(action);
      },
    });
    return () => {
      return sub.unsubscribe();
    };
  }, []);
};
