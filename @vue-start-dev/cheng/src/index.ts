import { TRuntimeConfig, TStartConfig } from "./type";
import { join } from "path";
import { existsSync } from "fs";
import { drop } from "lodash";
import { createServer } from "./server";

/**
 * 读取config文件
 */
const loadConfig = (cwd: string): TStartConfig => {
  const configPath = join(cwd, "start.config.js");
  if (!existsSync(configPath)) {
    throw new Error("no start.config.js");
  }
  const config = require(configPath);
  return config as TStartConfig;
};

export const start = () => {
  if (process.argv.length < 3) {
    throw new Error("need action. like: server");
  }

  const cwd = process.cwd();
  const config = loadConfig(cwd);

  const runtimeConfig: TRuntimeConfig = { ...config, argv: drop(process.argv, 3), cwd };

  const action = process.argv[2];

  if (action === "server") {
    createServer(runtimeConfig);
  }
};
