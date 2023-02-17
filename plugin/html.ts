import htmlPlugin from "vite-plugin-html-config";

const stringify = (o: object): string => {
  const kvs: string[] = [];

  for (const k in o) {
    let v = o[k];
    if (v.indexOf(",") > -1) {
      v = btoa(v);
    }
    kvs.push(`${k}=${v}`);
  }

  return kvs.join(",");
};

export const createHtml = (env) => {
  return htmlPlugin({
    metas: [
      {
        name: "devkit:config",
        content: stringify(env),
      },
    ],
  });
};
