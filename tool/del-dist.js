const { readdirSync, existsSync, rmdirSync } = require("fs");
const { join } = require("path");
const { forEach } = require("lodash");

const deleteDist = (path) => {
  const cwd = process.cwd();
  const targetPath = join(cwd, path);
  const dirs = readdirSync(targetPath);
  forEach(dirs, (dir) => {
    const distPath = join(targetPath, dir, "dist");
    if (existsSync(distPath)) {
      rmdirSync(distPath, { recursive: true });
      console.log(`remove  ${distPath}  success`);
    }
  });
};

deleteDist("@vue-start");

deleteDist("@vue-start-dev");
