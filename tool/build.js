const { join, resolve } = require("path");
const { existsSync, copyFileSync } = require("fs");
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

  //copy index.css 文件 （如果有）
  const cssPth = join(targetPath, "index.css");
  if (existsSync(cssPth)) {
    const outCssPath = join(outDir, "index.css");
    copyFileSync(cssPth, outCssPath);
  }
};

build();
