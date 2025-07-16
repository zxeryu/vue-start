import express from "express";
import bodyParser from "body-parser";
import { router as fileRouter } from "./api/file";
import { TRuntimeConfig } from "./type";

export const createServer = (config: TRuntimeConfig) => {
  const app = express();

  global.config = config;

  // 使用 body-parser 中间件来解析 application/json 格式的请求体
  app.use(bodyParser.json());

  //文件读写接口
  app.use("/api", fileRouter);

  //允许跨域
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // 允许所有域名的请求
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // 允许的 HTTP 方法
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // 允许的请求头

    // 处理预检请求（OPTIONS 请求）
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  const port = config.cheng?.server?.port || 5175;

  app.listen(port, () => {
    console.log(`Cheng Server is running on port ${port}`);
  });
};
