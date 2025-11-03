import { parse } from "./configvalue";
import { App, inject } from "vue";
import { decode } from "js-base64";

const isBase64 = (str: string) => {
  // 首先检查是否只包含 Base64 字符集（包括 = 填充）
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(str)) return false;

  // 长度必须是 4 的倍数
  if (str.length % 4 !== 0) return false;

  try {
    // 尝试解码
    const decoded = atob(str);
    // 再编码回去看是否一致（可选，用于严格校验）
    return btoa(decoded) === str;
  } catch (e) {
    // atob 抛出异常说明不是合法 Base64
    return false;
  }
};
const getDevKitValue = (key: string) => {
  const str = globalThis.document?.querySelector(`meta[name="devkit:${key}"]`)?.getAttribute("content") || "";
  if (str && isBase64(str)) {
    return decode(str);
  }
  return str;
};

type TConfig = { [key: string]: string };

export const getConfig = (): TConfig => {
  const app = parse(getDevKitValue("app"));

  const config = parse(getDevKitValue("config"));

  return { ...config, ...app } as TConfig;
};

const storeKey = "$config";

export const createConfig = () => (app: App) => {
  const config = getConfig();
  app.provide<TConfig>(storeKey, config);
};

export const useConfig = (): TConfig => inject<TConfig>(storeKey)!;
