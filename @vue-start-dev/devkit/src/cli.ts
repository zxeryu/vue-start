import { devkit } from "./devkit";

export const cli = () => {
  if (process.argv.length < 4) {
    throw new Error("need full params. like: action app env");
  }
  const action = process.argv[2];
  const name = process.argv[3];
  const env = process.argv[4];

  const kit = devkit(undefined);
  kit.run(action, name, env);
};
