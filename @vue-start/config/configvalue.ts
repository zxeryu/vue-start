export type Config = { [k: string]: string };

export const parse = (s: string): Config => {
  const kvs = s.split(",");
  const c: Config = {};

  kvs.forEach((kv) => {
    if (kv == "") {
      return;
    }

    const [k, ...vs] = kv.split("=");
    const v = vs.join("=");

    c[k] = v;
  });

  return c;
};

export const withPrefix = (o: Config): Config => {
  const ret: Config = {};

  for (const k in o) {
    ret[`APP_CONFIG__${k}`] = o[k];
  }

  return ret;
};

export const stringify = (o: Config): string => {
  const kvs: string[] = [];

  for (const k in o) {
    let v = o[k];
    kvs.push(`${k}=${v}`);
  }

  return kvs.join(",");
};
