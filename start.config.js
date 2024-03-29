module.exports = {
  route: {
    fileType: ".ts",
    options: {
      //屏蔽的文件夹名称
      ignoreDirs: ["component", "components", "demo", "demo-vue"],
      //屏蔽的文件名称
      ignoreFiles: ["component", "components", "config-extra"],
      //查找的文件后缀类型
      fileTypes: [".ts", ".tsx", ".vue"],
      //前缀
      importPrefix: "@/views",
    },
    list: [
      {
        name: "routes",
        path: ["src", "views"], //文件夹路径
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
      {
        name: "modules",
        path: ["src", "pro", "module"],
        //options 拓展 自定义
        options: {
          importPrefix: "@/pro/module", //前缀
          simpleLeaf: true, //去除仅有一个叶子节点的数据
        },
        generatePath: ["src", "router"], //生成文件路径
        routeNames: true, //生成名字文件
        convertData: (routeResult) => {
          //转换数据
          return {
            ...routeResult,
            routeStr: routeResult.routeStr.replace(/.ts/g, ""),
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
