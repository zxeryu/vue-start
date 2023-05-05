import { createStateUse } from "@vue-start/store";

export const useFlag = createStateUse<boolean>("flag", false, true);

export const useConfigStore = createStateUse<{ layout: string }>("config", { layout: "compose" }, true);
