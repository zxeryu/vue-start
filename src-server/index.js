const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const apiRouters = express.Router();

const user = require("./user");

const setResult = (data, msg) => {
  return {
    code: 200,
    data,
    msg,
  };
};

/****************************** 用户 *********************************/

apiRouters.get("/user/list", (req, res) => {
  const query = req.query;
  return res.json({
    data: user.list(query.page, query.pageSize, query.name, query.gender),
    msg: "用户列表",
  });
});

apiRouters.post("/user/add", (req, res) => {
  const body = req.body;
  user.add(body);
  return res.json(setResult(null, "添加成功"));
});

apiRouters.post("/user/edit", (req, res) => {
  const body = req.body;
  user.edit(body);
  return res.json(setResult(null, "修改成功"));
});

apiRouters.delete("/user/del", (req, res) => {
  const query = req.query;
  user.del(query.id);
  return res.json(setResult(null, "删除成功"));
});

apiRouters.get("/user/detail", (req, res) => {
  const query = req.query;
  return res.json(setResult(user.detail(query.id), "用户详情"));
});

/****************************** 字典 *********************************/
apiRouters.get("/sys-dict", (req, res) => {
  const query = req.query;
  const data = [1, 2, 3].map((i) => ({ value: `${query.type}-v-${i}`, label: `${query.type}-label-${i}` }));
  return res.json(setResult(data, ""));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 全局 中间件  解决所有路由的 跨域问题
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  next();
});

app.use("/", apiRouters);

app.listen(7070, () => {
  console.log("server start");
});
