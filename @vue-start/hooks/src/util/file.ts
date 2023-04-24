import { indexOf, isNumber, toLower, map, split } from "lodash";

/**
 * 根据accept和文件名称判断文件是否有效，即：根据文件名称后缀判断
 * @param accept
 * @param fileName
 */
export const isValidFileType = (accept: string, fileName: string): boolean => {
  if (!accept || !fileName) return false;
  const fileSuffix = toLower(fileName.split(".").pop());
  const acceptTypes = map(split(accept, ","), (item) => {
    return toLower(item.replace(".", ""));
  });
  return indexOf(acceptTypes, fileSuffix) > -1;
};

/**
 * 转换文件size
 * @param sizeInBytes
 */
export const convertFileSize = (sizeInBytes: number): string => {
  if (!isNumber(sizeInBytes)) {
    return "" + sizeInBytes;
  }
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  while (sizeInBytes >= 1024 && index < units.length - 1) {
    sizeInBytes /= 1024;
    index++;
  }
  return `${sizeInBytes.toFixed(2)} ${units[index]}`;
};

