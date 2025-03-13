import { Router } from "express";
import { resJson } from "../common";
import { readFileSync } from "fs";

/**
 * 根据path读取文件的内容
 */
const readContent = (path: string) => {
  //使用fs读取json文件

  return {};
};

export const dataRouter = Router();

dataRouter.get("/data", (req, res) => {
  const path = req.query.path as string;
  //使用readFileSync读取path对应的文件的文本内容
  const content = readFileSync(path, { encoding: "utf-8" });

  resJson(res, {
    data: { content },
  });
});
