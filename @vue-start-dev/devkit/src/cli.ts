import { devkit } from "./devkit";

export const cli = () => {
  if (process.argv.length < 3) {
    throw new Error("need action");
  }
  const action = process.argv[2];
  const env = process.argv[3];

  const kit = devkit();
  kit.run(action, env);
};
