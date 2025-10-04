const { join } = require("path");
const { existsSync } = require("fs");
const spawn = require("cross-spawn");

const start = () => {
  const cwd = process.cwd();
  const dir = process.argv[2];

  const entry = join(cwd, dir, "index.ts");

  if (!existsSync(entry)) {
    throw new Error("没有找到启动文件");
  }

  spawn.sync("yarn vite dev", {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      VITE_DEV: JSON.stringify({ entry: dir }),
    },
  });
};

start();
