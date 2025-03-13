type TServer = {
  port?: number; //端口
};

type TModuleItem = {
  path: string[]; //例如：["src","views"]
};

export type TStartConfig = {
  cheng?: {
    server?: TServer;
    list?: TModuleItem;
  };
};

export type TRuntimeConfig = TStartConfig & {
  argv: string[];
}

declare global {
  var config: TRuntimeConfig;
}
