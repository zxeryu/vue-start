import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { get, isObject, has, keys, mapKeys, mapValues, startsWith, isFunction } from "lodash";
import { IState } from "./state";
import { writeConfig } from "./action-build";
import { exec } from "./exec";

type TValueBuilder = (env: string) => string;

const loadConfigFromFile = (cwd: string, state: IState) => {
  state.context = join(cwd, "src", state.name);
  const configFile = join(state.context, "config.js");
  if (!existsSync(configFile)) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const conf = require(configFile);

  const envs = mapKeys(conf.ENVS, (key: string) => key.toLowerCase());

  if (conf.GROUP) {
    state.project.group = conf.GROUP;
  }

  const envKeys = keys(envs);

  if (envKeys.length > 0 && (state.env === "" || !envs[state.env])) {
    console.warn(`[warning] missing env, use ${envKeys[0]} as default, or use one of ${envKeys.join(", ")}`);
    state.env = envKeys[0];
  }

  for (const key in conf) {
    if (has(conf, key) && startsWith(key, "APP_")) {
      const metaKey = key.slice(4).toLowerCase();
      state.meta[metaKey] = mapValues(conf[key], (fnOrValue: TValueBuilder) =>
        isFunction(fnOrValue) ? fnOrValue(state.env) : fnOrValue,
      ) as any;
    }
  }
};

export const devkit = (cwd = process.cwd(), name: string) => {
  let actions: { [k: string]: string } = {
    dev: "echo 'dev'",
    build: "echo 'build'",
  };

  const pkgFile = join(cwd, "package.json");
  if (existsSync(pkgFile)) {
    try {
      const pkgJSON = JSON.parse(String(readFileSync(pkgFile)));
      const d = get(pkgJSON, "devkit");
      if (pkgJSON && isObject(d)) {
        actions = {
          ...actions,
          ...d,
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    actions,
    run: (action: string, env: string) => {
      if (!has(actions, action)) {
        throw new Error(`missing action ${keys(actions).join(", ")}`);
      }

      const state: IState = {
        cwd,
        context: "",
        name,
        env,
        project: {},
        meta: {},
      };

      loadConfigFromFile(cwd, state);

      if (action === "build") {
        writeConfig(cwd, state);
      }

      exec(actions[action], state);
    },
  };
};
