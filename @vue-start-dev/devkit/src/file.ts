import { mkdirSync, existsSync, writeFileSync } from "fs";
import { isAbsolute, resolve, dirname } from "path";

export interface IOpt {
  cwd: string;
}

export const generate = (
  filepath: string,
  content: string,
  opt: IOpt = {
    cwd: process.cwd(),
  } as IOpt,
) => {
  let finalFilepath = filepath;

  if (!isAbsolute(filepath)) {
    finalFilepath = resolve(opt.cwd, filepath);
  }

  const dir = dirname(finalFilepath);

  if (!existsSync(dir)) {
    mkdirSync(dirname(finalFilepath), { recursive: true });
  }

  writeFileSync(finalFilepath, content);

  console.log(`generated file ${finalFilepath}`);
};
