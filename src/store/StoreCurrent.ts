import { createStateUse } from "@vue-start/store";

export const useFlag = createStateUse<boolean>("flag", false, true);
