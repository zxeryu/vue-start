import { createModule } from "@vue-start/pro";
import configData from "./config.json";
import * as configDataExtra from "./config-extra";
import Logic from "./logic";

export default createModule({ configData, configDataExtra, Logic });
