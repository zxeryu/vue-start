const { createServer } = require("vite");
const express = require("express");
const bodyParser = require("body-parser");
const { initModuleRoute } = require("./server-module");

const init = async () => {
  const app = express();
  const apiRouters = express.Router();

  process.env.VITE_DEV = JSON.stringify({ entry: "src" });

  const vite = await createServer({
    server: { middlewareMode: "custom" },
  });

  app.use(vite.middlewares);

  //api

  initModuleRoute(apiRouters);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // 全局 中间件  解决所有路由的 跨域问题
  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    next();
  });

  app.listen(vite.config.server.port || 5173);
};

init();
