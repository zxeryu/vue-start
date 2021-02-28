import { devkit } from "./devkit";
import { join } from "path";
import { existsSync } from "fs";

export const cli = () => {
  if (process.argv.length < 4) {
    throw new Error("need full params. like: action app env");
  }
  const action = process.argv[2];
  const name = process.argv[3];
  const env = process.argv[4];

  const cwd = process.cwd();
  const appPath = join(cwd, "src", name);
  if (!existsSync(appPath)) {
    throw new Error("请输入正确的app名称");
  }

  const kit = devkit(undefined, name);
  kit.run(action, env);
};
