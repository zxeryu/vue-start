import { isNumber } from "lodash";

/**
 * 小数位数
 * @param value
 */
export const decimalLen = (value: number | string): number => {
  const str: string = isNumber(value) ? String(value) : value;
  if (!value || isNaN(value as number)) {
    return 0;
  }
  const dotIndex = str.indexOf(".");
  const suffix = str.substring(dotIndex + 1);
  return suffix ? suffix.length : 0;
};

/**
 * 保留小数位
 * @param value
 * @param length
 */
export const decimalFixed = (value: number | string, length?: number): string | number => {
  const str: string = isNumber(value) ? String(value) : value;
  if (!str || isNaN(value as number)) {
    return value;
  }
  const dotIndex = str.indexOf(".");
  if (dotIndex === -1) {
    return str;
  }
  const len = length || 2;
  if (str.length - dotIndex > len + 1) {
    return str.substring(0, dotIndex + len + 1);
  }
  return str;
};

/**
 * 千分位处理
 * @param value
 */
export const thousandDivision = (value: string | number): string | number => {
  if (isNaN(value as number)) {
    return value;
  }
  const v = Number(value);
  const str = String(value);
  const suffix = str?.indexOf(".") > -1 ? str.substring(str.lastIndexOf(".")) : "";
  const b = Math.abs(parseInt(value as string)).toString();
  const len = b.length;
  const prefix = v < 0 ? "-" : "";
  if (len <= 3) {
    return prefix + b + suffix;
  }
  const r = len % 3;
  // b.slice(r,len).match(/\d{3}/g).join(",") 每三位数加一个逗号。
  const intVal =
    r > 0
      ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g)!.join(",")
      : b.slice(r, len).match(/\d{3}/g)!.join(",");
  return prefix + intVal + suffix;
};
