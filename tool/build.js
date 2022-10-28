const { join, resolve } = require("path");
const spawn = require("cross-spawn");

const build = () => {
  const targetPath = process.cwd();
  const entry = join(targetPath, "index.ts");
  const outDir = join(targetPath, "dist");

  const dir = resolve(__dirname, "..");

  const ps = targetPath.split("@");
  const tsPath = join(dir, ".tmp", "@" + ps[1], "index.d.ts");

  const dataStr = JSON.stringify({
    entry,
    outDir,
    tsPath,
  });

  spawn.sync(`vite build`, {
    cwd: dir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      VITE_BUILD: dataStr,
    },
  });

  spawn.sync(`rollup -c rollup.config.js`, {
    cwd: dir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      VITE_BUILD: dataStr,
    },
  });
};

build();
