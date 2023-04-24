import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { forEach, reduce } from "lodash";

const aliasList = (name) => {
  const cwd = process.cwd();
  const targetPath = join(cwd, name);

  const dirs = readdirSync(targetPath);

  const arr = [];

  forEach(dirs, (dir) => {
    const cssPath = join(targetPath, dir, "index.css");
    if (existsSync(cssPath)) {
      arr.push({ key: name + "/" + dir + "/index.css", value: join(cwd, name, dir, "index.css") });
    }
    arr.push({ key: name + "/" + dir, value: join(cwd, name, dir, "index") });
  });
  return arr;
};

export const dirAlias = () => {
  const arr = aliasList("@vue-start");
  const arrDev = aliasList("@vue-start-dev");
  return reduce(
    [...arr, ...arrDev],
    (pair, item) => {
      return { ...pair, [item.key]: item.value };
    },
    {},
  );
};
