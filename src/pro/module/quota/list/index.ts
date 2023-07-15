import { createModule } from "@vue-start/pro";

export default createModule({
  loader: () => import("./config.json") as any,
});
