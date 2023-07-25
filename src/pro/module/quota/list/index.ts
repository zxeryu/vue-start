import { createModule } from "@vue-start/pro";
import elementConfigs from "./config.json";
import * as elementConfigExtra from "./config-extra";
import Logic from "./logic";

export default createModule({ elementConfigs, elementConfigExtra, Logic });
