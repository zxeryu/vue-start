module.exports = {
  route: {
    fileType: ".ts",
    options: {
      //屏蔽的文件夹名称
      ignoreDirs: ["component", "components", "demo", "demo-vue"],
      //屏蔽的文件名称
      ignoreFiles: ["component", "components"],
      //查找的文件后缀类型
      fileTypes: [".tsx", ".vue"],
    },
    list: [
      {
        name: "routes",
        path: ["src", "views"], //文件夹路径
        importPrefix: "@/views", //前缀
        generatePath: ["src", "router"], //生成文件路径
        // routeNames: true, //生成名字
        convertData: (routeResult) => {
          //转换数据
          return {
            ...routeResult,
            routeStr: routeResult.routeStr.replace(/.tsx/g, ""),
          };
        },
      },
    ],
  },
  client: {
    fileType: ".ts",
    list: [
      {
        name: "iam",
        // url: "",
        basePath: "",
        // ignorePaths: [],
        // selectPaths: [],
        generatePath: ["src", "clients"],
      },
    ],
  },
};
