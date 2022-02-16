import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { get, isObject, has, keys, mapKeys, mapValues, startsWith, isFunction } from "lodash";
import { IState } from "./state";
import { writeConfig, writehelmxProject } from "./action-build";
import { exec } from "./exec";
import { fromCommitRefName, release } from "./action-release";

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

  if (conf.VERSION) {
    state.project.version = conf.VERSION;
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

export const devkit = (cwd = process.cwd()) => {
  let actions: { [k: string]: string } = {
    dev: "echo 'dev'",
    build: "echo 'build'",
    release: "",
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
    run: (action: string, name: string, env: string) => {
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

      if (process.env.CI_COMMIT_REF_NAME) {
        const { name, env } = fromCommitRefName(process.env.CI_COMMIT_REF_NAME);
        state.name = name;
        // state.feature = feature;
        state.env = env;
      }

      const appPath = join(cwd, "src", state.name);
      if (!existsSync(appPath)) {
        throw new Error("请输入正确的app名称");
      }

      loadConfigFromFile(cwd, state);

      if (action === "release") {
        writehelmxProject(cwd, state);
        release(state);
      } else {
        exec(actions[action], state);

        if (action === "build") {
          writeConfig(cwd, state);
        }
      }
    },
  };
};
