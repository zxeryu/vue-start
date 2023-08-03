import { createStateUse } from "@vue-start/store";
import { TRegisterStore } from "@vue-start/pro";

export const useFlag = createStateUse<boolean>("flag", false, true);

export const useConfigStore = createStateUse<{ layout: string }>("config", { layout: "compose" }, true);

export const proStore: TRegisterStore = {
  key: "pro",
  initialState: { aaa: "aaa" },
  persist: true,
};
