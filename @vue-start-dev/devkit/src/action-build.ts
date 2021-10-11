import { omitBy, isUndefined } from "lodash";
import { IState } from "./state";
import { generate } from "./file";
import { join } from "path";
import { dump } from "js-yaml";
import { stringify } from "querystring";

const omitEmpty = <T extends object = any>(o: T) => omitBy(o, (v) => isUndefined(v));

export const writeConfig = (cwd: string, state: IState) => {
  generate(
    join(cwd, "./config/default.yml"),
    dump(
      omitEmpty({
        APP: state.name,
        ENV: state.env,

        // for overwrite
        PROJECT_NAME: `web-${state.name}`,
        PROJECT_GROUP: state.project.group,
        PROJECT_DESCRIPTION: state.meta.manifest?.name,

        APP_CONFIG: stringify(state.meta.config || {}, ",", "=", {
          encodeURIComponent: (v) => v,
        }),
      }),
    ),
  );
};

export const writehelmxProject = (cwd: string, state: IState) => {
  generate(
    join(cwd, "./helmx.project.yml"),
    dump(
      omitEmpty({
        project: {
          name: `web-${state.name}`,
          group: state.project.group,
          version: "0.0.0",
          description: state.meta.manifest?.name,
        },
        // for overwrite
      }),
    ),
  );
};
