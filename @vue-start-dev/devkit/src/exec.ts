import spawn from "cross-spawn";
import { envValueFromState, IState } from "./webpack/state";

export const exec = (sh: string, state: IState): void => {
  const cmd = spawn(sh, {
    stdio: "inherit",
    shell: true,
    detached: false,
    env: {
      ...process.env,
      DEVKIT: envValueFromState(state),
    },
  });

  cmd.on("close", (code) => {
    if (typeof code === "number" && code !== 0) {
      process.exit(code);
    }
  });

  process.on("SIGINT", () => {
    cmd.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    cmd.kill("SIGTERM");
  });

  process.on("exit", () => {
    cmd.kill();
  });
};

export const syncExec = (sh: string, state: IState): void => {
  spawn.sync(sh, [], {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      DEVKIT: envValueFromState(state),
    },
  });
};
