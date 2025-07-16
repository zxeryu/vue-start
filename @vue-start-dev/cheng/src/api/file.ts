import { Router } from "express";
import { responseWrap, StatusEnum } from "../common";
import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync, mkdirSync } from "fs";
import { forEach, last } from "lodash";
import path from "path";
import { TRuntimeConfig } from "../type";

export const router = Router();

// 获取文件列表
router.get("/fileList", (req, res) => {
  try {
    const config: TRuntimeConfig = global.config!;
    const files = config.cheng?.files || [];
    const dirs = config.cheng?.dirs || [];

    type TFile = { path: string; files?: string[] };

    const groupList: { name: string; path: string; list: TFile[] }[] = [];

    forEach(dirs, (dir) => {
      const dirPath = path.join(config.cwd, ...dir.path);

      const list: TFile[] = [];
      groupList.push({ name: last(dir.path)!, path: dirPath, list });

      if (!existsSync(dirPath)) return;

      const files = readdirSync(dirPath);
      forEach(files, (file) => {
        const subDirPath = path.join(dirPath, file);
        if (!existsSync(subDirPath)) return;

        const subFiles = readdirSync(subDirPath);
        list.push({ path: subDirPath, files: subFiles });
      });
    });

    const list: TFile[] = [];
    forEach(files, (file) => {
      const dirPath = path.join(config.cwd, ...file.path);
      if (!existsSync(dirPath)) return;

      const subFiles = readdirSync(dirPath);
      list.push({ path: dirPath, files: subFiles });
    });

    res.json(responseWrap({ groupList, list }, StatusEnum.SUCCESS, ""));
  } catch (e: any) {
    res.json(responseWrap(null, StatusEnum.FAIL, e.message));
  }
});

// 获取文件内容
router.get("/file", (req, res) => {
  try {
    const { filePath, file } = req.query as { filePath: string; file: string };
    //使用readFileSync读取path对应的文件的文本内容
    const content = readFileSync(path.join(filePath, file), { encoding: "utf-8" });
    res.json(responseWrap({ content }, StatusEnum.SUCCESS, ""));
  } catch (e: any) {
    res.json(responseWrap(null, StatusEnum.FAIL, e.message));
  }
});

// 保存文件内容
router.post("/file", (req, res) => {
  console.log("req=", req.body);
  try {
    const { filePath, content } = req.body;
    //使用fs写入json文件
    writeFileSync(filePath, content, { encoding: "utf-8" });
    res.json(responseWrap(null, StatusEnum.SUCCESS, ""));
  } catch (e: any) {
    res.json(responseWrap(null, StatusEnum.FAIL, e.message));
  }
});

//删除文件
router.delete("/file", (req, res) => {
  try {
    const filePath = req.query.filePath as string;
    //使用fs删除json文件
    unlinkSync(filePath);
    res.json(responseWrap(null, StatusEnum.SUCCESS, ""));
  } catch (e: any) {
    res.json(responseWrap(null, StatusEnum.FAIL, e.message));
  }
});

//创建文件
router.put("/file", (req, res) => {
  try {
    const { filePath, name, content } = req.body;
    if (!existsSync(filePath)) {
      mkdirSync(filePath);
    }
    //使用fs创建
    writeFileSync(path.join(filePath, name), content, { encoding: "utf-8" });
    res.json(responseWrap(null, StatusEnum.SUCCESS, ""));
  } catch (e: any) {
    res.json(responseWrap(null, StatusEnum.FAIL, e.message));
  }
});
