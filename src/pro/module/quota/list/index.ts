import { createModule } from "@vue-start/pro";
import configData from "./config.json";
import * as elementConfigExtra from "./config-extra";
import Logic from "./logic";

export default createModule({ configData, elementConfigExtra, Logic });
