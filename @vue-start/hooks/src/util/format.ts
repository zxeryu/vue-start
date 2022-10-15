export const numberFixed = (value: number | string | undefined, len: number = 2) => {
  if (!value) {
    return value;
  }
  const str = String(value);
  const dotIndex = str.indexOf(".");
  if (dotIndex === -1) {
    return dotIndex;
  }
  if (str.length - dotIndex > len + 1) {
    return str.substring(0, dotIndex + len + 1);
  }
  return str;
};

export const numberThousands = (value: number | string) => {
  if (!value || isNaN(value as any)) {
    return value;
  }
  const val = Number(value);
  const str = String(value);
  const suffix = str?.indexOf(".") > -1 ? str.substring(str.lastIndexOf(".")) : "";
  const intStr = Math.abs(parseInt(value as any)).toString();
  const len = intStr.length;
  const operator = val < 0 ? "-" : "";
  if (len <= 3) {
    return operator + intStr + suffix;
  }
  const r = len % 3;
  // b.slice(r,len).match(/\d{3}/g).join(",") 每三位数加一个逗号。
  const intVal =
    r > 0
      ? intStr.slice(0, r) + "," + intStr.slice(r, len)!.match(/\d{3}/g)!.join(",")
      : intStr.slice(r, len)!.match(/\d{3}/g)!.join(",");
  return operator + intVal + suffix;
};
