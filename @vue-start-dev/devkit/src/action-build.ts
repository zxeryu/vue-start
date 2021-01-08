import { omitBy, isUndefined } from "lodash";
import { IState } from "./state";
import { generate } from "./file";
import { join } from "path";
import { safeDump } from "js-yaml";
import { stringify } from "querystring";

const omitEmpty = <T extends object = any>(o: T) => omitBy(o, (v) => isUndefined(v));

export const writeConfig = (cwd: string, state: IState) => {
  generate(
    join(cwd, "./config/default.yml"),
    safeDump(
      omitEmpty({
        ENV: state.env,
        APP_CONFIG: stringify(state.meta.config || {}, ",", "=", {
          encodeURIComponent: (v) => v,
        }),
      }),
    ),
  );
};
