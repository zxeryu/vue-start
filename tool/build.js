const { join, resolve } = require("path");
const { copyFileSync, readdirSync } = require("fs");
const spawn = require("cross-spawn");
const { forEach, endsWith } = require("lodash");

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

  //使用vite打包 js ejs文件
  spawn.sync(`vite build`, {
    cwd: dir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      VITE_BUILD: dataStr,
    },
  });

  //打包 .d.ts 文件
  spawn.sync(`rollup -c rollup.config.js`, {
    cwd: dir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      VITE_BUILD: dataStr,
    },
  });

  //copy **.css 文件 （如果有）
  const files = readdirSync(targetPath);
  forEach(files, (file) => {
    if (endsWith(file, ".css")) {
      const outCssPath = join(outDir, file);
      copyFileSync(file, outCssPath);
    }
  });
};

build();
