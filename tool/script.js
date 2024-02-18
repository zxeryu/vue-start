import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { endsWith, forEach, reduce } from "lodash";

const aliasList = (name) => {
  const cwd = process.cwd();
  const targetPath = join(cwd, name);

  const dirs = readdirSync(targetPath);

  const arr = [];

  forEach(dirs, (dir) => {
    const file = lstatSync(join(targetPath, dir));
    if (file.isFile()) return;

    //alias css文件
    const files = readdirSync(join(targetPath, dir));
    forEach(files, (file) => {
      if (endsWith(file, ".css")) {
        arr.push({ key: name + "/" + dir + "/" + file, value: join(cwd, name, dir, file) });
      }
    });

    //alias 文件夹
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
