export const formatCode = (str: string) => {
  try {
    return require("prettier").format(str);
  } catch (e) {
    console.error(e);
  }
  return str;
};
