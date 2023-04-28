import { useEffect } from "@vue-start/hooks";
import { forEach } from "lodash";

export type TEvents = { type: AMap.EventType; handler: (...args: any[]) => void; once?: boolean }[];

export const useEvents = (eventObj: AMap.Event, events: TEvents) => {
  useEffect(() => {
    forEach(events, (item) => {
      eventObj.on(item.type, item.handler, undefined, item.once);
    });

    return () => {
      forEach(events, (item) => {
        eventObj.off(item.type, item.handler);
      });
    };
  }, []);
};
