import { endsWith, some, toLower } from "lodash";

const ImageType = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".jfif", ".bmp", ".ico"];
const ExcelType = [".xls", ".xlsx", ".csv"];
const WordType = [".docx"];
const PdfType = [".pdf"];

export const isValidType = (types: string[], name: string) => {
  if (!name) return false;
  const lowerName = toLower(name);
  return some(types, (item) => endsWith(lowerName, item));
};

export const isImageType = (name: string) => isValidType(ImageType, name);
export const isExcelType = (name: string) => isValidType(ExcelType, name);
export const isWordType = (name: string) => isValidType(WordType, name);
export const isPdfType = (name: string) => isValidType(PdfType, name);
